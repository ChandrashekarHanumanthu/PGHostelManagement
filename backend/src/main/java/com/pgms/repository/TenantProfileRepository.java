package com.pgms.repository;

import com.pgms.entity.Hostel;
import com.pgms.entity.TenantProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TenantProfileRepository extends JpaRepository<TenantProfile, Long> {
    
    List<TenantProfile> findByHostel(Hostel hostel);
    
    List<TenantProfile> findByHostelAndActive(Hostel hostel, Boolean active);
    
    List<TenantProfile> findByHostelAndSignupCompleted(Hostel hostel, Boolean signupCompleted);
    
    List<TenantProfile> findByAllocatedRoomIn(Collection<com.pgms.entity.Room> rooms);
    
    List<TenantProfile> findByHostelAndAllocatedRoomIn(Hostel hostel, Collection<com.pgms.entity.Room> rooms);
    
    List<TenantProfile> findByAllocatedRoom(com.pgms.entity.Room room);

    List<TenantProfile> findByHostelAndAllocatedRoom(Hostel hostel, com.pgms.entity.Room room);
    
    Optional<TenantProfile> findByHostelAndUserId(Hostel hostel, Long userId);
    
    Optional<TenantProfile> findByHostelAndId(Hostel hostel, Long id);
    
    Optional<TenantProfile> findByUserId(Long userId);
    
    Optional<TenantProfile> findBySignupToken(String token);
    
    boolean existsByUserId(Long userId);
    
    boolean existsByHostelAndUserId(Hostel hostel, Long userId);
    
    List<TenantProfile> findBySignupCompletedFalse();
    
    List<TenantProfile> findBySignupCompletedTrue();
    
    List<TenantProfile> findByHostelAndSignupCompletedFalse(Hostel hostel);
    
    List<TenantProfile> findByHostelAndSignupCompletedTrue(Hostel hostel);
    
    List<TenantProfile> findByHostelAndSignupCompletedTrueAndActiveTrue(Hostel hostel);
}
