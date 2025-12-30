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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimController {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    private static final String UPLOAD_DIR = "uploads/claims/";

    // Create upload folder on startup (simple way)
    static {
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Get user's claims
    @GetMapping("/my")
    public List<Claim> getMyClaims(@RequestParam Long userId) {
        return claimRepository.findByUserId(userId);
    }

    // Submit new claim
    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submitClaim(
            @RequestParam("userId") Long userId,
            @RequestParam("policyId") Long policyId,
            @RequestParam("description") String description,
            @RequestParam("photo") MultipartFile photo) {

        Map<String, String> response = new HashMap<>();

        try {
            User user = userRepository.findById(userId).orElse(null);
            Policy policy = policyRepository.findById(policyId).orElse(null);

            if (user == null || policy == null) {
                response.put("message", "Invalid user or policy");
                return ResponseEntity.badRequest().body(response);
            }

            // Save photo
            String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, photo.getBytes());

            // Create claim
            Claim claim = new Claim();
            claim.setUser(user);
            claim.setPolicy(policy);
            claim.setDescription(description);
            claim.setDamagePhotoPath("/uploads/claims/" + fileName);
            claim.setStatus("PENDING");
            claim.setSubmissionDate(new Date());

            claimRepository.save(claim);

            response.put("message", "Claim submitted successfully! Status: PENDING");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error submitting claim: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}