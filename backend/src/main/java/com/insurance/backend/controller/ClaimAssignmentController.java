package com.insurance.backend.controller;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/claims")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimAssignmentController {

    

    // @PostMapping("/{claimId}/assign")
    // public ResponseEntity<?> assignSurveyor(
    //         @PathVariable Long claimId,
    //         @RequestBody AssignRequest request) {

    //     Optional<Claim> claimOpt = claimRepository.findById(claimId);
    //     if (claimOpt.isEmpty()) {
    //         return ResponseEntity.badRequest().body("Claim not found");
    //     }

    //     Optional<User> surveyorOpt = userRepository.findById(request.getSurveyorId());
    //     if (surveyorOpt.isEmpty() || !"SURVEYOR".equals(surveyorOpt.get().getRole())) {
    //         return ResponseEntity.badRequest().body("Valid surveyor not found");
    //     }

    //     Claim claim = claimOpt.get();
    //     claim.setAssignedSurveyor(surveyorOpt.get());  // Make sure you have this field in Claim entity
    //     claim.setStatus("IN_REVIEW");
    //     claimRepository.save(claim);

    //     return ResponseEntity.ok("Claim assigned successfully");
    // }

    // DTO for request body
    static class AssignRequest {
        private Long surveyorId;

        public Long getSurveyorId() { return surveyorId; }
        public void setSurveyorId(Long surveyorId) { this.surveyorId = surveyorId; }
    }
}