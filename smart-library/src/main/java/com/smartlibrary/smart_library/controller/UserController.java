package com.smartlibrary.smart_library.controller;

import com.smartlibrary.smart_library.dto.UserDTO;
import com.smartlibrary.smart_library.entity.User;
import com.smartlibrary.smart_library.repository.UserRepository;
import com.smartlibrary.smart_library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // Same helper as BookingController
    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ── GET /api/users/profile
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(userService.getProfile(currentUser));
    }

    // ── PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        User currentUser = getAuthenticatedUser(userDetails);
        String fullName = request.getOrDefault("fullName", currentUser.getFullName());
        String phone = request.getOrDefault("phoneNumber", currentUser.getPhoneNumber());
        return ResponseEntity.ok(userService.updateProfile(currentUser, fullName, phone));
    }

    // ── PUT /api/users/change-password
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        User currentUser = getAuthenticatedUser(userDetails);
        userService.changePassword(
                currentUser,
                request.get("oldPassword"),
                request.get("newPassword")
        );
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}