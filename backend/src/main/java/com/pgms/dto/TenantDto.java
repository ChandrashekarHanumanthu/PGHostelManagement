package com.pgms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantDto {
    private Long id;
    private UserDto user;
    private String phone;
    private String alternatePhone;
    private String location;
    private String aadhaarNumber;
    private String photoUrl;
    private RoomDto allocatedRoom;
    private String allocationDate;
    private boolean signupCompleted;
    private boolean active;
    private Double maintenanceFeeAmount;
    private String leaveDate;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String phone;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomDto {
        private Long id;
        private String roomNumber;
        private String roomType;
        private Integer capacity;
        private Integer currentOccupancy;
        private Double rentAmount;
    }
}
