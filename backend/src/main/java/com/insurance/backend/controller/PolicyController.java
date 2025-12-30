package com.insurance.backend.controller;

import com.insurance.backend.entity.Coverage;
import com.insurance.backend.entity.Policy;
import com.insurance.backend.repository.CoverageRepository;
import com.insurance.backend.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "http://localhost:5173")
public class PolicyController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private CoverageRepository coverageRepository;

    @GetMapping
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    @PostMapping("/{id}/coverages")
    public Coverage addCoverage(@PathVariable Long id, @RequestBody Coverage coverage) {
        Policy policy = policyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        coverage.setPolicy(policy);
        return coverageRepository.save(coverage);
    }

    @GetMapping("/{id}/coverages")
    public List<Coverage> getPolicyCoverages(@PathVariable Long id) {
        return coverageRepository.findByPolicyId(id);
    }

    @GetMapping("/active")
    public List<Policy> getActivePolicies() {
        return policyRepository.findAll().stream()
            .filter(p -> "active".equals(p.getStatus()))
            .collect(Collectors.toList());
    }

    @PutMapping("/{id}/inactive")
    public Policy deactivatePolicy(@PathVariable Long id) {
        Policy policy = policyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        policy.setStatus("inactive");
        return policyRepository.save(policy);
    }
}