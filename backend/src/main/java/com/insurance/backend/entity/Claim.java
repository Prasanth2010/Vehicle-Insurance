package com.insurance.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @Column(name = "status", nullable = false)
    private String status = "PENDING";

    private String description;

    private String damagePhotoPath;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "submission_date")
    private Date submissionDate;

    private double payoutAmount;

    // Additional fields from your requirement
    private double claimAmount;

    @Temporal(TemporalType.DATE)
    @Column(name = "accident_date")
    private Date accidentDate;

    private double amountApproved;

    @Column(name = "action_status")
    private String actionStatus;

    @Column(name = "customer_response")
    private String customerResponse;
}