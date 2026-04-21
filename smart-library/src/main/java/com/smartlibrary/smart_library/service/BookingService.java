package com.smartlibrary.smart_library.service;

import com.smartlibrary.smart_library.dto.BookingRequest;
import com.smartlibrary.smart_library.dto.BookingResponse;
import com.smartlibrary.smart_library.entity.*;
import com.smartlibrary.smart_library.exception.BookingConflictException;
import com.smartlibrary.smart_library.exception.ResourceNotFoundException;
import com.smartlibrary.smart_library.repository.BookingRepository;
import com.smartlibrary.smart_library.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, User currentUser) {

        // STEP 1: Validate time range
        if (request.getEndTime().isBefore(request.getStartTime()) ||
                request.getEndTime().equals(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // STEP 2: Find the seat
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Seat not found with ID: " + request.getSeatId()));

        // STEP 3: Check for conflicts (THE CRITICAL CHECK)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                seat.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Seat " + seat.getSeatNumber() + " is already booked for the selected time slot");
        }
        // If we reach here, there are NO conflicts — the slot is free!

        // STEP 4: Create the booking entity
        Booking booking = Booking.builder()
                .user(currentUser)
                .seat(seat)
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(BookingStatus.CONFIRMED)
                .build();

        // STEP 5: Save to database
        Booking savedBooking = bookingRepository.save(booking);

        // STEP 6: Convert to DTO and return
        return mapToBookingResponse(savedBooking);
    }

    // GET USER'S BOOKINGS

    public List<BookingResponse> getUserBookings(User user) {
        List<Booking> bookings = bookingRepository.findByUserOrderByBookingDateDesc(user);

        return bookings.stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    // GET SINGLE BOOKING BY ID
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with ID: " + id));
        return mapToBookingResponse(booking);
    }

    // CANCEL BOOKING
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, User currentUser) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with ID: " + bookingId));

        // Security check: Only the owner or an ADMIN can cancel
        if (!booking.getUser().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        // Business rule: Can only cancel CONFIRMED bookings
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Cannot cancel a booking with status: " + booking.getStatus());
        }

        // Update status
        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        return mapToBookingResponse(updated);
    }

    // GET ALL BOOKINGS (Admin only — called from AdminService)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    // HELPER: Entity → DTO
    private BookingResponse mapToBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .seatId(booking.getSeat().getId())
                .seatNumber(booking.getSeat().getSeatNumber())
                .section(booking.getSeat().getSection())
                .floor(booking.getSeat().getFloor())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus().name())
                .userName(booking.getUser().getFullName())
                .build();
    }
}
