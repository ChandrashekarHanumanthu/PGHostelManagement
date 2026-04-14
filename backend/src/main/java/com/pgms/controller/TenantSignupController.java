package com.pgms.controller;

import com.pgms.entity.Hostel;
import com.pgms.entity.TenantProfile;
import com.pgms.entity.User;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tenant-signup")
@CrossOrigin
public class TenantSignupController {

    private final TenantProfileRepository tenantProfileRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TenantSignupController(TenantProfileRepository tenantProfileRepository,
                              UserRepository userRepository,
                              PasswordEncoder passwordEncoder) {
        this.tenantProfileRepository = tenantProfileRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/verify/{token}")
    public ResponseEntity<Map<String, Object>> verifyToken(@PathVariable String token) {
        try {
            Optional<TenantProfile> tenantOpt = tenantProfileRepository.findBySignupToken(token);
            
            if (tenantOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("message", "Invalid or expired signup link");
                return ResponseEntity.badRequest().body(response);
            }

            TenantProfile tenant = tenantOpt.get();
            
            // CRITICAL: Check token expiry
            if (tenant.getSignupTokenExpiry() != null && 
                tenant.getSignupTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("message", "Signup link has expired");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("message", "Token is valid");
            response.put("tenant", Map.of(
                "name", tenant.getUser().getName(),
                "email", tenant.getUser().getEmail(),
                "phone", tenant.getPhone()
            ));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Error verifying token: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/complete/{token}")
    public ResponseEntity<Map<String, String>> completeSignup(
            @PathVariable String token,
            @RequestBody Map<String, String> request) {
        
        String password = request.get("password");
        
        if (password == null || password.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Password is required");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            Optional<TenantProfile> tenantOpt = tenantProfileRepository.findBySignupToken(token);
            
            if (tenantOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid or expired signup link");
                return ResponseEntity.badRequest().body(error);
            }

            TenantProfile tenant = tenantOpt.get();
            
            // CRITICAL: Check token expiry
            if (tenant.getSignupTokenExpiry() != null && 
                tenant.getSignupTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Signup link has expired");
                return ResponseEntity.badRequest().body(error);
            }
            
            User user = tenant.getUser();
            
            // Update user password
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            
            // Mark signup as completed
            tenant.setSignupCompleted(true);
            tenant.setSignupToken(null); // Clear the token
            // IMPORTANT: Hostel is already set in both User and TenantProfile during registration
            // No need to set it again here
            tenantProfileRepository.save(tenant);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Signup completed successfully! You can now login to your tenant dashboard.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to complete signup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
