package com.pgms.controller;

import com.pgms.dto.RoomTypeConfigRequest;
import com.pgms.entity.Hostel;
import com.pgms.entity.Room;
import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.entity.RoomTypeConfig;
import com.pgms.exception.BadRequestException;
import com.pgms.exception.ConflictException;
import com.pgms.repository.RoomRepository;
import com.pgms.repository.RoomTypeConfigRepository;
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
@RequestMapping("/api/admin/room-settings")
@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
public class AdminRoomSettingsController {

    private final RoomTypeConfigRepository roomTypeConfigRepository;
    private final RoomRepository roomRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final UserContextService userContextService;
    private final HostelScopedAccessService hostelScopedAccessService;

    public AdminRoomSettingsController(RoomTypeConfigRepository roomTypeConfigRepository,
                                       RoomRepository roomRepository,
                                       TenantProfileRepository tenantProfileRepository,
                                       UserContextService userContextService,
                                       HostelScopedAccessService hostelScopedAccessService) {
        this.roomTypeConfigRepository = roomTypeConfigRepository;
        this.roomRepository = roomRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.userContextService = userContextService;
        this.hostelScopedAccessService = hostelScopedAccessService;
    }

    @GetMapping
    public ResponseEntity<List<RoomTypeConfig>> getAllRoomConfigs() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return ResponseEntity.ok(roomTypeConfigRepository.findByHostelAndIsActiveTrue(currentHostel));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createRoomConfig(@Valid @RequestBody RoomTypeConfigRequest request) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        validateRoomTypeConfig(request);

        roomTypeConfigRepository.findByHostelAndRoomTypeAndIsActiveTrue(currentHostel, request.getRoomType())
                .ifPresent(existing -> {
                    throw new ConflictException("An active configuration for this room type already exists");
                });

        RoomTypeConfig config = RoomTypeConfig.builder()
                .hostelName(request.getHostelName())
                .roomType(request.getRoomType())
                .capacity(request.getCapacity())
                .rentAmount(request.getRentAmount())
                .maintenanceFeeAmount(request.getMaintenanceFeeAmount() != null ? request.getMaintenanceFeeAmount() : 1000.0)
                .totalRooms(request.getTotalRooms())
                .availableRooms(request.getTotalRooms())
                .description(request.getDescription())
                .amenities(request.getAmenities())
                .isActive(request.getIsActive())
                .hostel(currentHostel)
                .build();

        roomTypeConfigRepository.save(config);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Room type configuration created successfully");
        response.put("id", config.getId().toString());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateRoomConfig(@PathVariable Long id,
                                                                @Valid @RequestBody RoomTypeConfigRequest request) {
        validateRoomTypeConfig(request);

        RoomTypeConfig config = hostelScopedAccessService.getRoomTypeConfig(id);
        if (config.getRoomType() != request.getRoomType()) {
            throw new BadRequestException("Room type cannot be changed after configuration is created");
        }

        config.setHostelName(request.getHostelName());
        config.setCapacity(request.getCapacity());
        config.setRentAmount(request.getRentAmount());
        config.setMaintenanceFeeAmount(request.getMaintenanceFeeAmount() != null ? request.getMaintenanceFeeAmount() : 1000.0);
        config.setTotalRooms(request.getTotalRooms());
        config.setAvailableRooms(request.getTotalRooms());
        config.setDescription(request.getDescription());
        config.setAmenities(request.getAmenities());
        config.setIsActive(request.getIsActive());

        roomTypeConfigRepository.save(config);

        List<Room> roomsToUpdate = roomRepository.findByHostelAndRoomType(config.getHostel(), config.getRoomType());
        for (Room room : roomsToUpdate) {
            room.setRentAmount(config.getRentAmount());
            room.setCapacity(config.getCapacity());
            roomRepository.save(room);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Room type configuration updated successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRoomConfig(@PathVariable Long id) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        RoomTypeConfig config = hostelScopedAccessService.getRoomTypeConfig(id);

        List<Room> roomsToDelete = roomRepository.findByHostelAndRoomType(currentHostel, config.getRoomType());
        List<com.pgms.entity.TenantProfile> allocatedTenants = tenantProfileRepository.findByHostelAndAllocatedRoomIn(currentHostel, roomsToDelete);

        if (!allocatedTenants.isEmpty()) {
            throw new BadRequestException(
                    "Cannot delete room configuration: " + allocatedTenants.size()
                            + " tenant(s) are allocated to rooms of this type. Please re-allocate or remove tenants first."
            );
        }

        roomRepository.deleteAll(roomsToDelete);
        roomTypeConfigRepository.delete(config);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Room type configuration deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate-rooms")
    public ResponseEntity<Map<String, Object>> generateRoomsFromConfig() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        List<RoomTypeConfig> configs = roomTypeConfigRepository.findByHostelAndIsActiveTrue(currentHostel);

        int totalRoomsCreated = 0;
        int totalRoomsDeleted = 0;
        int nextNumber = 101;

        for (RoomTypeConfig config : configs) {
            long existingCountForType = roomRepository.countByHostelAndRoomType(currentHostel, config.getRoomType());
            int desiredCountForType = config.getTotalRooms() != null ? config.getTotalRooms() : 0;

            int roomsToCreate = Math.max(0, desiredCountForType - (int) existingCountForType);
            int roomsToDelete = Math.max(0, (int) existingCountForType - desiredCountForType);

            if (roomsToDelete > 0) {
                List<Room> roomsOfType = roomRepository.findByHostelAndRoomType(currentHostel, config.getRoomType());
                for (Room room : roomsOfType) {
                    if (roomsToDelete <= 0) {
                        break;
                    }

                    Integer occupancy = room.getCurrentOccupancy() != null ? room.getCurrentOccupancy() : 0;
                    if (occupancy == 0) {
                        roomRepository.delete(room);
                        totalRoomsDeleted++;
                        roomsToDelete--;
                    }
                }
            }

            existingCountForType = roomRepository.countByHostelAndRoomType(currentHostel, config.getRoomType());
            roomsToCreate = Math.max(0, desiredCountForType - (int) existingCountForType);

            for (int i = 0; i < roomsToCreate; i++) {
                while (roomRepository.existsByHostelAndRoomNumber(currentHostel, String.valueOf(nextNumber))) {
                    nextNumber++;
                }

                Room room = Room.builder()
                        .roomNumber(String.valueOf(nextNumber))
                        .roomType(config.getRoomType())
                        .capacity(config.getCapacity())
                        .rentAmount(config.getRentAmount())
                        .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                        .currentOccupancy(0)
                        .hostel(currentHostel)
                        .build();

                roomRepository.save(room);
                totalRoomsCreated++;
                nextNumber++;
            }
        }

        int totalRoomsAfterGeneration = 0;
        for (RoomTypeConfig config : configs) {
            totalRoomsAfterGeneration += roomRepository.countByHostelAndRoomType(currentHostel, config.getRoomType());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Rooms generated successfully");
        response.put("totalRoomsGenerated", totalRoomsAfterGeneration);
        response.put("totalRoomsCreated", totalRoomsCreated);
        response.put("totalRoomsDeleted", totalRoomsDeleted);
        response.put("roomTypesConfigured", configs.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getRoomStats() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        List<RoomTypeConfig> configs = roomTypeConfigRepository.findByHostelAndIsActiveTrue(currentHostel);

        Map<String, Object> stats = new HashMap<>();
        stats.put("configuredTypes", configs.size());

        for (RoomTypeConfig config : configs) {
            long availableRooms = roomRepository.countByHostelAndRoomTypeAndAvailabilityStatus(
                    currentHostel, config.getRoomType(), RoomAvailabilityStatus.AVAILABLE);
            long totalRoomsOfType = roomRepository.countByHostelAndRoomType(currentHostel, config.getRoomType());

            Map<String, Object> typeStats = new HashMap<>();
            typeStats.put("configured", config.getTotalRooms());
            typeStats.put("generated", totalRoomsOfType);
            typeStats.put("available", availableRooms);
            typeStats.put("occupied", totalRoomsOfType - availableRooms);
            typeStats.put("rent", config.getRentAmount());

            stats.put(config.getRoomType().toString(), typeStats);
        }

        return ResponseEntity.ok(stats);
    }

    private void validateRoomTypeConfig(RoomTypeConfigRequest request) {
        if (request.getRoomType() == null) {
            throw new BadRequestException("Room type is required");
        }
        if (request.getCapacity() == null || request.getCapacity() <= 0) {
            throw new BadRequestException("Capacity must be greater than zero");
        }
        if (request.getRentAmount() == null || request.getRentAmount() <= 0) {
            throw new BadRequestException("Rent amount must be greater than zero");
        }
        if (request.getTotalRooms() == null || request.getTotalRooms() < 0) {
            throw new BadRequestException("Total rooms must be zero or greater");
        }
    }
}
