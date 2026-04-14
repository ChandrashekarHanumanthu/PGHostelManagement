package com.pgms.repository;

import com.pgms.entity.Hostel;
import com.pgms.entity.Role;
import com.pgms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    List<User> findByHostel(Hostel hostel);
    
    List<User> findByHostelAndRole(Hostel hostel, Role role);
    
    Optional<User> findByHostelAndEmail(Hostel hostel, String email);
    
    boolean existsByHostelAndEmail(Hostel hostel, String email);
}

