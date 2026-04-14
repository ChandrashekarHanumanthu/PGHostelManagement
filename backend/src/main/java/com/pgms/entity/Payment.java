package com.pgms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private TenantProfile tenant;

    @Column(nullable = false, length = 7)
    private String month; // e.g. 2026-02

    @Column(nullable = false)
    private Double amount;

    @Column(name = "payment_method", length = 20)
    private String paymentMethod; // SCANNER / Cash / GOOGLE_PAY / PHONEPE / AMAZON_PAY / etc.

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private PaymentType type; // RENT / MAINTENANCE_FEE / REFUND

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;
}

