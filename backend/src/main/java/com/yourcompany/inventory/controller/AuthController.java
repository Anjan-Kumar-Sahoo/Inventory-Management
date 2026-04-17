package com.yourcompany.inventory.controller;

import com.yourcompany.inventory.dto.auth.AuthResponse;
import com.yourcompany.inventory.dto.auth.LoginRequest;
import com.yourcompany.inventory.dto.auth.MessageResponse;
import com.yourcompany.inventory.dto.auth.RegisterRequest;
import com.yourcompany.inventory.dto.auth.VerifyOtpRequest;
import com.yourcompany.inventory.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Registration successful. Please verify OTP sent to your email."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<MessageResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request);
        return ResponseEntity.ok(new MessageResponse("OTP verified successfully."));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
