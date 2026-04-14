package com.pgms.repository;

import com.pgms.entity.Hostel;
import com.pgms.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    
    List<Notice> findByHostel(Hostel hostel);
    
    List<Notice> findByHostelOrderByCreatedAtDesc(Hostel hostel);
    
    List<Notice> findByHostelAndVisibleToOrderByCreatedAtDesc(Hostel hostel, String visibleTo);
    
    java.util.Optional<Notice> findByHostelAndId(Hostel hostel, Long id);
}

