package com.pgms.repository;

import com.pgms.entity.Complaint;
import com.pgms.entity.ComplaintStatus;
import com.pgms.entity.Hostel;
import com.pgms.entity.TenantProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByHostel(Hostel hostel);
    
    List<Complaint> findByHostelAndTenant(Hostel hostel, TenantProfile tenant);

    List<Complaint> findByHostelAndStatus(Hostel hostel, ComplaintStatus status);
    
    long countByHostelAndStatus(Hostel hostel, ComplaintStatus status);
    
    long countByStatus(ComplaintStatus status);
    
    java.util.Optional<Complaint> findByHostelAndId(Hostel hostel, Long id);
}

