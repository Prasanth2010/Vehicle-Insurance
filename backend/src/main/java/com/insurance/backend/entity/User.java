package com.insurance.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String contactNo;
    private int age;
    private String gender;
    private String street;
    private String city;
    private String pincode;
    
    @Column(nullable = false)
    private String role;  // USER, ADMIN, SURVEYOR

    private String status; // "active" or "inactive"

public String getStatus() { return status; }
public void setStatus(String status) { this.status = status; }
}