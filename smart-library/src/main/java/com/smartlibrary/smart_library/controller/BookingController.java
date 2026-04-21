package com.smartlibrary.smart_library.controller;

import com.smartlibrary.smart_library.dto.BookingRequest;
import com.smartlibrary.smart_library.dto.BookingResponse;
import com.smartlibrary.smart_library.entity.User;
import com.smartlibrary.smart_library.repository.UserRepository;
import com.smartlibrary.smart_library.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
// NOTE: @CrossOrigin is REMOVED — CORS is now handled in SecurityConfig
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        User currentUser = getAuthenticatedUser(userDetails);
        BookingResponse booking = bookingService.createBooking(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // ── GET /api/bookings/my-bookings
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(bookingService.getUserBookings(currentUser));
    }

    // ── GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // ── PUT /api/bookings/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(bookingService.cancelBooking(id, currentUser));
    }
}