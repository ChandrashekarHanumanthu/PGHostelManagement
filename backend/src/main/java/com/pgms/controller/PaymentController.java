package com.pgms.controller;

import com.pgms.dto.PaymentDto;
import com.pgms.entity.PaymentStatus;
import com.pgms.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/payments/generate-month/{yearMonth}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<Void> generateForMonth(@PathVariable String yearMonth) {
        paymentService.generateForMonth(yearMonth);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/payments")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<List<PaymentDto>> getPaymentsByMonthAndStatus(@RequestParam String month,
                                                                        @RequestParam(required = false) PaymentStatus status) {
        if (status != null) {
            return ResponseEntity.ok(paymentService.getByMonthAndStatus(month, status));
        } else {
            // Return all payments for the month regardless of status
            return ResponseEntity.ok(paymentService.getAllPaymentsForMonth(month));
        }
    }

    @PutMapping("/payments/{id}/mark-paid")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<PaymentDto> markPaid(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.markPaid(id));
    }

    @PutMapping("/payments/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public ResponseEntity<PaymentDto> approvePayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.approvePayment(id));
    }

    @GetMapping("/tenants/{tenantId}/payments")
    @PreAuthorize("hasRole('ADMIN') or #tenantId == authentication.principal.id")
    public ResponseEntity<List<PaymentDto>> getTenantPayments(@PathVariable Long tenantId) {
        return ResponseEntity.ok(paymentService.getByTenant(tenantId));
    }

    @PostMapping("/tenants/{tenantId}/payments/{paymentId}/submit")
    @PreAuthorize("hasRole('ADMIN') or #tenantId == authentication.principal.id")
    public ResponseEntity<PaymentDto> submitTenantPayment(
            @PathVariable Long tenantId,
            @PathVariable Long paymentId,
            @RequestParam String paymentMethod) {
        return ResponseEntity.ok(paymentService.submitTenantPayment(tenantId, paymentId, paymentMethod));
    }
}

