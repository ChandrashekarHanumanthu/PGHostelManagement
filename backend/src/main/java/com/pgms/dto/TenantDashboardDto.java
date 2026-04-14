package com.pgms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantDashboardDto {
    private RoomDto room;
    private List<PaymentDto> payments;
    private long openComplaints;
    private List<NoticeDto> notices;
}

