package com.smartlibrary.smart_library.controller;

import com.smartlibrary.smart_library.dto.SeatDTO;
import com.smartlibrary.smart_library.dto.SeatRequest;
import com.smartlibrary.smart_library.service.SeatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<List<SeatDTO>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats());
    }
    @GetMapping("/{id}")
    public ResponseEntity<SeatDTO> getSeatById(@PathVariable Long id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    @GetMapping("/available")
    public ResponseEntity<List<SeatDTO>> getAvailableSeats(
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) String section) {
        return ResponseEntity.ok(seatService.getAvailableSeats(floor, section));
    }

    // ── POST /api/seats (Admin only) ─────────────────────────────────────
    // Creates a new seat
    //
    // EXAMPLE REQUEST:
    //   POST http://localhost:8080/api/seats
    //   {
    //     "seatNumber": "D-301",
    //     "floor": 3,
    //     "section": "General",
    //     "seatType": "INDIVIDUAL",
    //     "capacity": 1
    //   }
    @PostMapping
    public ResponseEntity<SeatDTO> createSeat(@Valid @RequestBody SeatRequest request) {
        SeatDTO seat = seatService.createSeat(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(seat);
    }

    // ── PUT /api/seats/{id} (Admin only) ─────────────────────────────────
    // Updates an existing seat's information
    @PutMapping("/{id}")
    public ResponseEntity<SeatDTO> updateSeat(
            @PathVariable Long id,
            @Valid @RequestBody SeatRequest request) {
        return ResponseEntity.ok(seatService.updateSeat(id, request));
    }

    // ── DELETE /api/seats/{id} (Admin only) ──────────────────────────────
    // Removes a seat from the system
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
        // 204 No Content — standard response for successful DELETE
        // "The operation succeeded and there's nothing to return"
    }
}