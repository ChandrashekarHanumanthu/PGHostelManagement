package com.pgms.controller;

import com.pgms.dto.RoomTypeConfigRequest;
import com.pgms.entity.RoomTypeConfig;
import com.pgms.entity.Hostel;
import com.pgms.repository.RoomTypeConfigRepository;
import com.pgms.repository.RoomRepository;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.entity.Room;
import com.pgms.entity.TenantProfile;
import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.service.UserContextService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/room-settings")
@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
@CrossOrigin
public class AdminRoomSettingsController {

    private final RoomTypeConfigRepository roomTypeConfigRepository;
    private final RoomRepository roomRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final UserContextService userContextService;

    public AdminRoomSettingsController(RoomTypeConfigRepository roomTypeConfigRepository, 
                                      RoomRepository roomRepository,
                                      TenantProfileRepository tenantProfileRepository,
                                      UserContextService userContextService) {
        this.roomTypeConfigRepository = roomTypeConfigRepository;
        this.roomRepository = roomRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.userContextService = userContextService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("DEBUG: Test endpoint called");
        return ResponseEntity.ok("Room Settings Controller is working!");
    }

    @GetMapping
    public ResponseEntity<List<RoomTypeConfig>> getAllRoomConfigs() {
        System.out.println("DEBUG: Get all room configs called");
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return ResponseEntity.ok(roomTypeConfigRepository.findByHostelAndIsActiveTrue(currentHostel));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createRoomConfig(@Valid @RequestBody RoomTypeConfigRequest request) {
        try {
            System.out.println("DEBUG: Creating room config with data: " + request.getHostelName());
            System.out.println("DEBUG: Room type: " + request.getRoomType());
            System.out.println("DEBUG: Total rooms: " + request.getTotalRooms());
            System.out.println("DEBUG: Rent amount: " + request.getRentAmount());
            System.out.println("DEBUG: Is active: " + request.getIsActive());
            Hostel currentHostel = userContextService.getCurrentUserHostel();
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
            System.out.println("DEBUG: Room config saved successfully with ID: " + config.getId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Room type configuration created successfully");
            response.put("id", config.getId().toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Error creating room config: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create room configuration: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateRoomConfig(@PathVariable("id") Long id, 
                                                               @Valid @RequestBody RoomTypeConfigRequest request) {
        try {
            System.out.println("DEBUG: Updating room config with ID: " + id);
            System.out.println("DEBUG: Request data: " + request.getHostelName() + ", " + request.getRoomType() + ", " + request.getTotalRooms());
            System.out.println("DEBUG: Full request object: " + request.toString());
            
            Optional<RoomTypeConfig> configOpt = roomTypeConfigRepository.findById(id);
            
            if (configOpt.isEmpty()) {
                System.out.println("DEBUG: Room config not found with ID: " + id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room type configuration not found");
                return ResponseEntity.notFound().build();
            }

        RoomTypeConfig config = configOpt.get();
        config.setHostelName(request.getHostelName());
        config.setRoomType(request.getRoomType());
        config.setCapacity(request.getCapacity());
        config.setRentAmount(request.getRentAmount());
        config.setMaintenanceFeeAmount(request.getMaintenanceFeeAmount() != null ? request.getMaintenanceFeeAmount() : 1000.0);
        config.setTotalRooms(request.getTotalRooms());
        config.setAvailableRooms(request.getTotalRooms()); // Update available rooms to match new total
        config.setDescription(request.getDescription());
        config.setAmenities(request.getAmenities());
        config.setIsActive(request.getIsActive());

        roomTypeConfigRepository.save(config);

        // Also update all rooms that were generated from this configuration
        List<Room> roomsToUpdate = roomRepository.findByHostelAndRoomType(config.getHostel(), config.getRoomType());
        for (Room room : roomsToUpdate) {
            room.setRentAmount(config.getRentAmount());
            room.setCapacity(config.getCapacity());
            roomRepository.save(room);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Room type configuration updated successfully");
        return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Error updating room config: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update room configuration: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRoomConfig(@PathVariable("id") Long id) {
        try {
            Optional<RoomTypeConfig> configOpt = roomTypeConfigRepository.findById(id);
            
            if (configOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room type configuration not found");
                return ResponseEntity.notFound().build();
            }

            RoomTypeConfig config = configOpt.get();
            Hostel currentHostel = userContextService.getCurrentUserHostel();
            if (config.getHostel() == null || !config.getHostel().getId().equals(currentHostel.getId())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot delete configuration from another hostel");
                return ResponseEntity.status(403).body(error);
            }
            
            // Find all rooms associated with this config's room type
            List<Room> roomsToDelete = roomRepository.findByHostelAndRoomType(currentHostel, config.getRoomType());

            // Check if any tenants are allocated to these rooms
            List<TenantProfile> allocatedTenants = tenantProfileRepository.findByAllocatedRoomIn(roomsToDelete);
            
            if (!allocatedTenants.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot delete room configuration: " + allocatedTenants.size() + 
                         " tenant(s) are allocated to rooms of this type. Please re-allocate or remove tenants first.");
                return ResponseEntity.badRequest().body(error);
            }

            // Safe to delete rooms since no tenants are allocated
            roomRepository.deleteAll(roomsToDelete);
            
            // Then delete the configuration
            roomTypeConfigRepository.delete(config);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Room type configuration deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Error deleting room config: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete room configuration: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/generate-rooms")
    public ResponseEntity<Map<String, Object>> generateRoomsFromConfig() {
        try {
            Hostel currentHostel = userContextService.getCurrentUserHostel();
            List<RoomTypeConfig> configs = roomTypeConfigRepository.findByHostelAndIsActiveTrue(currentHostel);
            
            System.out.println("DEBUG: Generating rooms from " + configs.size() + " configurations for hostel: " + currentHostel.getName());

            // IMPORTANT:
            // Do NOT delete all rooms here. Once a tenant is allocated, tenant_profiles.allocated_room_id
            // has a foreign-key to rooms.id, so deleteAll() will fail. Instead, we only ADD missing rooms
            // to reach the configured totals, and DELETE only extra rooms that are NOT allocated.
            // This keeps tenant allocations safe while keeping generated counts aligned with configuration.

            int totalRoomsCreated = 0;
            int totalRoomsDeleted = 0;

            // Start numeric room numbering from 101, and keep incrementing until we find an unused number.
            int nextNumber = 101;

            for (RoomTypeConfig config : configs) {
                long existingCountForType = roomRepository.countByHostelAndRoomType(currentHostel, config.getRoomType());
                int desiredCountForType = config.getTotalRooms() != null ? config.getTotalRooms() : 0;

                int roomsToCreate = Math.max(0, desiredCountForType - (int) existingCountForType);
                int roomsToDelete = Math.max(0, (int) existingCountForType - desiredCountForType);

                System.out.println(
                        "DEBUG: Config - Hostel: " + config.getHostelName()
                                + ", Type: " + config.getRoomType()
                                + ", Desired: " + desiredCountForType
                                + ", Existing: " + existingCountForType
                                + ", ToCreate: " + roomsToCreate
                                + ", ToDelete: " + roomsToDelete
                );

                // If config was reduced, delete extra rooms ONLY if they are unallocated.
                // We treat a room as unallocated if currentOccupancy == 0 (and thus no tenant should be referencing it).
                // If not enough unallocated rooms exist, we keep the remaining rooms to protect allocations.
                if (roomsToDelete > 0) {
                    List<Room> roomsOfType = roomRepository.findByHostelAndRoomType(currentHostel, config.getRoomType());
                    for (Room room : roomsOfType) {
                        if (roomsToDelete <= 0) break;

                        Integer occupancy = room.getCurrentOccupancy() != null ? room.getCurrentOccupancy() : 0;
                        if (occupancy == 0) {
                            try {
                                roomRepository.delete(room);
                                totalRoomsDeleted++;
                                roomsToDelete--;
                            } catch (Exception deleteEx) {
                                // If a FK still exists for any reason, skip this room.
                                System.out.println("DEBUG: Skipping delete for room " + room.getId() + " (" + room.getRoomNumber() + "): " + deleteEx.getMessage());
                            }
                        }
                    }

                    if (roomsToDelete > 0) {
                        System.out.println("DEBUG: Could not delete " + roomsToDelete + " rooms of type " + config.getRoomType() + " because they appear allocated.");
                    }
                }

                // Recompute after possible deletions so create count is accurate.
                existingCountForType = roomRepository.countByHostelAndRoomType(currentHostel, config.getRoomType());
                roomsToCreate = Math.max(0, desiredCountForType - (int) existingCountForType);

                for (int i = 0; i < roomsToCreate; i++) {
                    // Find the next unused numeric room number.
                    while (roomRepository.existsByHostelAndRoomNumber(currentHostel, String.valueOf(nextNumber))) {
                        nextNumber++;
                    }

                    String roomNumber = String.valueOf(nextNumber);

                    Room room = Room.builder()
                            .roomNumber(roomNumber)
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

            // Calculate total rooms after generation
            int totalRoomsAfterGeneration = 0;
            for (RoomTypeConfig config : configs) {
                totalRoomsAfterGeneration += roomRepository.countByHostelAndRoomType(currentHostel, config.getRoomType());
            }
            
            System.out.println("DEBUG: Room sync done. Created=" + totalRoomsCreated + ", Deleted=" + totalRoomsDeleted + ", Total=" + totalRoomsAfterGeneration);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rooms generated successfully");
            response.put("totalRoomsGenerated", totalRoomsAfterGeneration);
            response.put("totalRoomsCreated", totalRoomsCreated);
            response.put("totalRoomsDeleted", totalRoomsDeleted);
            response.put("roomTypesConfigured", configs.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Error generating rooms: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to generate rooms: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
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

    private String generateRoomNumber(com.pgms.entity.RoomType roomType, int number, String hostelName) {
        // Generate numeric room numbers starting from 101:
        // 101, 102, 103, ... up to 100 + totalRooms.
        int base = 100;
        return String.valueOf(base + number);
    }
}
