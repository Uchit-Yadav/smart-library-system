package com.smartlibrary.smart_library.service;

import com.smartlibrary.smart_library.dto.SeatDTO;
import com.smartlibrary.smart_library.dto.SeatRequest;
import com.smartlibrary.smart_library.entity.Seat;
import com.smartlibrary.smart_library.entity.SeatType;
import com.smartlibrary.smart_library.exception.ResourceNotFoundException;
import com.smartlibrary.smart_library.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;

    // ── GET ALL SEATS ────────────────────────────────────────────────────
    public List<SeatDTO> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ── GET SEAT BY ID ───────────────────────────────────────────────────
    public SeatDTO getSeatById(Long id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + id));
        return mapToDTO(seat);
    }

    // ── GET AVAILABLE SEATS (with optional filters) ──────────────────────
    public List<SeatDTO> getAvailableSeats(Integer floor, String section) {
        List<Seat> seats;

        if (floor != null && section != null && !section.isEmpty()) {
            seats = seatRepository.findByFloorAndSection(floor, section);
        } else if (floor != null) {
            seats = seatRepository.findByFloor(floor);
        } else if (section != null && !section.isEmpty()) {
            seats = seatRepository.findBySection(section);
        } else {
            seats = seatRepository.findAll();
        }

        return seats.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ── CREATE SEAT (Admin) ──────────────────────────────────────────────
    @Transactional
    public SeatDTO createSeat(SeatRequest request) {
        if (seatRepository.existsBySeatNumber(request.getSeatNumber())) {
            throw new IllegalArgumentException(
                    "Seat number " + request.getSeatNumber() + " already exists");
        }

        Seat seat = Seat.builder()
                .seatNumber(request.getSeatNumber())
                .floor(request.getFloor())
                .section(request.getSection())
                .seatType(SeatType.valueOf(request.getSeatType())) // "INDIVIDUAL" → SeatType.INDIVIDUAL
                .capacity(request.getCapacity())
                .isAvailable(true)
                .build();

        Seat saved = seatRepository.save(seat);
        return mapToDTO(saved);
    }

    // ── UPDATE SEAT (Admin) ──────────────────────────────────────────────
    @Transactional
    public SeatDTO updateSeat(Long id, SeatRequest request) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + id));

        seat.setSeatNumber(request.getSeatNumber());
        seat.setFloor(request.getFloor());
        seat.setSection(request.getSection());
        seat.setSeatType(SeatType.valueOf(request.getSeatType()));
        seat.setCapacity(request.getCapacity());

        Seat updated = seatRepository.save(seat);
        return mapToDTO(updated);
    }

    // ── DELETE SEAT (Admin) ──────────────────────────────────────────────
    @Transactional
    public void deleteSeat(Long id) {
        if (!seatRepository.existsById(id)) {
            throw new ResourceNotFoundException("Seat not found with ID: " + id);
        }
        seatRepository.deleteById(id);
    }

    // ── HELPER ───────────────────────────────────────────────────────────
    private SeatDTO mapToDTO(Seat seat) {
        return SeatDTO.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .floor(seat.getFloor())
                .section(seat.getSection())
                .isAvailable(seat.getIsAvailable())
                .seatType(seat.getSeatType().name())
                .capacity(seat.getCapacity())
                .build();
    }
}
