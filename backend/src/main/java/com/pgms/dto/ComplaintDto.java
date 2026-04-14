package com.pgms.dto;

import com.pgms.entity.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintDto {
    private Long id;
    private Long tenantId;
    private String tenantName;
    private String roomNumber;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private ComplaintStatus status;
    private String adminResponse;
    private LocalDateTime resolvedAt;
    private String resolvedBy;
}

