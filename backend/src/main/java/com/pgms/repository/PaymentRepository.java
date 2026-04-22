package com.pgms.repository;

import com.pgms.entity.Hostel;
import com.pgms.entity.Payment;
import com.pgms.entity.PaymentStatus;
import com.pgms.entity.TenantProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByHostel(Hostel hostel);
    
    List<Payment> findByHostelAndTenant(Hostel hostel, TenantProfile tenant);
    
    List<Payment> findByTenant(TenantProfile tenant);

    List<Payment> findByHostelAndMonthAndStatus(Hostel hostel, String month, PaymentStatus status);
    
    List<Payment> findByMonthAndStatus(String month, PaymentStatus status);

    List<Payment> findByHostelAndMonth(Hostel hostel, String month);
    
    List<Payment> findByMonth(String month);
    
    List<Payment> findByHostelAndStatus(Hostel hostel, PaymentStatus status);

    Optional<Payment> findByHostelAndId(Hostel hostel, Long id);
}

