package com.pgms.service;

import com.pgms.dto.RoomDto;
import com.pgms.entity.Hostel;
import com.pgms.entity.Room;
import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.entity.TenantProfile;
import com.pgms.exception.ConflictException;
import com.pgms.repository.RoomRepository;
import com.pgms.repository.TenantProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final UserContextService userContextService;
    private final HostelScopedAccessService hostelScopedAccessService;

    public RoomService(RoomRepository roomRepository,
                       TenantProfileRepository tenantProfileRepository,
                       UserContextService userContextService,
                       HostelScopedAccessService hostelScopedAccessService) {
        this.roomRepository = roomRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.userContextService = userContextService;
        this.hostelScopedAccessService = hostelScopedAccessService;
    }

    public List<RoomDto> getAllRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return roomRepository.findByHostel(currentHostel)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RoomDto getRoom(Long id) {
        return toDto(hostelScopedAccessService.getRoom(id));
    }

    public RoomDto createRoom(RoomDto dto) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        String roomNumber = dto.getRoomNumber() != null ? dto.getRoomNumber().trim() : "";

        if (roomNumber.isEmpty()) {
            throw new com.pgms.exception.BadRequestException("Room number is required");
        }
        if (roomRepository.existsByHostelAndRoomNumber(currentHostel, roomNumber)) {
            throw new ConflictException("Room number already exists in your hostel");
        }

        Room room = new Room();
        room.setRoomNumber(roomNumber);
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setRentAmount(dto.getRentAmount());
        room.setAvailabilityStatus(dto.getAvailabilityStatus() != null ? dto.getAvailabilityStatus() : RoomAvailabilityStatus.AVAILABLE);
        room.setHostel(currentHostel);
        Room saved = roomRepository.save(room);
        return toDto(saved);
    }

    public RoomDto updateRoom(Long id, RoomDto dto) {
        Room room = hostelScopedAccessService.getRoom(id);
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setRentAmount(dto.getRentAmount());
        room.setAvailabilityStatus(dto.getAvailabilityStatus());
        Room saved = roomRepository.save(room);
        return toDto(saved);
    }

    public void deleteRoom(Long id) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Room room = hostelScopedAccessService.getRoom(id);

        List<TenantProfile> allocatedTenants = tenantProfileRepository.findByHostelAndAllocatedRoom(currentHostel, room);
        if (!allocatedTenants.isEmpty()) {
            throw new com.pgms.exception.BadRequestException(
                    "Cannot delete room: " + allocatedTenants.size()
                            + " tenant(s) are allocated to this room. Please re-allocate or remove tenants first."
            );
        }

        roomRepository.delete(room);
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
