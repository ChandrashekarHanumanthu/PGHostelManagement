package com.pgms.controller;

import com.pgms.dto.AuthResponse;
import com.pgms.dto.HostelOwnerSignupRequest;
import com.pgms.entity.Hostel;
import com.pgms.entity.Role;
import com.pgms.entity.User;
import com.pgms.repository.HostelRepository;
import com.pgms.repository.UserRepository;
import com.pgms.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hostel-signup")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HostelSignupController {

    private final HostelRepository hostelRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping
    @Transactional
    public ResponseEntity<AuthResponse> signupHostelOwner(@Valid @RequestBody HostelOwnerSignupRequest request) {
        // Check if hostel email already exists
        if (hostelRepository.existsByEmail(request.getHostelEmail())) {
            throw new RuntimeException("Hostel with this email already exists");
        }

        // Check if user email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create Hostel
        Hostel hostel = Hostel.builder()
                .name(request.getHostelName())
                .address(request.getHostelAddress())
                .phone(request.getHostelPhone())
                .email(request.getHostelEmail())
                .ownerName(request.getOwnerName())
                .isSetupComplete(false)
                .build();

        hostel = hostelRepository.save(hostel);

        // Create Owner User
        User owner = User.builder()
                .name(request.getOwnerName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getHostelPhone())
                .role(Role.OWNER)
                .hostelId(hostel.getId())
                .hostel(hostel)
                .isActive(true)
                .build();

        owner = userRepository.save(owner);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(owner);

        // Prepare response
        AuthResponse response = AuthResponse.builder()
                .token(token)
                .role("OWNER")
                .userId(owner.getId())
                .name(owner.getName())
                .hostelId(hostel.getId())
                .hostelName(hostel.getName())
                .isSetupComplete(hostel.getIsSetupComplete())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailAvailability(@PathVariable String email) {
        boolean exists = userRepository.existsByEmail(email) || hostelRepository.existsByEmail(email);
        return ResponseEntity.ok(!exists);
    }
}
