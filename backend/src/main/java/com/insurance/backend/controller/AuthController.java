package com.insurance.backend.controller;

import com.insurance.backend.entity.User;
import com.insurance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        // Basic validation
        if (user.getEmail() == null || user.getPassword() == null || user.getFirstName() == null) {
            response.put("message", "Required fields missing");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("message", "Email already registered");
            return ResponseEntity.badRequest().body(response);
        }

        // Set role to USER
        user.setRole("USER");

        // Save (password plain for now - we'll hash later with security)
        userRepository.save(user);

        response.put("message", "Registration successful! Please login.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
    String email = credentials.get("email");
    String password = credentials.get("password");

    Map<String, Object> response = new HashMap<>();

    User user = userRepository.findByEmail(email).orElse(null);

    if (user == null || !user.getPassword().equals(password)) {
        response.put("message", "Invalid email or password");
        return ResponseEntity.badRequest().body(response);
    }

    // Return user data (no JWT yet - simple session via localStorage)
    Map<String, Object> userData = new HashMap<>();
    userData.put("id", user.getId());
    userData.put("email", user.getEmail());
    userData.put("role", user.getRole());
    userData.put("firstName", user.getFirstName());

    response.put("message", "Login successful");
    response.put("user", userData);

    return ResponseEntity.ok(response);
}
}