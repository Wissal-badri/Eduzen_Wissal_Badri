package com.eduzen.management.controller;

import com.eduzen.management.model.User;
import com.eduzen.management.model.Formateur;
import com.eduzen.management.model.Notification;
import com.eduzen.management.repository.RoleRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final com.eduzen.management.repository.FormateurRepository formateurRepository;
    private final com.eduzen.management.repository.NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
            RoleRepository roleRepository,
            com.eduzen.management.repository.FormateurRepository formateurRepository,
            com.eduzen.management.repository.NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.formateurRepository = formateurRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody User profileData) {
        return userRepository.findByUsername(authentication.getName()).map(user -> {
            user.setFirstName(profileData.getFirstName());
            user.setLastName(profileData.getLastName());
            user.setPhone(profileData.getPhone());
            user.setEntreprise(profileData.getEntreprise());
            user.setProfileCompleted(true);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
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
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("phone", user.getPhone());
        response.put("entreprise", user.getEntreprise());
        response.put("profileCompleted", user.getProfileCompleted() != null ? user.getProfileCompleted() : false);
        response.put("lastPasswordChange", user.getLastPasswordChange());
        response.put("emailAlerts", user.getEmailAlerts() != null ? user.getEmailAlerts() : true);
        response.put("newsletters", user.getNewsletters() != null ? user.getNewsletters() : false);

        return ResponseEntity.ok(response);
    }

    // Registration Endpoint
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        String password = payload.get("password");
        String roleName = payload.get("role");
        String competences = payload.get("competences"); // Keywords for formateurs

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Error: Username is already taken!"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Error: Email is already in use!"));
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setLastPasswordChange(LocalDateTime.now());
        user.setProfileCompleted(false);

        String dbRoleName;
        if ("individu".equalsIgnoreCase(roleName))
            dbRoleName = "INDIVIDU";
        else if ("formateur".equalsIgnoreCase(roleName))
            dbRoleName = "FORMATEUR";
        else if ("assistant".equalsIgnoreCase(roleName))
            dbRoleName = "ASSISTANT";
        else if ("admin".equalsIgnoreCase(roleName))
            dbRoleName = "ADMIN";
        else
            dbRoleName = "INDIVIDU";

        com.eduzen.management.model.Role role = roleRepository.findByName(dbRoleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + dbRoleName + " is not found in database."));

        user.setRole(role);

        // External trainers need admin approval
        if ("FORMATEUR".equals(dbRoleName)) {
            user.setEnabled(false);
        } else {
            user.setEnabled(true);
        }

        User savedUser = userRepository.save(user);

        // If it's a formateur, create the Formateur record with keywords
        if ("FORMATEUR".equals(dbRoleName)) {
            Formateur formateur = new Formateur();
            formateur.setUser(savedUser);
            formateur.setCompetences(competences);
            formateurRepository.save(formateur);

            // Notify admin
            Notification notif = new Notification();
            notif.setMessage("Nouvelle demande d'inscription Formateur: " + username);
            notif.setRead(false);
            notificationRepository.save(notif);

            return ResponseEntity.ok(Collections.singletonMap("message",
                    "Votre demande a été envoyée ! Veuillez attendre l'approbation de l'administrateur pour vous connecter."));
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully!"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> payload) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Collections.singletonMap("message", "User not found"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Mot de passe actuel incorrect"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setLastPasswordChange(LocalDateTime.now());
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mot de passe mis à jour avec succès");
        response.put("lastPasswordChange", user.getLastPasswordChange());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(
            Authentication authentication,
            @RequestBody Map<String, Boolean> payload) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Collections.singletonMap("message", "User not found"));
        }

        User user = userOpt.get();
        if (payload.containsKey("emailAlerts")) {
            user.setEmailAlerts(payload.get("emailAlerts"));
        }
        if (payload.containsKey("newsletters")) {
            user.setNewsletters(payload.get("newsletters"));
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Préférences mises à jour");
        response.put("emailAlerts", user.getEmailAlerts() != null ? user.getEmailAlerts() : true);
        response.put("newsletters", user.getNewsletters() != null ? user.getNewsletters() : false);

        return ResponseEntity.ok(response);
    }

    /**
     * Admin endpoint to reset a user's password
     * Only accessible by users with ADMIN role
     */
    @PutMapping("/admin/reset-password/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminResetPassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> payload) {

        String newPassword = payload.get("newPassword");

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Le nouveau mot de passe est requis"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Le mot de passe doit contenir au moins 6 caractères"));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Collections.singletonMap("message", "Utilisateur non trouvé"));
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setLastPasswordChange(LocalDateTime.now());
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mot de passe réinitialisé avec succès pour " + user.getUsername());
        response.put("userId", userId);
        response.put("username", user.getUsername());

        return ResponseEntity.ok(response);
    }

    /**
     * Admin endpoint to get all users for password management
     */
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsersForAdmin() {
        List<User> users = userRepository.findAll();

        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole() != null ? user.getRole().getName() : null);
            userMap.put("lastPasswordChange", user.getLastPasswordChange());
            return userMap;
        }).toList();

        return ResponseEntity.ok(userList);
    }
}
