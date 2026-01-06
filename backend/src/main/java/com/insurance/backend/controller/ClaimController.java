package com.insurance.backend.controller;

import com.insurance.backend.entity.Claim;
import com.insurance.backend.entity.Coverage;
import com.insurance.backend.entity.Policy;
import com.insurance.backend.entity.User;
import com.insurance.backend.repository.ClaimRepository;
import com.insurance.backend.repository.CoverageRepository;
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
import java.util.*;
import java.util.Optional; 

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

    @Autowired
    private CoverageRepository coverageRepository;

    private static final String UPLOAD_DIR = "uploads/claims/";

    static {
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            System.err.println("Failed to create upload directory: " + e.getMessage());
        }
    }

    // ==================== USER ENDPOINTS ====================

    // Get current user's claims
    @GetMapping("/my")
    public ResponseEntity<List<Claim>> getMyClaims(@RequestParam Long userId) {
        List<Claim> claims = claimRepository.findByUserId(userId);
        return ResponseEntity.ok(claims);
    }

    // Submit simple claim (backward compatibility)
    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submitClaimWithoutCoverage(
            @RequestParam("userId") Long userId,
            @RequestParam("policyId") Long policyId,
            @RequestParam("description") String description,
            @RequestParam("photo") MultipartFile photo) {

        Map<String, String> response = new HashMap<>();

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Policy policy = policyRepository.findById(policyId)
                    .orElseThrow(() -> new RuntimeException("Policy not found"));

            String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, photo.getBytes());

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

    // Get coverages for a policy (used in claim form)
    @GetMapping("/policies/{policyId}/coverages")
    public ResponseEntity<List<Coverage>> getCoveragesByPolicy(@PathVariable Long policyId) {
        if (!policyRepository.existsById(policyId)) {
            return ResponseEntity.notFound().build();
        }
        List<Coverage> coverages = coverageRepository.findByPolicyId(policyId);
        return ResponseEntity.ok(coverages);
    }

    // Submit claim with multiple coverages (main flow)
    @PostMapping("/submit-with-coverage")
    public ResponseEntity<Map<String, Object>> submitClaimWithCoverage(
            @RequestParam("userId") Long userId,
            @RequestParam("policyId") Long policyId,
            @RequestParam("coverageIds") List<Long> coverageIds,
            @RequestParam("description") String description,
            @RequestParam("photo") MultipartFile photo) {

        Map<String, Object> response = new HashMap<>();

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Policy policy = policyRepository.findById(policyId)
                    .orElseThrow(() -> new RuntimeException("Policy not found"));

            List<Coverage> policyCoverages = coverageRepository.findByPolicyId(policyId);
            Set<Coverage> claimedCoverages = new HashSet<>();

            for (Long covId : coverageIds) {
                Optional<Coverage> covOpt = policyCoverages.stream()
                        .filter(c -> c.getId().equals(covId))
                        .findFirst();

                if (covOpt.isEmpty()) {
                    response.put("message", "Invalid coverage ID: " + covId);
                    return ResponseEntity.badRequest().body(response);
                }
                claimedCoverages.add(covOpt.get());
            }

            if (claimedCoverages.isEmpty()) {
                response.put("message", "Please select at least one coverage");
                return ResponseEntity.badRequest().body(response);
            }

            // Save damage photo
            String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, photo.getBytes());

            // Create and save claim
            Claim claim = new Claim();
            claim.setUser(user);
            claim.setPolicy(policy);
            claim.setDescription(description);
            claim.setDamagePhotoPath("/uploads/claims/" + fileName);
            claim.setStatus("PENDING");
            claim.setSubmissionDate(new Date());
            claim.setClaimedCoverages(claimedCoverages);

            Claim savedClaim = claimRepository.save(claim);

            response.put("message", "Claim submitted successfully with selected coverages!");
            response.put("claimId", savedClaim.getId());
            response.put("status", "PENDING");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Error submitting claim: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}


// package com.insurance.backend.controller;

// import com.insurance.backend.entity.Claim;
// import com.insurance.backend.entity.Coverage;
// import com.insurance.backend.entity.Policy;
// import com.insurance.backend.entity.User;
// import com.insurance.backend.repository.ClaimRepository;
// import com.insurance.backend.repository.CoverageRepository; // ← Required for new features
// import com.insurance.backend.repository.PolicyRepository;
// import com.insurance.backend.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.util.*;

// @RestController
// @RequestMapping("/api/claims")  // ← Keeping your original base path
// @CrossOrigin(origins = "http://localhost:5173")
// public class ClaimController {

//     @Autowired
//     private ClaimRepository claimRepository;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private PolicyRepository policyRepository;

//     @Autowired
//     private CoverageRepository coverageRepository; // ← NEW: Needed for coverages

//     private static final String UPLOAD_DIR = "uploads/claims/";

//     static {
//         try {
//             Files.createDirectories(Paths.get(UPLOAD_DIR));
//         } catch (IOException e) {
//             System.err.println("Failed to create upload directory: " + e.getMessage());
//         }
//     }

//     // ==================== EXISTING ENDPOINTS (Working as before) ====================

//     // Get my claims → /api/claims/my?userId=1
//     @GetMapping("/my")
//     public ResponseEntity<List<Claim>> getMyClaims(@RequestParam Long userId) {
//         List<Claim> claims = claimRepository.findByUserId(userId);
//         return ResponseEntity.ok(claims);
//     }

//     // Submit claim WITHOUT coverages (fallback/old version) → /api/claims/submit
//     // This keeps backward compatibility if needed
//     @PostMapping("/submit")
//     public ResponseEntity<Map<String, String>> submitClaimWithoutCoverage(
//             @RequestParam("userId") Long userId,
//             @RequestParam("policyId") Long policyId,
//             @RequestParam("description") String description,
//             @RequestParam("photo") MultipartFile photo) {

//         Map<String, String> response = new HashMap<>();

//         try {
//             User user = userRepository.findById(userId).orElse(null);
//             Policy policy = policyRepository.findById(policyId).orElse(null);

//             if (user == null || policy == null) {
//                 response.put("message", "Invalid user or policy");
//                 return ResponseEntity.badRequest().body(response);
//             }

//             String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
//             Path path = Paths.get(UPLOAD_DIR + fileName);
//             Files.write(path, photo.getBytes());

//             Claim claim = new Claim();
//             claim.setUser(user);
//             claim.setPolicy(policy);
//             claim.setDescription(description);
//             claim.setDamagePhotoPath("/uploads/claims/" + fileName);
//             claim.setStatus("PENDING");
//             claim.setSubmissionDate(new Date());

//             claimRepository.save(claim);

//             response.put("message", "Claim submitted successfully! Status: PENDING");
//             return ResponseEntity.ok(response);

//         } catch (Exception e) {
//             response.put("message", "Error submitting claim: " + e.getMessage());
//             return ResponseEntity.badRequest().body(response);
//         }
//     }

//     // ==================== NEW ENDPOINTS (For Coverage Features) ====================

//     // 1. Get coverages for a policy → /api/claims/policies/5/coverages
//     @GetMapping("/policies/{policyId}/coverages")
//     public ResponseEntity<List<Coverage>> getCoveragesByPolicy(@PathVariable Long policyId) {
//         List<Coverage> coverages = coverageRepository.findByPolicyId(policyId);
//         return ResponseEntity.ok(coverages);
//     }

//     // 2. Submit claim WITH multiple coverages → /api/claims/submit-with-coverage
//     // Using a different path to avoid conflict with old /submit
//     @PostMapping("/submit-with-coverage")
//     public ResponseEntity<Map<String, Object>> submitClaimWithCoverage(
//             @RequestParam("userId") Long userId,
//             @RequestParam("policyId") Long policyId,
//             @RequestParam("coverageIds") List<Long> coverageIds,
//             @RequestParam("description") String description,
//             @RequestParam("photo") MultipartFile photo) {

//         Map<String, Object> response = new HashMap<>();

//         try {
//             User user = userRepository.findById(userId)
//                     .orElseThrow(() -> new RuntimeException("User not found"));

//             Policy policy = policyRepository.findById(policyId)
//                     .orElseThrow(() -> new RuntimeException("Policy not found"));

//             // Get valid coverages for this policy
//             List<Coverage> policyCoverages = coverageRepository.findByPolicyId(policyId);
//             Set<Coverage> claimedCoverages = new HashSet<>();

//             for (Long covId : coverageIds) {
//                 Coverage coverage = policyCoverages.stream()
//                         .filter(c -> c.getId().equals(covId))
//                         .findFirst()
//                         .orElse(null);

//                 if (coverage == null) {
//                     response.put("message", "Invalid coverage ID: " + covId);
//                     return ResponseEntity.badRequest().body(response);
//                 }
//                 claimedCoverages.add(coverage);
//             }

//             if (claimedCoverages.isEmpty()) {
//                 response.put("message", "Please select at least one coverage");
//                 return ResponseEntity.badRequest().body(response);
//             }

//             // Save photo
//             String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
//             Path path = Paths.get(UPLOAD_DIR + fileName);
//             Files.write(path, photo.getBytes());

//             // Create claim
//             Claim claim = new Claim();
//             claim.setUser(user);
//             claim.setPolicy(policy);
//             claim.setDescription(description);
//             claim.setDamagePhotoPath("/uploads/claims/" + fileName);
//             claim.setStatus("PENDING");
//             claim.setSubmissionDate(new Date());
//             claim.setClaimedCoverages(claimedCoverages); // ← Save selected coverages

//             Claim savedClaim = claimRepository.save(claim);

//             response.put("message", "Claim submitted successfully with selected coverages!");
//             response.put("claimId", savedClaim.getId());
//             response.put("status", "PENDING");

//             return ResponseEntity.ok(response);

//         } catch (Exception e) {
//             e.printStackTrace();
//             response.put("message", "Error: " + e.getMessage());
//             return ResponseEntity.badRequest().body(response);
//         }
//     }
//     // In AdminController.java or ClaimController.java

// @PostMapping("/admin/claims/{claimId}/final-decision")
// public ResponseEntity<?> finalDecision(
//         @PathVariable Long claimId,
//         @RequestBody Map<String, Object> body) {

//     Optional<Claim> claimOpt = claimRepository.findById(claimId);
//     if (claimOpt.isEmpty()) {
//         return ResponseEntity.notFound().build();
//     }

//     Claim claim = claimOpt.get();

//     String finalStatus = (String) body.get("finalStatus");
//     Double finalAmount = body.get("finalApprovedAmount") != null 
//         ? Double.valueOf(body.get("finalApprovedAmount").toString()) 
//         : 0.0;

//     if (!"APPROVED".equals(finalStatus) && !"REJECTED".equals(finalStatus)) {
//         return ResponseEntity.badRequest().body("Invalid status");
//     }

//     claim.setStatus(finalStatus);
//     claim.setFinalApprovedAmount(finalAmount);

//     claimRepository.save(claim);

//     return ResponseEntity.ok("Final decision processed successfully");
// }

// }