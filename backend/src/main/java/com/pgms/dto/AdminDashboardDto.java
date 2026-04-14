package com.pgms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDto {
    private long totalRooms;
    private long occupiedRooms;
    private long totalTenants;
    private double monthlyRevenue;
    private long pendingComplaints;
}

