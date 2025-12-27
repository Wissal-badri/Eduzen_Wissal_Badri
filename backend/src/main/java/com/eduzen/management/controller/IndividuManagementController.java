package com.eduzen.management.controller;

import com.eduzen.management.model.User;
import com.eduzen.management.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/management/individus")
@PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
public class IndividuManagementController {

    private final UserRepository userRepository;

    public IndividuManagementController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllIndividus() {
        // Filter users who have the role INDIVIDU
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "INDIVIDU".equals(user.getRole().getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/by-entreprise")
    public List<User> getByEntreprise(@RequestParam String entreprise) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "INDIVIDU".equals(user.getRole().getName()))
                .filter(user -> entreprise.equalsIgnoreCase(user.getEntreprise()))
                .collect(Collectors.toList());
    }
}
