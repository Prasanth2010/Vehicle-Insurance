// Create new file: src/main/java/com/insurance/backend/controller/ProfileController.java

package com.insurance.backend.controller;

import com.insurance.backend.entity.User;
import com.insurance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<String> updateMyProfile(Authentication authentication, @RequestBody User updatedData) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Update allowed fields
        if (updatedData.getFirstName() != null) user.setFirstName(updatedData.getFirstName());
        if (updatedData.getLastName() != null) user.setLastName(updatedData.getLastName());
        if (updatedData.getContactNo() != null) user.setContactNo(updatedData.getContactNo());
        if (updatedData.getStreet() != null) user.setStreet(updatedData.getStreet());
        if (updatedData.getCity() != null) user.setCity(updatedData.getCity());
        if (updatedData.getPincode() != null) user.setPincode(updatedData.getPincode());

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }
}