package com.pgms.controller;

import com.pgms.entity.Hostel;
import com.pgms.entity.Room;
import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.entity.TenantProfile;
import com.pgms.exception.BadRequestException;
import com.pgms.exception.ConflictException;
import com.pgms.repository.RoomRepository;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.service.HostelScopedAccessService;
import com.pgms.service.UserContextService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rooms")
@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
public class AdminRoomController {

    private final RoomRepository roomRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final UserContextService userContextService;
    private final HostelScopedAccessService hostelScopedAccessService;

    public AdminRoomController(RoomRepository roomRepository,
                               TenantProfileRepository tenantProfileRepository,
                               UserContextService userContextService,
                               HostelScopedAccessService hostelScopedAccessService) {
        this.roomRepository = roomRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.userContextService = userContextService;
        this.hostelScopedAccessService = hostelScopedAccessService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createRoom(@Valid @RequestBody Room room) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        String roomNumber = room.getRoomNumber() != null ? room.getRoomNumber().trim() : "";

        if (roomNumber.isEmpty()) {
            throw new BadRequestException("Room number is required");
        }
        if (room.getRoomType() == null) {
            throw new BadRequestException("Room type is required");
        }
        if (room.getRentAmount() == null || room.getRentAmount() <= 0) {
            throw new BadRequestException("Rent amount must be greater than zero");
        }
        if (roomRepository.existsByHostelAndRoomNumber(currentHostel, roomNumber)) {
            throw new ConflictException("Room number already exists");
        }

        room.setRoomNumber(roomNumber);
        room.setCapacity(room.getCapacity() != null ? room.getCapacity() : room.getRoomType().getCapacity());
        room.setCurrentOccupancy(0);
        room.setAvailabilityStatus(room.getAvailabilityStatus() != null ? room.getAvailabilityStatus() : RoomAvailabilityStatus.AVAILABLE);
        room.setHostel(currentHostel);
        roomRepository.save(room);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Room created successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return ResponseEntity.ok(roomRepository.findByHostel(currentHostel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateRoom(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Room room = hostelScopedAccessService.getRoom(id);
        String newRoomNumber = request.get("roomNumber") != null ? request.get("roomNumber").trim() : "";

        if (newRoomNumber.isEmpty()) {
            throw new BadRequestException("Room number cannot be empty");
        }

        roomRepository.findByHostelAndRoomNumber(currentHostel, newRoomNumber)
                .filter(existingRoom -> !existingRoom.getId().equals(room.getId()))
                .ifPresent(existingRoom -> {
                    throw new ConflictException("Room number already exists");
                });

        room.setRoomNumber(newRoomNumber);
        roomRepository.save(room);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Room number updated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/tenants")
    public ResponseEntity<List<Map<String, Object>>> getRoomTenants(@PathVariable Long id) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Room room = hostelScopedAccessService.getRoom(id);

        List<Map<String, Object>> tenants = tenantProfileRepository.findByHostelAndAllocatedRoom(currentHostel, room)
                .stream()
                .map(this::toTenantSummary)
                .toList();

        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return ResponseEntity.ok(roomRepository.findByHostelAndAvailabilityStatus(currentHostel, RoomAvailabilityStatus.AVAILABLE));
    }

    private Map<String, Object> toTenantSummary(TenantProfile tenantProfile) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", tenantProfile.getId());
        summary.put("userId", tenantProfile.getUser().getId());
        summary.put("name", tenantProfile.getUser().getName());
        summary.put("email", tenantProfile.getUser().getEmail());
        summary.put("phone", tenantProfile.getPhone() != null && !tenantProfile.getPhone().isBlank()
                ? tenantProfile.getPhone()
                : tenantProfile.getUser().getPhone());
        summary.put("active", tenantProfile.isActive());
        summary.put("signupCompleted", tenantProfile.isSignupCompleted());
        return summary;
    }
}
