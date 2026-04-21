package com.smartlibrary.smart_library.service;

import com.smartlibrary.smart_library.dto.*;
import com.smartlibrary.smart_library.entity.Role;
import com.smartlibrary.smart_library.entity.User;
import com.smartlibrary.smart_library.exception.ResourceNotFoundException;
import com.smartlibrary.smart_library.repository.UserRepository;
// NOTE: JwtTokenProvider import will be added in Phase 6
// For now, we'll return a placeholder token
import com.smartlibrary.smart_library.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {



    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // REGISTER — Creates a new user account

    public UserDTO register(RegisterRequest request) {

        // STEP 1: Check if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // STEP 2: Build the User entity from the request DTO
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))  // ← HASHING!
                .role(Role.USER)  // Every new registration is a USER
                .phoneNumber(request.getPhoneNumber())
                .build();

        // STEP 3: Save to database
        User savedUser = userRepository.save(user);

        // STEP 4: Convert entity to DTO and return
        return mapToUserDTO(savedUser);
    }


    // LOGIN — Validates credentials and returns JWT token

    public LoginResponse login(LoginRequest request) {

        // STEP 1: Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        // STEP 2: Compare passwords
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        // STEP 3: Generate JWT token
        String token = jwtTokenProvider.generateToken(user);

        // STEP 4: Return token + user info
        return new LoginResponse(token, mapToUserDTO(user));
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())  // Role.USER → "USER" string
                .build();
    }
}