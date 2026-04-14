package com.pgms.repository;

import com.pgms.entity.Hostel;
import com.pgms.entity.Room;
import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByHostel(Hostel hostel);
    
    List<Room> findByHostelAndAvailabilityStatus(Hostel hostel, RoomAvailabilityStatus availabilityStatus);
    
    List<Room> findByHostelAndRoomType(Hostel hostel, RoomType roomType);
    
    Optional<Room> findByHostelAndRoomNumber(Hostel hostel, String roomNumber);

    boolean existsByHostelAndRoomNumber(Hostel hostel, String roomNumber);
    
    long countByHostelAndRoomTypeAndAvailabilityStatus(Hostel hostel, RoomType roomType, RoomAvailabilityStatus availabilityStatus);
    
    long countByHostelAndRoomType(Hostel hostel, RoomType roomType);
    
    void deleteByHostelAndRoomType(Hostel hostel, RoomType roomType);
    
    // All queries now require hostel context for multi-tenant security
}
