package com.pgms.dto;

import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.entity.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDto {
    private Long id;
    private String roomNumber;
    private RoomType roomType;
    private Integer capacity;
    private Double rentAmount;
    private RoomAvailabilityStatus availabilityStatus;
}

