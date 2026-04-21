package com.smartlibrary.smart_library.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SeatRequest {
    @NotBlank private String seatNumber;
    @NotNull private Integer floor;
    @NotBlank private String section;
    @NotBlank private String seatType;
    @NotNull @Min(1) private Integer capacity;
}