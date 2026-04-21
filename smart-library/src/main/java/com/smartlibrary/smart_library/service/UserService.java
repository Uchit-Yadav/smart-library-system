package com.smartlibrary.smart_library.service;

import com.smartlibrary.smart_library.dto.UserDTO;
import com.smartlibrary.smart_library.entity.User;
import com.smartlibrary.smart_library.exception.ResourceNotFoundException;
import com.smartlibrary.smart_library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── GET PROFILE
    public UserDTO getProfile(User user) {
        return mapToDTO(user);
    }

    // ── UPDATE PROFILE
    @Transactional
    public UserDTO updateProfile(User currentUser, String fullName, String phoneNumber) {
        // We receive the actual User entity (from SecurityContext in Phase 6)
        // and update only the allowed fields
        currentUser.setFullName(fullName);
        currentUser.setPhoneNumber(phoneNumber);
        User updated = userRepository.save(currentUser);
        return mapToDTO(updated);
    }

    // ── CHANGE PASSWORD
    @Transactional
    public void changePassword(User currentUser, String oldPassword, String newPassword) {
        // Verify old password first
        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }

        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
    }

    // ── ADMIN: GET ALL USERS
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ── ADMIN: GET USER BY ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToDTO(user);
    }

    // ── ADMIN: DELETE USER
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // ── HELPER
    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}