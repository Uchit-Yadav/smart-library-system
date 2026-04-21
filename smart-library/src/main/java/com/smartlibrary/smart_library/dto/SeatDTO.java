package com.smartlibrary.smart_library.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SeatDTO {
    private Long id;
    private String seatNumber;
    private Integer floor;
    private String section;
    private Boolean isAvailable;
    private String seatType;
    private Integer capacity;
}