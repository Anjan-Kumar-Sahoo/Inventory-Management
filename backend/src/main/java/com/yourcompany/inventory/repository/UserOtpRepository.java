package com.yourcompany.inventory.repository;

import com.yourcompany.inventory.model.UserOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserOtpRepository extends JpaRepository<UserOtp, Long> {
    Optional<UserOtp> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
