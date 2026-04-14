package com.pgms.service;

import com.pgms.dto.RoomDto;
import com.pgms.entity.Hostel;
import com.pgms.entity.Room;
import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.entity.TenantProfile;
import com.pgms.repository.RoomRepository;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.service.UserContextService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final UserContextService userContextService;

    public RoomService(RoomRepository roomRepository, TenantProfileRepository tenantProfileRepository, UserContextService userContextService) {
        this.roomRepository = roomRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.userContextService = userContextService;
    }

    public List<RoomDto> getAllRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return roomRepository.findByHostel(currentHostel)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RoomDto getRoom(Long id) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return roomRepository.findById(id)
                .filter(room -> room.getHostel().getId().equals(currentHostel.getId()))
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Room not found in your hostel"));
    }

    public RoomDto createRoom(RoomDto dto) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Room room = new Room();
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setRentAmount(dto.getRentAmount());
        room.setAvailabilityStatus(dto.getAvailabilityStatus() != null ? dto.getAvailabilityStatus() : RoomAvailabilityStatus.AVAILABLE);
        room.setHostel(currentHostel);  // ✅ Set hostel for data isolation
        Room saved = roomRepository.save(room);
        return toDto(saved);
    }

    public RoomDto updateRoom(Long id, RoomDto dto) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Room room = roomRepository.findById(id)
                .filter(r -> r.getHostel().getId().equals(currentHostel.getId()))
                .orElseThrow(() -> new RuntimeException("Room not found in your hostel"));
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setRentAmount(dto.getRentAmount());
        room.setAvailabilityStatus(dto.getAvailabilityStatus());
        // hostel_id already set from existing room - don't change it
        Room saved = roomRepository.save(room);
        return toDto(saved);
    }

    public void deleteRoom(Long id) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Room room = roomRepository.findById(id)
                .filter(r -> r.getHostel().getId().equals(currentHostel.getId()))
                .orElseThrow(() -> new RuntimeException("Room not found in your hostel"));
        
        // Check if any tenants are allocated to this room
        List<TenantProfile> allocatedTenants = tenantProfileRepository.findByAllocatedRoom(room);
        
        if (!allocatedTenants.isEmpty()) {
            throw new RuntimeException("Cannot delete room: " + allocatedTenants.size() + 
                    " tenant(s) are allocated to this room. Please re-allocate or remove tenants first.");
        }
        
        roomRepository.deleteById(id);
    }

    public long countTotalRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return roomRepository.findByHostel(currentHostel).size();
    }

    public long countOccupiedRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return roomRepository.findByHostelAndAvailabilityStatus(currentHostel, RoomAvailabilityStatus.OCCUPIED).size();
    }

    private RoomDto toDto(Room room) {
        return RoomDto.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .capacity(room.getCapacity())
                .rentAmount(room.getRentAmount())
                .availabilityStatus(room.getAvailabilityStatus())
                .build();
    }
}

