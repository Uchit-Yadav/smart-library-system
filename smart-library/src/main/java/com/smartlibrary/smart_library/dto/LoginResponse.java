package com.smartlibrary.smart_library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;   // The JWT string
    private UserDTO user;   // User info (without password!)
}
