package com.yourcompany.inventory.service;

import com.yourcompany.inventory.dto.auth.AuthResponse;
import com.yourcompany.inventory.dto.auth.LoginRequest;
import com.yourcompany.inventory.dto.auth.RegisterRequest;
import com.yourcompany.inventory.dto.auth.VerifyOtpRequest;
import com.yourcompany.inventory.exception.AuthException;
import com.yourcompany.inventory.exception.DuplicateEmailException;
import com.yourcompany.inventory.model.User;
import com.yourcompany.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Value("${app.otp.expiration-minutes:10}")
    private long otpExpirationMinutes;

    @Transactional
    public void register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = new User();
        user.setEmail(email);
        user.setStoreName(request.getStoreName().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        user.setIsVerified(false);

        User savedUser = userRepository.save(user);

        String otp = otpService.generateAndStoreOtp(savedUser);
        emailService.sendOtpEmail(savedUser.getEmail(), savedUser.getStoreName(), otp, otpExpirationMinutes);
    }

    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AuthException("User not found"));

        otpService.verifyOtp(user, request.getOtp());
        user.setIsVerified(true);
        userRepository.save(user);
        otpService.clearOtp(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getStoreName());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("Invalid email or password"));

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getIsVerified())) {
            throw new AuthException("Email is not verified. Please verify OTP first.");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getStoreName());
    }
}
