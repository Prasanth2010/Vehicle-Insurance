package com.insurance.backend.controller;

import com.insurance.backend.entity.Claim;
import com.insurance.backend.entity.Policy;
import com.insurance.backend.entity.User;
import com.insurance.backend.repository.ClaimRepository;
import com.insurance.backend.repository.PolicyRepository;
import com.insurance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimRepository claimRepository;

    // Admin login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        User admin = userRepository.findByEmail(email).orElse(null);

        if (admin == null || !admin.getPassword().equals(password) || !"ADMIN".equals(admin.getRole())) {
            response.put("message", "Invalid admin credentials");
            return ResponseEntity.badRequest().body(response);
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", admin.getId());
        userData.put("email", admin.getEmail());
        userData.put("role", admin.getRole());
        userData.put("firstName", admin.getFirstName());

        response.put("message", "Admin login successful");
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    // Get all users grouped by role
    @GetMapping("/users")
    public Map<String, List<User>> getAllUsers() {
        Map<String, List<User>> usersByRole = new HashMap<>();
        List<User> allUsers = userRepository.findAll();
        usersByRole.put("USERS", allUsers.stream().filter(u -> "USER".equals(u.getRole())).toList());
        usersByRole.put("ADMINS", allUsers.stream().filter(u -> "ADMIN".equals(u.getRole())).toList());
        usersByRole.put("SURVEYORS", allUsers.stream().filter(u -> "SURVEYOR".equals(u.getRole())).toList());
        return usersByRole;
    }

    // Update user role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, String>> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        String newRole = request.get("role");

        if (!List.of("USER", "ADMIN", "SURVEYOR").contains(newRole)) {
            response.put("message", "Invalid role");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        user.setRole(newRole);
        userRepository.save(user);

        response.put("message", "Role updated to " + newRole);
        return ResponseEntity.ok(response);
    }

    // Get all claims
    @GetMapping("/claims")
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    // Update claim status
    @PutMapping("/claims/{id}/status")
    public ResponseEntity<Map<String, String>> updateClaimStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        String status = request.get("status");

        if (!List.of("PENDING", "APPROVED", "REJECTED").contains(status)) {
            response.put("message", "Invalid status");
            return ResponseEntity.badRequest().body(response);
        }

        Claim claim = claimRepository.findById(id).orElse(null);
        if (claim == null) {
            response.put("message", "Claim not found");
            return ResponseEntity.badRequest().body(response);
        }

        claim.setStatus(status);
        claimRepository.save(claim);

        response.put("message", "Claim status updated to " + status);
        return ResponseEntity.ok(response);
    }

    // Add policy (admin only)
    @PostMapping("/policies")
    public Policy addPolicy(@RequestBody Policy policy) {
        return policyRepository.save(policy);
    }

    // Add user (admin or surveyor)
    @PostMapping("/add-user")
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }
    // @PostMapping("/add-user")
    // public User addUser(@RequestBody User user) {
    //     // Password is plain text for now (we'll improve later)
    //     return userRepository.save(user);
    // } 
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        if ("ADMIN".equals(user.getRole())) {
            response.put("message", "Cannot delete admin users");
            return ResponseEntity.badRequest().body(response);
        }
        userRepository.delete(user);
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/claims/{id}/assign-surveyor")
public ResponseEntity<Map<String, String>> assignSurveyor(@PathVariable Long id, @RequestBody Map<String, Long> request) {
    Map<String, String> response = new HashMap<>();
    Long surveyorId = request.get("surveyorId");

    Claim claim = claimRepository.findById(id).orElse(null);
    User surveyor = userRepository.findById(surveyorId).orElse(null);

    if (claim == null || surveyor == null || !"SURVEYOR".equals(surveyor.getRole())) {
        response.put("message", "Invalid claim or surveyor");
        return ResponseEntity.badRequest().body(response);
    }

    // Add surveyorId to claim (add field to Claim entity if needed)
    // For now, we'll just update status to "ASSIGNED"
    claim.setStatus("ASSIGNED");
    claimRepository.save(claim);

    response.put("message", "Claim assigned to surveyor");
    return ResponseEntity.ok(response);
}
}