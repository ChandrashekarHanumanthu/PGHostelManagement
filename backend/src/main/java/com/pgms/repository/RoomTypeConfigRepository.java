package com.pgms.repository;

import com.pgms.entity.RoomTypeConfig;
import com.pgms.entity.RoomType;
import com.pgms.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeConfigRepository extends JpaRepository<RoomTypeConfig, Long> {
    
    List<RoomTypeConfig> findByHostelAndIsActiveTrue(Hostel hostel);
    
    Optional<RoomTypeConfig> findByHostelAndRoomTypeAndIsActiveTrue(Hostel hostel, RoomType roomType);
    
    List<RoomTypeConfig> findByHostelAndRoomType(Hostel hostel, RoomType roomType);
}
