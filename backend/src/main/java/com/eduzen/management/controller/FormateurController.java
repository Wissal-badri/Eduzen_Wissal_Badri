package com.eduzen.management.controller;

import com.eduzen.management.dto.FormateurRequest;
import com.eduzen.management.model.Formateur;
import com.eduzen.management.model.Role;
import com.eduzen.management.model.User;
import com.eduzen.management.repository.FormateurRepository;
import com.eduzen.management.repository.RoleRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
public class FormateurController {

    private final FormateurRepository formateurRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public FormateurController(FormateurRepository formateurRepository, UserRepository userRepository,
            RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.formateurRepository = formateurRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Formateur> getAllFormateurs() {
        return formateurRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> createFormateur(@RequestBody FormateurRequest request) {
        Role formateurRole = roleRepository.findByName("FORMATEUR")
                .orElseThrow(() -> new RuntimeException("Role FORMATEUR not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(formateurRole);
        user = userRepository.save(user);

        Formateur formateur = new Formateur();
        formateur.setUser(user);
        formateur.setCompetences(request.getCompetences());
        formateur.setRemarques(request.getRemarques());

        return ResponseEntity.ok(formateurRepository.save(formateur));
    }
}
