package com.insurance.backend.controller;

import com.insurance.backend.entity.Claim;
import com.insurance.backend.entity.User;
import com.insurance.backend.repository.ClaimRepository;
import com.insurance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:5173")
public class SurveyorController {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String SURVEY_PHOTO_DIR = "uploads/survey-photos/";

    static {
        try {
            Files.createDirectories(Paths.get(SURVEY_PHOTO_DIR));
        } catch (IOException e) {
            System.err.println("Could not create survey photos directory: " + e.getMessage());
        }
    }

    // 1. Get claims assigned to a surveyor
    @GetMapping("/surveyor/{surveyorId}")
    public ResponseEntity<List<Claim>> getAssignedClaims(@PathVariable Long surveyorId) {
        Optional<User> surveyorOpt = userRepository.findById(surveyorId);
        if (surveyorOpt.isEmpty() || !"SURVEYOR".equals(surveyorOpt.get().getRole())) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Claim> assignedClaims = claimRepository.findByAssignedSurveyorId(surveyorId);
        return ResponseEntity.ok(assignedClaims);
    }

    // 2. Submit survey report
    @PostMapping("/{claimId}/survey-report")
    public ResponseEntity<?> submitSurveyReport(
            @PathVariable Long claimId,
            @RequestParam("recommendedAmount") String recommendedAmountStr,
            @RequestParam String surveyReport,
            @RequestParam String recommendation,  // "APPROVED" or "REJECTED" from frontend radio
            @RequestParam(required = false) MultipartFile[] surveyPhotos) {

        Optional<Claim> claimOpt = claimRepository.findById(claimId);
        if (claimOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Claim claim = claimOpt.get();

    // Parse recommendedAmount safely
    double recommendedAmount = 0;
    if (recommendedAmountStr != null && !recommendedAmountStr.trim().isEmpty()) {
        try {
            recommendedAmount = Double.parseDouble(recommendedAmountStr.trim());
            if (recommendedAmount < 0) {
                return ResponseEntity.badRequest().body("Amount cannot be negative");
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid amount format. Please enter a valid number.");
        }
    }

        // Update fields
        claim.setRecommendedAmount(recommendedAmount);
        claim.setSurveyReport(surveyReport);
        claim.setRecommendation(recommendation);  // "APPROVED" or "REJECTED"

        // Handle multiple photos
        if (surveyPhotos != null && surveyPhotos.length > 0) {
            StringBuilder photoPaths = new StringBuilder();
            for (MultipartFile photo : surveyPhotos) {
                if (!photo.isEmpty()) {
                    try {
                        String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                        Path path = Paths.get(SURVEY_PHOTO_DIR + fileName);
                        Files.write(path, photo.getBytes());

                        if (photoPaths.length() > 0) photoPaths.append(";");
                        photoPaths.append("/uploads/survey-photos/").append(fileName);
                    } catch (IOException e) {
                        return ResponseEntity.internalServerError()
                                .body("Failed to upload photo: " + photo.getOriginalFilename());
                    }
                }
            }
            claim.setSurveyPhotoPaths(photoPaths.toString());
        }

        // Update status to notify admin
        claim.setStatus("SURVEY_COMPLETED");

        claimRepository.save(claim);

        return ResponseEntity.ok("Survey report submitted successfully!");
    }

    // REMOVE the old two methods and use ONLY this one

@GetMapping("/admin/surveyors")
public ResponseEntity<List<User>> getAllSurveyors() {
    List<User> surveyors = userRepository.findByRole("SURVEYOR");

    System.out.println("=== FETCHING SURVEYORS ===");
    System.out.println("Total surveyors found: " + surveyors.size());
    surveyors.forEach(s -> 
        System.out.println("ID: " + s.getId() + " | " + s.getFirstName() + " " + s.getLastName() + " | " + s.getEmail() + " | Role: " + s.getRole())
    );

    return ResponseEntity.ok(surveyors);
}
}