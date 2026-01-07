// src/main/java/com/insurance/backend/controller/AuthController.java

package com.insurance.backend.controller;

import com.insurance.backend.entity.User;
import com.insurance.backend.repository.UserRepository;
import com.insurance.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;  // ← Inject JWT utility

    // User Registration (only for customers)
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if (user.getEmail() == null || user.getPassword() == null || user.getFirstName() == null) {
            response.put("message", "Required fields missing");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("message", "Email already registered");
            return ResponseEntity.badRequest().body(response);
        }

        user.setRole("USER");
        user.setStatus("active");  
        userRepository.save(user);

        response.put("message", "Registration successful! Please login.");
        return ResponseEntity.ok(response);
    }

    // Unified Login for User, Surveyor, and Admin
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        if (email == null || password == null) {
            response.put("message", "Email and password required");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(401).body(response);
        }

        User user = userOpt.get();

        // Generate JWT Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());

        // Prepare safe user data (no password)
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("firstName", user.getFirstName());
        userData.put("lastName", user.getLastName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }
}