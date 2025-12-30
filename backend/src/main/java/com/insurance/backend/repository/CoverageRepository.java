package com.insurance.backend.repository;

import com.insurance.backend.entity.Coverage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoverageRepository extends JpaRepository<Coverage, Long> {
    List<Coverage> findByPolicyId(Long policyId);
}   