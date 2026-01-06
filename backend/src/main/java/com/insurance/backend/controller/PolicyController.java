package com.insurance.backend.controller;

import com.insurance.backend.entity.Coverage;
import com.insurance.backend.entity.Policy;
import com.insurance.backend.repository.CoverageRepository;
import com.insurance.backend.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "http://localhost:5173")
public class PolicyController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private CoverageRepository coverageRepository;

    // Get all policies
    @GetMapping
    public ResponseEntity<List<Policy>> getAllPolicies() {
        return ResponseEntity.ok(policyRepository.findAll());
    }

    // Get active policies only
    @GetMapping("/active")
    public ResponseEntity<List<Policy>> getActivePolicies() {
        List<Policy> activePolicies = policyRepository.findAll().stream()
                .filter(p -> "active".equals(p.getStatus()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(activePolicies);
    }

    // Get coverages for a policy
    @GetMapping("/{id}/coverages")
    public ResponseEntity<List<Coverage>> getPolicyCoverages(@PathVariable Long id) {
        if (!policyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(coverageRepository.findByPolicyId(id));
    }

    // Add coverage to policy
    @PostMapping("/{id}/coverages")
    public ResponseEntity<?> addCoverage(@PathVariable Long id, @RequestBody Coverage coverage) {
        Optional<Policy> policyOpt = policyRepository.findById(id);
        if (policyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        coverage.setPolicy(policyOpt.get());
        Coverage saved = coverageRepository.save(coverage);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Coverage added successfully");
        response.put("coverage", saved);

        return ResponseEntity.ok(response);
    }

    // Activate policy
    @PutMapping("/{id}/active")
    public ResponseEntity<Map<String, String>> activatePolicy(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        Optional<Policy> policyOpt = policyRepository.findById(id);
        if (policyOpt.isEmpty()) {
            response.put("message", "Policy not found");
            return ResponseEntity.notFound().build();
        }

        Policy policy = policyOpt.get();
        policy.setStatus("active");
        policyRepository.save(policy);

        response.put("message", "Policy activated successfully");
        return ResponseEntity.ok(response);
    }

    // Deactivate policy
    @PutMapping("/{id}/inactive")
    public ResponseEntity<Map<String, String>> deactivatePolicy(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        Optional<Policy> policyOpt = policyRepository.findById(id);
        if (policyOpt.isEmpty()) {
            response.put("message", "Policy not found");
            return ResponseEntity.notFound().build();
        }

        Policy policy = policyOpt.get();
        policy.setStatus("inactive");
        policyRepository.save(policy);

        response.put("message", "Policy deactivated successfully");
        return ResponseEntity.ok(response);
    }

    // Update (Edit) policy
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable Long id, @RequestBody Policy updatedPolicy) {
        Optional<Policy> policyOpt = policyRepository.findById(id);
        if (policyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Policy policy = policyOpt.get();
        policy.setName(updatedPolicy.getName());
        policy.setDescription(updatedPolicy.getDescription());
        policy.setPremiumAmount(updatedPolicy.getPremiumAmount());
        policy.setPlan(updatedPolicy.getPlan());
        // status remains unchanged unless explicitly set

        Policy saved = policyRepository.save(policy);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Policy updated successfully");
        response.put("policy", saved);

        return ResponseEntity.ok(response);
    }

    // Delete policy
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePolicy(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        if (!policyRepository.existsById(id)) {
            response.put("message", "Policy not found");
            return ResponseEntity.notFound().build();
        }

        // Optional: Check if policy has claims before deleting
        // You can add this check later if needed

        try {
            policyRepository.deleteById(id);
            response.put("message", "Policy deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Cannot delete policy with active claims or coverages");
            return ResponseEntity.status(500).body(response);
        }
    }
    @GetMapping("/{id}")
public ResponseEntity<Policy> getPolicyById(@PathVariable Long id) {
    Optional<Policy> policyOpt = policyRepository.findById(id);
    if (policyOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(policyOpt.get());
}
}