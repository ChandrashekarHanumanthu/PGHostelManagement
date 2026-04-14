package com.pgms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String photoUrl;
    private String location;
    private String aadhaarNumber;
    private String alternatePhone;
    private String allocationDate;
    private String roomNumber;
    private String hostelName;
    private String hostelAddress;
    private String hostelRegistrationDate;
    private String rentAmount;
    private String paymentStatus;
    private String emergencyContact;
    private String guardianName;
    private String guardianPhone;
}
