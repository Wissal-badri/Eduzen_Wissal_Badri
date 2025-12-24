package com.eduzen.management.controller;

import com.eduzen.management.model.User;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final com.eduzen.management.repository.RoleRepository roleRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
            com.eduzen.management.repository.RoleRepository roleRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole().getName());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    // Registration Endpoint
    @org.springframework.web.bind.annotation.PostMapping("/signup")
    public ResponseEntity<?> registerUser(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        String password = payload.get("password");
        String roleName = payload.get("role");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(java.util.Collections.singletonMap("message", "Error: Username is already taken!"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(java.util.Collections.singletonMap("message", "Error: Email is already in use!"));
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        String dbRoleName;
        if ("etudiant".equalsIgnoreCase(roleName))
            dbRoleName = "ETUDIANT"; // Note: Ensure this role exists in DB or map to something else if specific
                                     // logic required
        else if ("formateur".equalsIgnoreCase(roleName))
            dbRoleName = "FORMATEUR";
        else if ("assistant".equalsIgnoreCase(roleName))
            dbRoleName = "ASSISTANT";
        else if ("admin".equalsIgnoreCase(roleName))
            dbRoleName = "ADMIN";
        else
            dbRoleName = "ETUDIANT"; // Default to student

        // If Role ETUDIANT not in DB yet, you might face issues. Ideally
        // DataInitializer should have it.
        // Assuming DataInitializer added standard roles. If 'ETUDIANT' is missing,
        // fallback to 'ASSISTANT' or fail?
        // Let's assume it exists or fallback gracefully.

        com.eduzen.management.model.Role role = roleRepository.findByName(dbRoleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + dbRoleName + " is not found in database."));

        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "User registered successfully!"));
    }
}
