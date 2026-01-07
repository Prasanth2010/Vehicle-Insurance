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
import org.springframework.security.core.Authentication;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
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

        Optional<User> adminOpt = userRepository.findByEmail(email);
        if (adminOpt.isEmpty() || !adminOpt.get().getPassword().equals(password) || !"ADMIN".equals(adminOpt.get().getRole())) {
            response.put("message", "Invalid admin credentials");
            return ResponseEntity.badRequest().body(response);
        }

        User admin = adminOpt.get();
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
    public ResponseEntity<Map<String, List<User>>> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        Map<String, List<User>> usersByRole = new HashMap<>();
        usersByRole.put("USERS", allUsers.stream().filter(u -> "USER".equals(u.getRole())).toList());
        usersByRole.put("ADMINS", allUsers.stream().filter(u -> "ADMIN".equals(u.getRole())).toList());
        usersByRole.put("SURVEYORS", allUsers.stream().filter(u -> "SURVEYOR".equals(u.getRole())).toList());

        return ResponseEntity.ok(usersByRole);
    }

    // Update user details (used for editing surveyor info)
    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Map<String, String> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOpt.get();
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setContactNo(updatedUser.getContactNo());
        user.setAge(updatedUser.getAge());
        user.setGender(updatedUser.getGender());
        user.setStreet(updatedUser.getStreet());
        user.setCity(updatedUser.getCity());
        user.setPincode(updatedUser.getPincode());

        userRepository.save(user);

        response.put("message", "User updated successfully");
        return ResponseEntity.ok(response);
    }

    // Update user status (active/inactive)
    @PutMapping("/users/{id}/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        String status = body.get("status");

        if (!"active".equals(status) && !"inactive".equals(status)) {
            response.put("message", "Status must be 'active' or 'inactive'");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOpt.get();
        user.setStatus(status);
        userRepository.save(user);

        response.put("message", "Status updated to " + status);
        return ResponseEntity.ok(response);
    }

    // Delete user (cannot delete ADMIN)
    @DeleteMapping("/users/{id}")
public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
    Map<String, String> response = new HashMap<>();

    Optional<User> userOpt = userRepository.findById(id);
    if (userOpt.isEmpty()) {
        response.put("message", "User not found");
        return ResponseEntity.notFound().build();
    }

    User user = userOpt.get();

    // Prevent deleting ADMIN
    if ("ADMIN".equals(user.getRole())) {
        response.put("message", "Cannot delete admin accounts");
        return ResponseEntity.badRequest().body(response);
    }

    // Check if user has any claims
    List<Claim> userClaims = claimRepository.findByUserId(id);
    if (!userClaims.isEmpty()) {
        response.put("message", "Cannot delete customer with active claims. Please resolve or delete claims first.");
        return ResponseEntity.badRequest().body(response);
    }

    try {
        userRepository.delete(user);
        response.put("message", "Customer deleted successfully");
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
        response.put("message", "Failed to delete customer due to database constraint");
        return ResponseEntity.status(500).body(response);
    }
}

@DeleteMapping("/claims/{claimId}")
public ResponseEntity<Map<String, String>> deleteClaim(@PathVariable Long claimId) {
    Map<String, String> response = new HashMap<>();

    Optional<Claim> claimOpt = claimRepository.findById(claimId);
    if (claimOpt.isEmpty()) {
        response.put("message", "Claim not found");
        return ResponseEntity.notFound().build();
    }

    Claim claim = claimOpt.get();

    try {
        // Optional: Delete associated files
        if (claim.getDamagePhotoPath() != null && !claim.getDamagePhotoPath().isEmpty()) {
            String fileName = claim.getDamagePhotoPath().substring(claim.getDamagePhotoPath().lastIndexOf("/") + 1);
            Path path = Paths.get("uploads/claims/" + fileName);
            Files.deleteIfExists(path);
        }

        if (claim.getSurveyPhotoPaths() != null && !claim.getSurveyPhotoPaths().isEmpty()) {
            String[] paths = claim.getSurveyPhotoPaths().split(";");
            for (String p : paths) {
                if (!p.trim().isEmpty()) {
                    String fileName = p.substring(p.lastIndexOf("/") + 1);
                    Path path = Paths.get("uploads/survey-photos/" + fileName);
                    Files.deleteIfExists(path);
                }
            }
        }

        claimRepository.delete(claim);
        response.put("message", "Claim deleted successfully");
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        e.printStackTrace();
        response.put("message", "Failed to delete claim: " + e.getMessage());
        return ResponseEntity.internalServerError().body(response);
    }
}
    // Get all claims
    @GetMapping("/claims")
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimRepository.findAll());
    }

    // Assign surveyor to claim
    @PostMapping("/claims/{claimId}/assign")
    public ResponseEntity<Map<String, Object>> assignSurveyor(@PathVariable Long claimId, @RequestBody Map<String, Long> request) {
        Map<String, Object> response = new HashMap<>();
        Long surveyorId = request.get("surveyorId");

        Optional<Claim> claimOpt = claimRepository.findById(claimId);
        Optional<User> surveyorOpt = userRepository.findById(surveyorId);

        if (claimOpt.isEmpty()) {
            response.put("message", "Claim not found");
            return ResponseEntity.badRequest().body(response);
        }

        if (surveyorOpt.isEmpty() || !"SURVEYOR".equals(surveyorOpt.get().getRole())) {
            response.put("message", "Valid surveyor not found");
            return ResponseEntity.badRequest().body(response);
        }

        Claim claim = claimOpt.get();
        claim.setAssignedSurveyor(surveyorOpt.get());
        claim.setStatus("IN_REVIEW");
        claimRepository.save(claim);

        response.put("message", "Claim assigned to surveyor successfully");
        response.put("surveyor", surveyorOpt.get());
        return ResponseEntity.ok(response);
    }
    @PostMapping("/policies")
    public ResponseEntity<Policy> addPolicy(@RequestBody Policy policy) {
        policy.setStatus("active");
        return ResponseEntity.ok(policyRepository.save(policy));
    }
    // In AdminController.java

@PostMapping("/claims/{claimId}/final-decision")
public ResponseEntity<Map<String, String>> finalDecision(
        @PathVariable Long claimId,
        @RequestBody Map<String, Object> body) {

    Map<String, String> response = new HashMap<>();

    Optional<Claim> claimOpt = claimRepository.findById(claimId);
    if (claimOpt.isEmpty()) {
        response.put("message", "Claim not found");
        return ResponseEntity.notFound().build();
    }

    Claim claim = claimOpt.get();
    String finalStatus = (String) body.get("finalStatus");

    if (!"APPROVED".equals(finalStatus) && !"REJECTED".equals(finalStatus)) {
        response.put("message", "Invalid status");
        return ResponseEntity.badRequest().body(response);
    }

    Double amount = 0.0;
    Object amountObj = body.get("finalApprovedAmount");
    if (amountObj != null) {
        try {
            amount = Double.parseDouble(amountObj.toString());
        } catch (NumberFormatException e) {
            response.put("message", "Invalid amount");
            return ResponseEntity.badRequest().body(response);
        }
    }

    claim.setStatus(finalStatus);
    claim.setFinalApprovedAmount(amount);
    claimRepository.save(claim);

    response.put("message", "Final decision processed: " + finalStatus);
    return ResponseEntity.ok(response);
}
@GetMapping("/users/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
    Optional<User> userOpt = userRepository.findById(id);
    if (userOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(userOpt.get());
}

// Create new Surveyor (only Admin can call)
@PostMapping("/register-surveyor")
public ResponseEntity<Map<String, String>> registerSurveyor(@RequestBody User surveyor) {
    Map<String, String> response = new HashMap<>();

    if (surveyor.getEmail() == null || surveyor.getPassword() == null || surveyor.getFirstName() == null) {
        response.put("message", "Required fields missing");
        return ResponseEntity.badRequest().body(response);
    }

    if (userRepository.existsByEmail(surveyor.getEmail())) {
        response.put("message", "Email already registered");
        return ResponseEntity.badRequest().body(response);
    }

    surveyor.setRole("SURVEYOR");
    surveyor.setStatus("active");
    userRepository.save(surveyor);

    response.put("message", "Surveyor created successfully");
    return ResponseEntity.ok(response);
}

// Create new Admin (only existing Admin can call)
@PostMapping("/register-admin")
public ResponseEntity<Map<String, String>> registerAdmin(@RequestBody User admin) {
    Map<String, String> response = new HashMap<>();

    if (admin.getEmail() == null || admin.getPassword() == null || admin.getFirstName() == null) {
        response.put("message", "Required fields missing");
        return ResponseEntity.badRequest().body(response);
    }

    if (userRepository.existsByEmail(admin.getEmail())) {
        response.put("message", "Email already registered");
        return ResponseEntity.badRequest().body(response);
    }

    admin.setRole("ADMIN"); 
    admin.setStatus("active");
    userRepository.save(admin);

    response.put("message", "Admin created successfully");
    return ResponseEntity.ok(response);
}   

@PutMapping("/users/me")
public ResponseEntity<Map<String, String>> updateMyProfile(
    Authentication authentication,
    @RequestBody User updatedData) {

    Map<String, String> response = new HashMap<>();

    String email = authentication.getName();
    Optional<User> userOpt = userRepository.findByEmail(email);

    if (userOpt.isEmpty()) {
        response.put("message", "User not found");
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

    response.put("message", "Profile updated successfully");
    return ResponseEntity.ok(response);
}
}