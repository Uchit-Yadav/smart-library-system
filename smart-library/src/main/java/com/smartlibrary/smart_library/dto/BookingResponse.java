package com.smartlibrary.smart_library.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private Long seatId;
    private String seatNumber;
    private String section;
    private Integer floor;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private String userName;
}