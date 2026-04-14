

package com.pgms.controller;

import com.pgms.entity.Room;
import com.pgms.entity.RoomAvailabilityStatus;
import com.pgms.entity.RoomType;
import com.pgms.entity.RoomTypeConfig;
import com.pgms.entity.Hostel;
import com.pgms.repository.RoomRepository;
import com.pgms.repository.RoomTypeConfigRepository;
import com.pgms.service.UserContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/rooms")
@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
@CrossOrigin
public class AdminRoomController {

    private final RoomRepository roomRepository;
    private final RoomTypeConfigRepository roomTypeConfigRepository;
    private final UserContextService userContextService;

    public AdminRoomController(RoomRepository roomRepository, RoomTypeConfigRepository roomTypeConfigRepository, UserContextService userContextService) {
        this.roomRepository = roomRepository;
        this.roomTypeConfigRepository = roomTypeConfigRepository;
        this.userContextService = userContextService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createRoom(@Valid @RequestBody Room room) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        room.setCurrentOccupancy(0);
        room.setAvailabilityStatus(RoomAvailabilityStatus.AVAILABLE);
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
    public ResponseEntity<Map<String, String>> updateRoom(@PathVariable("id") Long id, @RequestBody Map<String, String> request) {
        try {
            System.out.println("DEBUG: Updating room with ID: " + id);
            System.out.println("DEBUG: Request body: " + request);
            
            Optional<Room> roomOpt = roomRepository.findById(id);
            
            if (roomOpt.isEmpty()) {
                System.out.println("DEBUG: Room not found with ID: " + id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }

            Room room = roomOpt.get();
            String newRoomNumber = request.get("roomNumber");
            
            System.out.println("DEBUG: Current room number: " + room.getRoomNumber());
            System.out.println("DEBUG: New room number: " + newRoomNumber);
            
            if (newRoomNumber == null || newRoomNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room number cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }
            
            newRoomNumber = newRoomNumber.trim();
            
            // Check if room number already exists (but exclude the current room)
            Hostel currentHostel = userContextService.getCurrentUserHostel();
            Optional<Room> existingRoomOpt = roomRepository.findByHostelAndRoomNumber(currentHostel, newRoomNumber);
            if (existingRoomOpt.isPresent() && !existingRoomOpt.get().getId().equals(room.getId())) {
                System.out.println("DEBUG: Room number already exists: " + newRoomNumber);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room number already exists");
                return ResponseEntity.badRequest().body(error);
            }
            
            room.setRoomNumber(newRoomNumber);
            roomRepository.save(room);
            
            System.out.println("DEBUG: Room number updated successfully to: " + newRoomNumber);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Room number updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception updating room: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update room: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Alternative endpoint: Update room by room number (useful if ID lookup fails)
    @PutMapping("/by-number/{oldRoomNumber}")
    public ResponseEntity<Map<String, String>> updateRoomByNumber(
            @PathVariable("oldRoomNumber") String oldRoomNumber,
            @RequestBody Map<String, String> request) {
        try {
            Hostel currentHostel = userContextService.getCurrentUserHostel();
            Optional<Room> roomOpt = roomRepository.findByHostelAndRoomNumber(currentHostel, oldRoomNumber);
            
            if (roomOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room not found with number: " + oldRoomNumber);
                return ResponseEntity.notFound().build();
            }
            
            Room room = roomOpt.get();
            String newRoomNumber = request.get("roomNumber");
            
            if (newRoomNumber == null || newRoomNumber.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room number cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }
            
            newRoomNumber = newRoomNumber.trim();
            
            // Check if new number already exists (but exclude current room)
            Optional<Room> existingRoomOpt = roomRepository.findByHostelAndRoomNumber(currentHostel, newRoomNumber);
            if (existingRoomOpt.isPresent() && !existingRoomOpt.get().getId().equals(room.getId())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Room number already exists");
                return ResponseEntity.badRequest().body(error);
            }
            
            room.setRoomNumber(newRoomNumber);
            roomRepository.save(room);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Room number updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update room: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}/tenants")
    public ResponseEntity<List<Map<String, Object>>> getRoomTenants(@PathVariable Long id) {
        try {
            Optional<Room> roomOpt = roomRepository.findById(id);
            
            if (roomOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Room room = roomOpt.get();
            
            // TODO: Implement tenant fetching logic when tenant profiles are linked to rooms
            List<Map<String, Object>> tenants = new ArrayList<>();
            
            return ResponseEntity.ok(tenants);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/from-configs")
    public ResponseEntity<List<Map<String, Object>>> getRoomsFromConfigs() {
        try {
            // Get all room configurations
            List<RoomTypeConfig> configs = roomTypeConfigRepository.findAll();
            System.out.println("DEBUG: Found " + configs.size() + " room configurations");
            
            List<Map<String, Object>> rooms = new ArrayList<>();
            
            for (RoomTypeConfig config : configs) {
                System.out.println("DEBUG: Processing config - Hostel: " + config.getHostelName() + 
                    ", Type: " + config.getRoomType() + ", Total Rooms: " + config.getTotalRooms());
                
                // Generate individual rooms from each configuration
                for (int i = 1; i <= config.getTotalRooms(); i++) {
                    Map<String, Object> room = new HashMap<>();
                    
                    // Generate room number
                    String roomNumber = generateRoomNumberFromConfig(config.getRoomType(), i, config.getHostelName());
                    
                    room.put("id", rooms.size() + 1);
                    room.put("roomNumber", roomNumber);
                    room.put("roomType", config.getRoomType());
                    room.put("capacity", config.getCapacity());
                    room.put("rentAmount", config.getRentAmount());
                    room.put("availabilityStatus", "AVAILABLE"); // Default to available
                    room.put("currentOccupancy", 0);
                    room.put("hostelName", config.getHostelName());
                    room.put("description", config.getDescription());
                    room.put("amenities", config.getAmenities());
                    
                    rooms.add(room);
                }
            }
            
            System.out.println("DEBUG: Generated " + rooms.size() + " individual rooms");
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            System.out.println("Error generating rooms from configs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    private String generateRoomNumberFromConfig(RoomType roomType, int number, String hostelName) {
        // Keep room numbers purely numeric and consistent with the actual
        // generated rooms used in the database (101, 102, 103, ...).
        int base = 100;
        return String.valueOf(base + number);
    }

    @GetMapping("/new-rooms")
    public ResponseEntity<List<Room>> getNewRooms() {
        try {
            // Get only rooms with new enum values
            List<Room> allRooms = roomRepository.findAll();
            List<Room> newRooms = allRooms.stream()
                .filter(room -> room.getRoomType() != null && 
                    (room.getRoomType().equals(RoomType.SINGLE) || 
                     room.getRoomType().equals(RoomType.DOUBLE) ||
                     room.getRoomType().equals(RoomType.THREE) ||
                     room.getRoomType().equals(RoomType.FOUR)))
                .toList();
            return ResponseEntity.ok(newRooms);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return ResponseEntity.ok(roomRepository.findByHostelAndAvailabilityStatus(currentHostel, RoomAvailabilityStatus.AVAILABLE));
    }

    @PostMapping("/add-sample")
    public ResponseEntity<Map<String, String>> addSampleRooms() {
        try {
            // Add some sample rooms with new enum values
            Room[] sampleRooms = {
                Room.builder()
                    .roomNumber("PGM-S101")
                    .roomType(RoomType.SINGLE)
                    .capacity(1)
                    .rentAmount(5000.0)
                    .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                    .currentOccupancy(0)
                    .build(),
                Room.builder()
                    .roomNumber("PGM-D101")
                    .roomType(RoomType.DOUBLE)
                    .capacity(2)
                    .rentAmount(3500.0)
                    .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                    .currentOccupancy(0)
                    .build(),
                Room.builder()
                    .roomNumber("PGM-T101")
                    .roomType(RoomType.THREE)
                    .capacity(3)
                    .rentAmount(3000.0)
                    .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                    .currentOccupancy(0)
                    .build(),
                Room.builder()
                    .roomNumber("PGM-F101")
                    .roomType(RoomType.FOUR)
                    .capacity(4)
                    .rentAmount(2500.0)
                    .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                    .currentOccupancy(0)
                    .build(),
                Room.builder()
                    .roomNumber("PGM-S102")
                    .roomType(RoomType.SINGLE)
                    .capacity(1)
                    .rentAmount(5000.0)
                    .availabilityStatus(RoomAvailabilityStatus.OCCUPIED)
                    .currentOccupancy(1)
                    .build()
            };

            for (Room room : sampleRooms) {
                roomRepository.save(room);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Sample rooms added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add sample rooms: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/init-rooms")
    public ResponseEntity<Map<String, String>> initializeRooms() {
        // Create some sample rooms for testing
        Room[] rooms = {
            Room.builder()
                .roomNumber("A101")
                .roomType(RoomType.SINGLE)
                .capacity(1)
                .rentAmount(5000.0)
                .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                .build(),
            Room.builder()
                .roomNumber("A102")
                .roomType(RoomType.DOUBLE)
                .capacity(2)
                .rentAmount(3500.0)
                .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                .build(),
            Room.builder()
                .roomNumber("B101")
                .roomType(RoomType.FOUR)
                .capacity(4)
                .rentAmount(2500.0)
                .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                .build(),
            Room.builder()
                .roomNumber("B102")
                .roomType(RoomType.THREE)
                .capacity(3)
                .rentAmount(3000.0)
                .availabilityStatus(RoomAvailabilityStatus.AVAILABLE)
                .build()
        };

        for (Room room : rooms) {
            room.setCurrentOccupancy(0);
            roomRepository.save(room);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Sample rooms created successfully");
        return ResponseEntity.ok(response);
    }
}
