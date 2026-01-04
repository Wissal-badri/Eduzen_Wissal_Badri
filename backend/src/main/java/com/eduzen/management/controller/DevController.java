package com.eduzen.management.controller;

import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * TEMPORARY CONTROLLER - FOR DEVELOPMENT ONLY
 * This controller helps encode passwords for existing users
 * DELETE THIS FILE IN PRODUCTION
 */
@RestController
@RequestMapping("/api/dev")
public class DevController {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public DevController(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    /**
     * Encode a password to BCrypt
     * Example: GET /api/dev/encode-password?password=admin
     */
    @GetMapping("/encode-password")
    public ResponseEntity<?> encodePassword(@RequestParam String password) {
        String encoded = passwordEncoder.encode(password);
        Map<String, String> response = new HashMap<>();
        response.put("plaintext", password);
        response.put("encoded", encoded);
        return ResponseEntity.ok(response);
    }

    /**
     * Update a user's password
     * Example: POST /api/dev/update-password
     * Body: { "username": "admin", "newPassword": "admin" }
     */
    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String newPassword = request.get("newPassword");

        return userRepository.findByUsername(username)
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of(
                            "message", "Password updated successfully for user: " + username,
                            "username", username));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
