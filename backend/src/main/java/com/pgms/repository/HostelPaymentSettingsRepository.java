package com.pgms.repository;

import com.pgms.entity.Hostel;
import com.pgms.entity.HostelPaymentSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelPaymentSettingsRepository extends JpaRepository<HostelPaymentSettings, Long> {
    
    Optional<HostelPaymentSettings> findByHostel(Hostel hostel);
    
    void deleteByHostel(Hostel hostel);
}
