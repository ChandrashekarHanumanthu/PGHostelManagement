package com.pgms.repository;

import com.pgms.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Long> {
    
    Optional<Hostel> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
