package com.pgms.controller;

import com.pgms.dto.TenantDto;
import com.pgms.dto.TenantRegistrationRequest;
import com.pgms.entity.*;
import com.pgms.repository.*;
import com.pgms.service.EmailService;
import com.pgms.service.FileStorageService;
import com.pgms.service.UserContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;
import java.security.SecureRandom;

@RestController
@RequestMapping("/api/admin/tenants")
@PreAuthorize("hasAnyRole('ADMIN','OWNER')")
@CrossOrigin
public class AdminTenantController {

    private final UserRepository userRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final RoomRepository roomRepository;
    private final RoomTypeConfigRepository roomTypeConfigRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final FileStorageService fileStorageService;
    private final PaymentRepository paymentRepository;
    private final ComplaintRepository complaintRepository;
    private final UserContextService userContextService;
    
    private final SecureRandom secureRandom = new SecureRandom();

    public AdminTenantController(UserRepository userRepository,
                                TenantProfileRepository tenantProfileRepository,
                                RoomRepository roomRepository,
                                RoomTypeConfigRepository roomTypeConfigRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService,
                                FileStorageService fileStorageService,
                                PaymentRepository paymentRepository,
                                ComplaintRepository complaintRepository,
                                UserContextService userContextService) {
        this.userRepository = userRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.roomRepository = roomRepository;
        this.roomTypeConfigRepository = roomTypeConfigRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.fileStorageService = fileStorageService;
        this.paymentRepository = paymentRepository;
        this.complaintRepository = complaintRepository;
        this.userContextService = userContextService;
    }
    
    /**
     * Generate a secure random temporary password
     */
    private String generateSecureTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder password = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(secureRandom.nextInt(chars.length())));
        }
        return password.toString();
    }

    @GetMapping
    public ResponseEntity<?> getAllTenants(@RequestParam(value = "includeInactive", required = false, defaultValue = "false") boolean includeInactive) {
        try {
            Hostel currentHostel = userContextService.getCurrentUserHostel();
            List<TenantProfile> tenants = includeInactive
                    ? tenantProfileRepository.findByHostel(currentHostel)
                    : tenantProfileRepository.findByHostelAndActive(currentHostel, true);
            
            // Convert to DTOs to avoid circular references
            List<TenantDto> tenantDtos = tenants.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(tenantDtos);
        } catch (Exception e) {
            System.out.println("Error fetching tenants: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch tenants: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private TenantDto convertToDto(TenantProfile tenant) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        TenantDto.UserDto userDto = TenantDto.UserDto.builder()
                .id(tenant.getUser().getId())
                .name(tenant.getUser().getName())
                .email(tenant.getUser().getEmail())
                .phone(tenant.getUser().getPhone())
                .build();

        TenantDto.RoomDto roomDto = null;
        if (tenant.getAllocatedRoom() != null) {
            roomDto = TenantDto.RoomDto.builder()
                    .id(tenant.getAllocatedRoom().getId())
                    .roomNumber(tenant.getAllocatedRoom().getRoomNumber())
                    .roomType(tenant.getAllocatedRoom().getRoomType().toString())
                    .capacity(tenant.getAllocatedRoom().getCapacity())
                    .currentOccupancy(tenant.getAllocatedRoom().getCurrentOccupancy())
                    .rentAmount(tenant.getAllocatedRoom().getRentAmount())
                    .build();
        }

        return TenantDto.builder()
                .id(tenant.getId())
                .user(userDto)
                .phone(tenant.getPhone())
                .alternatePhone(tenant.getAlternatePhone())
                .location(tenant.getLocation())
                .aadhaarNumber(tenant.getAadhaarNumber())
                .photoUrl(tenant.getPhotoUrl())
                .allocatedRoom(roomDto)
                .allocationDate(tenant.getAllocationDate() != null ? tenant.getAllocationDate().format(formatter) : null)
                .signupCompleted(tenant.isSignupCompleted())
                .active(tenant.isActive())
                .maintenanceFeeAmount(tenant.getMaintenanceFeeAmount())
                .leaveDate(tenant.getLeaveDate() != null ? tenant.getLeaveDate().format(formatter) : null)
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTenant(@PathVariable Long id) {
        try {
            Hostel currentHostel = userContextService.getCurrentUserHostel();
            Optional<TenantProfile> tenantOpt = tenantProfileRepository.findByHostelAndId(currentHostel, id);
            
            if (tenantOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Tenant not found");
                return ResponseEntity.notFound().build();
            }

            TenantProfile tenant = tenantOpt.get();
            Long userId = (tenant.getUser() != null) ? tenant.getUser().getId() : null;
            
            // Update room occupancy if tenant is allocated
            if (tenant.getAllocatedRoom() != null) {
                Room room = tenant.getAllocatedRoom();
                room.setCurrentOccupancy(Math.max(0, room.getCurrentOccupancy() - 1));
                
                // Update room availability status
                if (room.getCurrentOccupancy() == 0) {
                    room.setAvailabilityStatus(com.pgms.entity.RoomAvailabilityStatus.AVAILABLE);
                } else if (room.getCurrentOccupancy() < room.getCapacity()) {
                    room.setAvailabilityStatus(com.pgms.entity.RoomAvailabilityStatus.AVAILABLE);
                }
                
                roomRepository.save(room);
            }

            // Delete all payments associated with this tenant scoped to hostel
            List<Payment> payments = paymentRepository.findByHostelAndTenant(currentHostel, tenant);
            if (!payments.isEmpty()) {
                System.out.println("DEBUG: Deleting " + payments.size() + " payment(s) for tenant ID: " + id);
                paymentRepository.deleteAll(payments);
            }

            // Delete all complaints associated with this tenant scoped to hostel
            List<Complaint> complaints = complaintRepository.findByHostelAndTenant(currentHostel, tenant);
            if (!complaints.isEmpty()) {
                System.out.println("DEBUG: Deleting " + complaints.size() + " complaint(s) for tenant ID: " + id);
                complaintRepository.deleteAll(complaints);
            }

            // 3. Now delete the tenant profile (no foreign key constraints should remain)
            tenantProfileRepository.delete(tenant);

            // 4. Delete the associated user account
            // IMPORTANT: There is NO cascade configured from TenantProfile -> User.
            // Without deleting the associated User, the email remains reserved and re-registration fails.
            if (userId != null) {
                userRepository.deleteById(userId);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Tenant deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error deleting tenant: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete tenant: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Vacate a tenant (recommended instead of hard delete).
     * - frees the room occupancy
     * - marks tenant inactive (keeps payment history)
     * - optionally records a maintenance/deposit refund entry
     */
    @PostMapping("/{id}/vacate")
    public ResponseEntity<Map<String, String>> vacateTenant(
            @PathVariable Long id,
            @RequestParam(value = "refundAmount", required = false, defaultValue = "0") Double refundAmount,
            @RequestParam(value = "refundPaidNow", required = false, defaultValue = "true") Boolean refundPaidNow
    ) {
        try {
            Hostel currentHostel = userContextService.getCurrentUserHostel();
            TenantProfile tenant = tenantProfileRepository.findByHostelAndId(currentHostel, id)
                    .orElseThrow(() -> new RuntimeException("Tenant not found in your hostel"));

            if (!tenant.isActive()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Tenant is already vacated");
                return ResponseEntity.ok(response);
            }

            // Update room occupancy if allocated
            if (tenant.getAllocatedRoom() != null) {
                Room room = tenant.getAllocatedRoom();
                room.setCurrentOccupancy(Math.max(0, room.getCurrentOccupancy() - 1));
                if (room.getCurrentOccupancy() < room.getCapacity()) {
                    room.setAvailabilityStatus(com.pgms.entity.RoomAvailabilityStatus.AVAILABLE);
                }
                roomRepository.save(room);
            }

            // Mark inactive + leave date + clear room assignment
            tenant.setActive(false);
            tenant.setLeaveDate(java.time.LocalDateTime.now());
            tenant.setAllocatedRoom(null);
            tenantProfileRepository.save(tenant);

            // Record refund entry (optional)
            double effectiveRefund = refundAmount != null ? refundAmount : 0.0;
            if (effectiveRefund > 0) {
                tenant.setMaintenanceFeeRefundedAmount(
                        (tenant.getMaintenanceFeeRefundedAmount() != null ? tenant.getMaintenanceFeeRefundedAmount() : 0.0)
                                + effectiveRefund
                );
                tenantProfileRepository.save(tenant);

                Payment refundPayment = Payment.builder()
                        .tenant(tenant)
                        .hostel(currentHostel) // CRITICAL: Fix schema violation - hostel is required
                        .month(java.time.YearMonth.now().toString())
                        .amount(effectiveRefund)
                        .type(PaymentType.REFUND)
                        .dueDate(java.time.LocalDate.now())
                        .status(Boolean.TRUE.equals(refundPaidNow) ? PaymentStatus.PAID : PaymentStatus.PENDING)
                        .paymentDate(Boolean.TRUE.equals(refundPaidNow) ? java.time.LocalDate.now() : null)
                        .build();
                paymentRepository.save(refundPayment);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Tenant vacated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error vacating tenant: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to vacate tenant: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<Map<String, String>> registerTenant(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("alternatePhone") String alternatePhone,
            @RequestParam("location") String location,
            @RequestParam("aadhaarNumber") String aadhaarNumber,
            @RequestParam("allottedRoomNumber") String allottedRoomNumber,
            @RequestParam(value = "rentAmount", required = false) Double rentAmount,
            @RequestParam(value = "rentCollected", required = false, defaultValue = "true") Boolean rentCollected,
            @RequestParam(value = "paymentMethod", required = false) String paymentMethod,
            @RequestParam(value = "razorpayOrderId", required = false) String razorpayOrderId,
            @RequestParam(value = "razorpayPaymentId", required = false) String razorpayPaymentId,
            @RequestParam(value = "razorpaySignature", required = false) String razorpaySignature,
            @RequestParam(value = "joinDate", required = false) String joinDateStr,
            @RequestParam(value = "photo", required = false) MultipartFile photoFile
    ) {
        try {
            System.out.println("DEBUG: Registering tenant with room number: " + allottedRoomNumber);
            
            // Get current hostel first - needed for multiple operations
            Hostel currentHostel = userContextService.getCurrentUserHostel();

            // Input validation
            if (name == null || name.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (email == null || email.trim().isEmpty() || !email.contains("@")) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Valid email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (phone == null || phone.trim().isEmpty() || !phone.matches("[6-9][0-9]{9}")) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Valid 10-digit phone number is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (aadhaarNumber == null || aadhaarNumber.trim().isEmpty() || !aadhaarNumber.matches("[0-9]{12}")) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Valid 12-digit Aadhaar number is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (allottedRoomNumber == null || allottedRoomNumber.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Room number is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if user already exists - CRITICAL VALIDATION
            if (userRepository.existsByEmail(email)) {
                System.out.println("DEBUG: Email already exists: " + email);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email already registered");
                return ResponseEntity.badRequest().body(response);
            }

            // Create user account
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(generateSecureTemporaryPassword())) // Secure random password
                    .role(com.pgms.entity.Role.TENANT)
                    // IMPORTANT: link tenant user to the current hostel via relation
                    .hostel(currentHostel)
                    .build();
            User savedUser = userRepository.save(user);

            // Check if tenant profile already exists for this user
            if (tenantProfileRepository.existsByUserId(savedUser.getId())) {
                System.out.println("DEBUG: Tenant profile already exists for user: " + savedUser.getId());
                // Clean up created user since tenant profile already exists
                userRepository.delete(savedUser);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Tenant profile already exists for this user");
                return ResponseEntity.badRequest().body(response);
            }

            // Find room by exact number (whatever owner has set in Rooms page)
            System.out.println("DEBUG: Looking for room with number: " + allottedRoomNumber);
            Room room = roomRepository.findByHostelAndRoomNumber(currentHostel, allottedRoomNumber)
                    .orElseThrow(() -> {
                        System.out.println("DEBUG: Room not found: " + allottedRoomNumber);
                        // Clean up the user that was already created
                        userRepository.delete(savedUser);
                        throw new RuntimeException("Room not found with number: " + allottedRoomNumber);
                    });

            // Get maintenance fee from room type configuration
            RoomTypeConfig roomConfig = roomTypeConfigRepository
                    .findByHostelAndRoomTypeAndIsActiveTrue(currentHostel, room.getRoomType())
                    .orElseThrow(() -> {
                        System.out.println("DEBUG: Room config not found for type: " + room.getRoomType());
                        // Clean up user if room config not found
                        userRepository.delete(savedUser);
                        throw new RuntimeException("Room configuration not found for room type: " + room.getRoomType());
                    });
            
            double effectiveMaintenanceFee = roomConfig.getMaintenanceFeeAmount() != null ? roomConfig.getMaintenanceFeeAmount() : 1000.0;
            System.out.println("DEBUG: Using maintenance fee from config: " + effectiveMaintenanceFee + " for room type: " + room.getRoomType());

            // Handle photo upload
            String photoUrl = "";
            if (photoFile != null && !photoFile.isEmpty()) {
                photoUrl = fileStorageService.storeFile(photoFile, "tenants");
                System.out.println("DEBUG: Photo saved to: " + photoUrl);
            }

            // Generate signup token
            String signupToken = java.util.UUID.randomUUID().toString();
            java.time.LocalDateTime tokenExpiry = java.time.LocalDateTime.now().plusDays(7);

            // Parse join date or use current date/time
            java.time.LocalDateTime joinDate;
            if (joinDateStr != null && !joinDateStr.isEmpty()) {
                try {
                    // Parse date string (format: yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss)
                    java.time.LocalDate date = java.time.LocalDate.parse(joinDateStr);
                    joinDate = date.atStartOfDay();
                } catch (Exception e) {
                    System.out.println("DEBUG: Invalid join date format, using current date: " + joinDateStr);
                    joinDate = java.time.LocalDateTime.now();
                }
            } else {
                // Default to current date/time if not provided
                joinDate = java.time.LocalDateTime.now();
            }

            // Create tenant profile with mandatory join date
            TenantProfile tenantProfile = TenantProfile.builder()
                    .user(savedUser)
                    .phone(phone)
                    .alternatePhone(alternatePhone)
                    .location(location)
                    .aadhaarNumber(aadhaarNumber)
                    .photoUrl(photoUrl)
                    .signupToken(signupToken)
                    .signupTokenExpiry(tokenExpiry) // CRITICAL: Set token expiry (7 days)
                    .signupSent(true)
                    .signupCompleted(false)
                    .allocatedRoom(room)
                    .allocationDate(joinDate) // MANDATORY: Join date - used for payment due date calculation
                    .maintenanceFeeAmount(effectiveMaintenanceFee)
                    .hostel(currentHostel) // CRITICAL: Set hostel to prevent NULL constraint violation
                    .build();
            TenantProfile savedTenantProfile = tenantProfileRepository.save(tenantProfile);

            // Update room occupancy
            room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);
            if (room.getCurrentOccupancy() >= room.getCapacity()) {
                room.setAvailabilityStatus(com.pgms.entity.RoomAvailabilityStatus.OCCUPIED);
            }
            roomRepository.save(room);

            // Create first-month payment: rent + maintenance (one combined payment)
            double firstMonthRent = rentAmount != null && rentAmount > 0 ? rentAmount : room.getRentAmount();
            double firstMonthTotal = firstMonthRent + effectiveMaintenanceFee;
            if (firstMonthTotal > 0) {
                // Payment should be PENDING by default - tenant needs to pay after login
                Payment firstMonthPayment = Payment.builder()
                        .tenant(savedTenantProfile)
                        .month(java.time.YearMonth.now().toString())
                        .amount(firstMonthTotal)
                        .type(PaymentType.RENT)
                        .dueDate(java.time.LocalDate.now())
                        .status(PaymentStatus.PENDING)
                        .paymentDate(null)
                        .hostel(currentHostel) // CRITICAL: Set hostel to prevent NULL constraint violation
                        .build();
                paymentRepository.save(firstMonthPayment);
            }

            // Send password setup email and report real status back to client
            boolean emailSent = emailService.sendPasswordSetupEmail(email, signupToken, name);

            Map<String, String> response = new HashMap<>();
            if (emailSent) {
                response.put("message", "Tenant registered successfully. Password setup email sent.");
            } else {
                response.put("message", "Tenant registered successfully, but failed to send password setup email. Please verify email settings.");
            }
            response.put("tenantId", savedTenantProfile.getId().toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error registering tenant: " + e.getMessage());
            e.printStackTrace();
            
            // Clean up created user if tenant profile creation failed
            // This prevents orphaned users that would block future registrations
            try {
                if (e.getMessage() != null && e.getMessage().contains("tenant_profiles")) {
                    // If the error is related to tenant profile creation, try to find and delete the user
                    User createdUser = userRepository.findByEmail(email).orElse(null);
                    if (createdUser != null) {
                        userRepository.delete(createdUser);
                        System.out.println("DEBUG: Cleaned up orphaned user: " + email);
                    }
                }
            } catch (Exception cleanupError) {
                System.out.println("DEBUG: Failed to cleanup user: " + cleanupError.getMessage());
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to register tenant: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/available-rooms")
    public ResponseEntity<?> getAvailableRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        var availableRooms = roomRepository.findByHostelAndAvailabilityStatus(
                currentHostel, com.pgms.entity.RoomAvailabilityStatus.AVAILABLE);
        System.out.println("DEBUG: Available rooms count: " + availableRooms.size());
        availableRooms.forEach(room -> {
            System.out.println("DEBUG: Available room - " + room.getRoomNumber() + 
                             " (ID: " + room.getId() + 
                             ", Type: " + room.getRoomType() + 
                             ", Occupancy: " + room.getCurrentOccupancy() + "/" + room.getCapacity() + ")");
        });
        return ResponseEntity.ok(availableRooms);
    }

    @GetMapping("/all-rooms")
    public ResponseEntity<?> getAllRooms() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        var allRooms = roomRepository.findByHostel(currentHostel);
        System.out.println("DEBUG: All rooms count: " + allRooms.size());
        allRooms.forEach(room -> {
            System.out.println("DEBUG: Room - " + room.getRoomNumber() + 
                             " (ID: " + room.getId() + 
                             ", Type: " + room.getRoomType() + 
                             ", Status: " + room.getAvailabilityStatus() +
                             ", Occupancy: " + room.getCurrentOccupancy() + "/" + room.getCapacity() + ")");
        });
        return ResponseEntity.ok(allRooms);
    }

    @GetMapping("/pending-registrations")
    public ResponseEntity<?> getPendingRegistrations() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return ResponseEntity.ok(
                tenantProfileRepository.findByHostelAndSignupCompletedFalse(currentHostel)
        );
    }
}
