package com.insurance.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String status;
    private String damagePhotoPath;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "submission_date")
    private Date submissionDate;

    private double payoutAmount;
    private double claimAmount;

    @Temporal(TemporalType.DATE)
    @Column(name = "accident_date")
    private Date accidentDate;

    private double amountApproved;

    @Column(name = "action_status")
    private String actionStatus;

    @Column(name = "customer_response")
    private String customerResponse;

    // Surveyor related fields
    @ManyToOne
    @JoinColumn(name = "assigned_surveyor_id")
    private User assignedSurveyor;
    
    private Double recommendedAmount;
    
    @Column(columnDefinition = "TEXT")
    private String surveyReport;
    
    private String surveyStatus;
    
    private String surveyPhotoPaths;
    
    private Double finalApprovedAmount;

    // User and Policy relationships
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    // Claimed coverages
    @ManyToMany
    @JoinTable(
        name = "claim_coverages",
        joinColumns = @JoinColumn(name = "claim_id"),
        inverseJoinColumns = @JoinColumn(name = "coverage_id")
    )
    private Set<Coverage> claimedCoverages = new HashSet<>();

    // Updated at timestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Pre-persist and pre-update to auto-set dates
    @PrePersist
    protected void onCreate() {
        if (submissionDate == null) {
            submissionDate = new Date();
        }
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    private String recommendation; // "APPROVED" or "REJECTED"
    
}