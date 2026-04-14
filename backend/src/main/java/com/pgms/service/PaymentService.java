package com.pgms.service;

import com.pgms.dto.PaymentDto;
import com.pgms.entity.Hostel;
import com.pgms.entity.Payment;
import com.pgms.entity.PaymentStatus;
import com.pgms.entity.PaymentType;
import com.pgms.entity.TenantProfile;
import com.pgms.repository.PaymentRepository;
import com.pgms.repository.RoomTypeConfigRepository;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.service.UserContextService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final RoomTypeConfigRepository roomTypeConfigRepository;
    private final UserContextService userContextService;

    public PaymentService(PaymentRepository paymentRepository,
                          TenantProfileRepository tenantProfileRepository,
                          RoomTypeConfigRepository roomTypeConfigRepository,
                          UserContextService userContextService) {
        this.paymentRepository = paymentRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.roomTypeConfigRepository = roomTypeConfigRepository;
        this.userContextService = userContextService;
    }

    public void generateForMonth(String month) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();  // ✅ Get current user's hostel
        List<TenantProfile> activeTenants = tenantProfileRepository.findByHostelAndSignupCompletedTrueAndActiveTrue(currentHostel)  // ✅ Filter by hostel
                .stream()
                .filter(TenantProfile::isActive)
                .filter(t -> t.getAllocatedRoom() != null) // only allocated tenants
                .collect(Collectors.toList());

        YearMonth ym = YearMonth.parse(month);
        for (TenantProfile tenant : activeTenants) {
            boolean exists = paymentRepository.findByMonth(month).stream()
                    .anyMatch(p -> p.getTenant().getId().equals(tenant.getId())
                            && (p.getType() == null || p.getType() == PaymentType.RENT));
            if (!exists) {
                // Use join date (allocationDate) to determine payment due date
                // Payment is due on the same day of month as join date
                // allocationDate is mandatory, but keep fallback for safety
                int joinDay = tenant.getAllocationDate() != null
                        ? tenant.getAllocationDate().toLocalDate().getDayOfMonth()
                        : 1; // Fallback (should not happen as allocationDate is mandatory)
                // Handle months with fewer days (e.g., Feb 30 -> Feb 28/29)
                int dueDay = Math.min(joinDay, ym.lengthOfMonth());
                LocalDate dueDate = ym.atDay(dueDay);

                Payment payment = Payment.builder()
                        .tenant(tenant)
                        .month(month)
                        .amount(tenant.getAllocatedRoom().getRentAmount())
                        .type(PaymentType.RENT)
                        .dueDate(dueDate)
                        .status(PaymentStatus.PENDING)
                        .hostel(currentHostel)  // ✅ Set hostel for data isolation
                        .build();
                paymentRepository.save(payment);
            }
        }
    }

    public List<PaymentDto> getAllPaymentsForMonth(String month) {
        var currentHostel = userContextService.getCurrentUserHostel();
        return paymentRepository.findByHostelAndMonth(currentHostel, month)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getByMonthAndStatus(String month, PaymentStatus status) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return paymentRepository.findByHostelAndMonthAndStatus(currentHostel, month, status)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getByTenant(Long tenantId) {
        TenantProfile tenant = tenantProfileRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
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
        if (tenant.getAllocatedRoom() == null || !tenant.isActive()) return;
        List<Payment> rentPayments = paymentRepository.findByTenant(tenant).stream()
                .filter(p -> p.getType() == null || p.getType() == PaymentType.RENT)
                .collect(Collectors.toList());

        String currentMonth = YearMonth.now().toString();
        boolean hasPending = rentPayments.stream().anyMatch(p -> p.getStatus() == PaymentStatus.PENDING);
        if (hasPending) return;

        boolean hasCurrentMonth = rentPayments.stream().anyMatch(p -> currentMonth.equals(p.getMonth()));
        if (hasCurrentMonth) return;

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
                    : roomTypeConfigRepository.findByHostelAndRoomTypeAndIsActiveTrue(userContextService.getCurrentUserHostel(), tenant.getAllocatedRoom().getRoomType())
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
                .hostel(userContextService.getCurrentUserHostel())  // ✅ Add hostel for data isolation
                .build();
        paymentRepository.save(payment);
    }

    public PaymentDto markPaid(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }

    public PaymentDto approvePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        if (payment.getStatus() != PaymentStatus.SUBMITTED) {
            throw new RuntimeException("Only submitted payments can be approved");
        }
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }

    /**
     * Tenant submits payment for their own pending rent.
     * For online (PHONEPE, GOOGLE_PAY, AMAZON_PAY): marks SUBMITTED (awaiting owner approval).
     * For Cash: keeps PENDING (admin marks paid when cash received).
     */
    public PaymentDto submitTenantPayment(Long tenantId, Long paymentId, String paymentMethod) {
        TenantProfile tenant = tenantProfileRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        if (!payment.getTenant().getId().equals(tenant.getId())) {
            throw new RuntimeException("You can only pay for your own rent");
        }
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("This payment is already " + payment.getStatus());
        }
        payment.setPaymentMethod(paymentMethod);
        
        // For online payments, mark as SUBMITTED (awaiting owner approval)
        if (!"Cash".equals(paymentMethod)) {
            payment.setStatus(PaymentStatus.SUBMITTED);
            payment.setPaymentDate(LocalDate.now());
        } else {
            // For Cash, keep as PENDING until owner confirms
            payment.setStatus(PaymentStatus.PENDING);
        }
        
        Payment saved = paymentRepository.save(payment);
        return toDto(saved);
    }

    public double calculateMonthlyRevenue(String month) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
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
