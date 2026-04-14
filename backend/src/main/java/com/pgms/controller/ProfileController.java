package com.pgms.controller;

import com.pgms.dto.ProfileDto;
import com.pgms.entity.TenantProfile;
import com.pgms.entity.Hostel;
import com.pgms.entity.User;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.repository.HostelRepository;
import com.pgms.repository.UserRepository;
import com.pgms.service.UserContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProfileController {

    private final TenantProfileRepository tenantProfileRepository;
    private final HostelRepository hostelRepository;
    private final UserContextService userContextService;
    private final UserRepository userRepository;

    public ProfileController(TenantProfileRepository tenantProfileRepository,
                             HostelRepository hostelRepository,
                             UserContextService userContextService,
                             UserRepository userRepository) {
        this.tenantProfileRepository = tenantProfileRepository;
        this.hostelRepository = hostelRepository;
        this.userContextService = userContextService;
        this.userRepository = userRepository;
    }

    @GetMapping("/user/profile")
    public ResponseEntity<ProfileDto> getCurrentUserProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            ProfileDto profile = ProfileDto.builder()
                    .id(currentUser.getId())
                    .name(currentUser.getName())
                    .email(currentUser.getEmail())
                    .phone(currentUser.getPhone())
                    .role(currentUser.getRole().toString())
                    .build();
            
            // If user is admin/owner, try to get hostel information
            if (currentUser.getRole() == com.pgms.entity.Role.ADMIN || currentUser.getRole() == com.pgms.entity.Role.OWNER) {
                if (currentUser.getHostelId() != null) {
                    Hostel hostel = hostelRepository.findById(currentUser.getHostelId())
                            .orElse(null);
                    if (hostel != null) {
                        profile.setHostelName(hostel.getName());
                        profile.setHostelAddress(hostel.getAddress());
                        profile.setHostelRegistrationDate(hostel.getCreatedAt() != null ? hostel.getCreatedAt().toString() : null);
                    }
                }
            }
            
            // If user is a tenant, try to get additional tenant info
            if (currentUser.getRole() == com.pgms.entity.Role.TENANT) {
                TenantProfile tenant = tenantProfileRepository.findByUserId(currentUser.getId())
                        .orElse(null);
                if (tenant != null) {
                    profile.setPhotoUrl(tenant.getPhotoUrl());
                    profile.setLocation(tenant.getLocation());
                    profile.setAadhaarNumber(tenant.getAadhaarNumber());
                    profile.setAlternatePhone(tenant.getAlternatePhone());
                    profile.setAllocationDate(tenant.getAllocationDate() != null ? tenant.getAllocationDate().toString() : null);
                    
                    // Use tenant phone if available, otherwise fall back to user phone
                    if (tenant.getPhone() != null && !tenant.getPhone().trim().isEmpty()) {
                        profile.setPhone(tenant.getPhone());
                    }
                    
                    // Add room information if allocated
                    if (tenant.getAllocatedRoom() != null) {
                        profile.setRoomNumber(tenant.getAllocatedRoom().getRoomNumber());
                        profile.setRentAmount(tenant.getAllocatedRoom().getRentAmount() != null ? tenant.getAllocatedRoom().getRentAmount().toString() : null);
                    }
                    
                    // Add hostel information
                    if (tenant.getHostel() != null) {
                        profile.setHostelName(tenant.getHostel().getName());
                    }
                }
            }
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.err.println("Error in getCurrentUserProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/profile/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER') or #userId == authentication.principal.id")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long userId) {
        System.out.println("DEBUG: Profile endpoint called for userId: " + userId);
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth != null ? auth.getPrincipal() : null;
        boolean isAdminOrOwner = false;
        if (principal instanceof com.pgms.security.CustomUserDetails cud) {
            isAdminOrOwner = cud.getRole() == com.pgms.entity.Role.ADMIN || cud.getRole() == com.pgms.entity.Role.OWNER;
        }
        TenantProfile tenant;
        if (isAdminOrOwner) {
            com.pgms.entity.Hostel currentHostel = userContextService.getCurrentUserHostel();
            tenant = tenantProfileRepository.findByHostelAndUserId(currentHostel, userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found in your hostel"));
        } else {
            tenant = tenantProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));
        }
        
        String photoUrl = tenant.getPhotoUrl();
        System.out.println("DEBUG: Photo URL from database: " + photoUrl);
        
        ProfileDto profile = ProfileDto.builder()
                .id(tenant.getUser().getId())
                .name(tenant.getUser().getName())
                .email(tenant.getUser().getEmail())
                .phone(tenant.getPhone() != null && !tenant.getPhone().trim().isEmpty() ? tenant.getPhone() : tenant.getUser().getPhone())
                .role(tenant.getUser().getRole().toString())
                .photoUrl(photoUrl)
                .location(tenant.getLocation())
                .aadhaarNumber(tenant.getAadhaarNumber())
                .alternatePhone(tenant.getAlternatePhone())
                .allocationDate(tenant.getAllocationDate() != null ? tenant.getAllocationDate().toString() : null)
                .build();
        
        // Add room information if allocated
        if (tenant.getAllocatedRoom() != null) {
            profile.setRoomNumber(tenant.getAllocatedRoom().getRoomNumber());
            profile.setRentAmount(tenant.getAllocatedRoom().getRentAmount() != null ? tenant.getAllocatedRoom().getRentAmount().toString() : null);
        }
        
        // Add hostel information
        if (tenant.getHostel() != null) {
            profile.setHostelName(tenant.getHostel().getName());
        }
        
        System.out.println("DEBUG: Profile DTO created with photoUrl: " + profile.getPhotoUrl());
        return ResponseEntity.ok(profile);
    }
}
