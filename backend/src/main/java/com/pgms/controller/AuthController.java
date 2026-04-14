package com.pgms.controller;

import com.pgms.dto.AuthResponse;
import com.pgms.dto.LoginRequest;
import com.pgms.dto.SignupRequest;
import com.pgms.entity.Role;
import com.pgms.entity.TenantProfile;
import com.pgms.entity.User;
import com.pgms.repository.TenantProfileRepository;
import com.pgms.repository.UserRepository;
import com.pgms.security.CustomUserDetails;
import com.pgms.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final TenantProfileRepository tenantProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          UserRepository userRepository,
                          TenantProfileRepository tenantProfileRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.tenantProfileRepository = tenantProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            String token = jwtTokenProvider.generateToken(user);

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .role(user.getRole().name())
                    .userId(user.getId())
                    .name(user.getName())
                    .hostelId(user.getHostel() != null ? user.getHostel().getId() : null)
                    .hostelName(user.getHostel() != null ? user.getHostel().getName() : null)
                    .isSetupComplete(user.getHostel() != null ? user.getHostel().getIsSetupComplete() : null)
                    .build();

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException ex) {
            throw ex;
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request, 
                                                      @RequestParam String token) {
        // Only handle token-based signup (tenant password setup)
        // Direct tenant signup is not allowed - violates golden rule
        return handleTokenSignup(request, token);
    }

    private ResponseEntity<Map<String, String>> handleTokenSignup(SignupRequest request, String token) {
        TenantProfile tenantProfile = tenantProfileRepository.findBySignupToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid signup token"));

        if (tenantProfile.isSignupCompleted()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Signup already completed");
            return ResponseEntity.badRequest().body(response);
        }

        User user = tenantProfile.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        tenantProfile.setSignupCompleted(true);
        tenantProfileRepository.save(tenantProfile);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration completed successfully");
        return ResponseEntity.ok(response);
    }
}

