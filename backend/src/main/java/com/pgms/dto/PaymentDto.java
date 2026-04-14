package com.pgms.dto;

import com.pgms.entity.PaymentStatus;
import com.pgms.entity.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDto {
    private Long id;
    private Long tenantId;
    private String tenantName;
    private String month;
    private Double amount;
    private String paymentMethod;
    private PaymentType type;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private PaymentStatus status;
    private LocalDate joinDate;
}

