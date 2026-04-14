package com.pgms.service;

import com.pgms.entity.Hostel;
import com.pgms.entity.User;
import com.pgms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserContextService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    public Hostel getCurrentUserHostel() {
        User currentUser = getCurrentUser();
        // Handle lazy loading by using hostelId to fetch hostel
        if (currentUser.getHostelId() != null) {
            // If hostel object is null due to lazy loading, fetch it manually
            if (currentUser.getHostel() == null) {
                // This shouldn't happen with proper JPA configuration, but let's handle it
                throw new RuntimeException("Hostel not properly loaded for user: " + currentUser.getEmail());
            }
            return currentUser.getHostel();
        }
        throw new RuntimeException("User is not associated with any hostel: " + currentUser.getEmail());
    }

    public Long getCurrentUserHostelId() {
        return getCurrentUserHostel().getId();
    }

    public boolean isCurrentUserAdmin() {
        User currentUser = getCurrentUser();
        return currentUser.getRole() == com.pgms.entity.Role.ADMIN || currentUser.getRole() == com.pgms.entity.Role.OWNER;
    }

    public boolean isCurrentUserTenant() {
        User currentUser = getCurrentUser();
        return currentUser.getRole() == com.pgms.entity.Role.TENANT;
    }
}
