package com.smartlibrary.smart_library.controller;

import com.smartlibrary.smart_library.dto.BookingResponse;
import com.smartlibrary.smart_library.dto.UserDTO;
import com.smartlibrary.smart_library.entity.User;
import com.smartlibrary.smart_library.repository.UserRepository;
import com.smartlibrary.smart_library.service.BookingService;
import com.smartlibrary.smart_library.service.SeatService;
import com.smartlibrary.smart_library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final BookingService bookingService;
    private final SeatService seatService;
    private final UserRepository userRepository;

    // Helper — same pattern
    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ── GET /api/admin/users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ── PUT /api/admin/bookings/{id}/cancel
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User admin = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(bookingService.cancelBooking(id, admin));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> stats = new HashMap<>();
        List<UserDTO> users = userService.getAllUsers();
        List<BookingResponse> bookings = bookingService.getAllBookings();

        stats.put("totalUsers", users.size());
        stats.put("totalSeats", seatService.getAllSeats().size());
        stats.put("totalBookings", bookings.size());
        stats.put("activeBookings", bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .count());
        stats.put("availableSeats", seatService.getAllSeats().stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsAvailable()))
                .count());

        return ResponseEntity.ok(stats);
    }
}