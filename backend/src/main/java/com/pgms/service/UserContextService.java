package com.pgms.service;

import com.pgms.entity.Hostel;
import com.pgms.entity.User;
import com.pgms.exception.ResourceNotFoundException;
import com.pgms.exception.UnauthorizedException;
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
            throw new UnauthorizedException("No authenticated user found");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public Hostel getCurrentUserHostel() {
        User currentUser = getCurrentUser();
        if (currentUser.getHostel() != null) {
            return currentUser.getHostel();
        }
        throw new ResourceNotFoundException("User is not associated with any hostel: " + currentUser.getEmail());
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
