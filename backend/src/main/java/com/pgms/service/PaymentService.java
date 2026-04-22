package com.pgms.service;

import com.pgms.dto.PaymentDto;
import com.pgms.entity.Hostel;
import com.pgms.entity.Payment;
import com.pgms.entity.PaymentStatus;
import com.pgms.entity.PaymentType;
import com.pgms.entity.TenantProfile;
import com.pgms.exception.BadRequestException;
import com.pgms.repository.PaymentRepository;
import com.pgms.repository.RoomTypeConfigRepository;
import com.pgms.repository.TenantProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final RoomTypeConfigRepository roomTypeConfigRepository;
    private final HostelScopedAccessService hostelScopedAccessService;

    public PaymentService(PaymentRepository paymentRepository,
                          TenantProfileRepository tenantProfileRepository,
                          RoomTypeConfigRepository roomTypeConfigRepository,
                          HostelScopedAccessService hostelScopedAccessService) {
        this.paymentRepository = paymentRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.roomTypeConfigRepository = roomTypeConfigRepository;
        this.hostelScopedAccessService = hostelScopedAccessService;
    }

    public void generateForMonth(String month) {
        Hostel currentHostel = hostelScopedAccessService.getCurrentHostel();
        List<TenantProfile> activeTenants = tenantProfileRepository.findByHostelAndSignupCompletedTrueAndActiveTrue(currentHostel)
                .stream()
                .filter(TenantProfile::isActive)
                .filter(t -> t.getAllocatedRoom() != null)
                .collect(Collectors.toList());

        YearMonth ym = YearMonth.parse(month);
        Set<Long> tenantsWithRentForMonth = paymentRepository.findByHostelAndMonth(currentHostel, month)
                .stream()
                .filter(p -> p.getType() == null || p.getType() == PaymentType.RENT)
                .map(p -> p.getTenant().getId())
                .collect(Collectors.toSet());

        for (TenantProfile tenant : activeTenants) {
            if (tenantsWithRentForMonth.contains(tenant.getId())) {
                continue;
            }

            int joinDay = tenant.getAllocationDate() != null
                    ? tenant.getAllocationDate().toLocalDate().getDayOfMonth()
                    : 1;
            int dueDay = Math.min(joinDay, ym.lengthOfMonth());
            LocalDate dueDate = ym.atDay(dueDay);

            Payment payment = Payment.builder()
                    .tenant(tenant)
                    .month(month)
                    .amount(tenant.getAllocatedRoom().getRentAmount())
                    .type(PaymentType.RENT)
                    .dueDate(dueDate)
                    .status(PaymentStatus.PENDING)
                    .hostel(currentHostel)
                    .build();
            paymentRepository.save(payment);
        }
    }

    public List<PaymentDto> getAllPaymentsForMonth(String month) {
        Hostel currentHostel = hostelScopedAccessService.getCurrentHostel();
        return paymentRepository.findByHostelAndMonth(currentHostel, month)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getByMonthAndStatus(String month, PaymentStatus status) {
        Hostel currentHostel = hostelScopedAccessService.getCurrentHostel();
        return paymentRepository.findByHostelAndMonthAndStatus(currentHostel, month, status)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getByTenant(Long tenantId) {
        TenantProfile tenant = hostelScopedAccessService.getTenant(tenantId);
        ensureFirstMonthRentIfNeeded(tenant);
        return paymentRepository.findByTenant(tenant)
                .stream()
                .filter(p -> p.getType() == null || p.getType() == PaymentType.RENT)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Ensures tenant has pending rent for the due month.
     * First month: rent + maintenance (one combined payment). Next months: rent only.
     */
    private void ensureFirstMonthRentIfNeeded(TenantProfile tenant) {
        if (tenant.getAllocatedRoom() == null || !tenant.isActive()) {
            return;
        }

        Hostel tenantHostel = tenant.getHostel();
        if (tenantHostel == null) {
            throw new BadRequestException("Tenant is not associated with a hostel");
        }

        List<Payment> rentPayments = paymentRepository.findByTenant(tenant).stream()
                .filter(p -> p.getType() == null || p.getType() == PaymentType.RENT)
                .collect(Collectors.toList());

        String currentMonth = YearMonth.now().toString();
        boolean hasPending = rentPayments.stream().anyMatch(p -> p.getStatus() == PaymentStatus.PENDING);
        if (hasPending) {
            return;
        }

        boolean hasCurrentMonth = rentPayments.stream().anyMatch(p -> currentMonth.equals(p.getMonth()));
        if (hasCurrentMonth) {
            return;
        }

        int joinDay = tenant.getAllocationDate() != null
                ? tenant.getAllocationDate().toLocalDate().getDayOfMonth()
                : 1;
        YearMonth ym = YearMonth.parse(currentMonth);
        int dueDay = Math.min(joinDay, ym.lengthOfMonth());
        LocalDate dueDate = ym.atDay(dueDay);

        double rentAmount = tenant.getAllocatedRoom().getRentAmount();
        boolean isFirstMonth = rentPayments.isEmpty();
        double maintenanceAmount = 0;
        if (isFirstMonth) {
            maintenanceAmount = tenant.getMaintenanceFeeAmount() != null && tenant.getMaintenanceFeeAmount() > 0
                    ? tenant.getMaintenanceFeeAmount()
                    : roomTypeConfigRepository.findByHostelAndRoomTypeAndIsActiveTrue(tenantHostel, tenant.getAllocatedRoom().getRoomType())
                            .map(c -> c.getMaintenanceFeeAmount() != null && c.getMaintenanceFeeAmount() > 0 ? c.getMaintenanceFeeAmount() : 1000.0)
                            .orElse(1000.0);
        }
        double totalAmount = rentAmount + maintenanceAmount;

        Payment payment = Payment.builder()
                .tenant(tenant)
                .month(currentMonth)
                .amount(totalAmount)
                .type(PaymentType.RENT)
                .dueDate(dueDate)
                .status(PaymentStatus.PENDING)
                .hostel(tenantHostel)
                .build();
        paymentRepository.save(payment);
    }

    public PaymentDto markPaid(Long id) {
        Payment payment = hostelScopedAccessService.getPayment(id);
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }

    public PaymentDto approvePayment(Long id) {
        Payment payment = hostelScopedAccessService.getPayment(id);
        if (payment.getStatus() != PaymentStatus.SUBMITTED) {
            throw new BadRequestException("Only submitted payments can be approved");
        }
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }

    /**
     * Tenant submits payment for their own pending rent.
     * For online payments, marks SUBMITTED until owner approval.
     * For cash, keeps PENDING until the owner confirms receipt.
     */
    public PaymentDto submitTenantPayment(Long tenantId, Long paymentId, String paymentMethod) {
        TenantProfile tenant = hostelScopedAccessService.getTenant(tenantId);
        Payment payment = hostelScopedAccessService.getPayment(paymentId);
        String normalizedMethod = paymentMethod != null ? paymentMethod.trim() : "";

        if (normalizedMethod.isEmpty()) {
            throw new BadRequestException("Payment method is required");
        }

        if (!payment.getTenant().getId().equals(tenant.getId())) {
            throw new BadRequestException("You can only pay for your own rent");
        }
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("This payment is already " + payment.getStatus());
        }

        payment.setPaymentMethod(normalizedMethod);
        if (!"Cash".equals(normalizedMethod)) {
            payment.setStatus(PaymentStatus.SUBMITTED);
            payment.setPaymentDate(LocalDate.now());
        } else {
            payment.setStatus(PaymentStatus.PENDING);
        }

        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }

    public double calculateMonthlyRevenue(String month) {
        Hostel currentHostel = hostelScopedAccessService.getCurrentHostel();
        return paymentRepository.findByHostelAndMonthAndStatus(currentHostel, month, PaymentStatus.PAID)
                .stream()
                .mapToDouble(Payment::getAmount)
                .sum();
    }

    private PaymentDto toDto(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .tenantId(payment.getTenant().getId())
                .tenantName(payment.getTenant().getUser().getName())
                .month(payment.getMonth())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .type(payment.getType() != null ? payment.getType() : PaymentType.RENT)
                .dueDate(payment.getDueDate())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .joinDate(payment.getTenant().getAllocationDate().toLocalDate())
                .build();
    }
}
