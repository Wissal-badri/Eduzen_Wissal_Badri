package com.eduzen.management.controller;

import com.eduzen.management.dto.FormateurRequest;
import com.eduzen.management.model.Evaluation;
import com.eduzen.management.model.Formateur;
import com.eduzen.management.model.Formation;
import com.eduzen.management.model.Role;
import com.eduzen.management.model.User;
import com.eduzen.management.repository.EvaluationRepository;
import com.eduzen.management.repository.FormateurRepository;
import com.eduzen.management.repository.FormationRepository;
import com.eduzen.management.repository.RoleRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/formateurs")
public class FormateurController {

    private final FormateurRepository formateurRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final FormationRepository formationRepository;
    private final EvaluationRepository evaluationRepository;

    public FormateurController(FormateurRepository formateurRepository, UserRepository userRepository,
            RoleRepository roleRepository, PasswordEncoder passwordEncoder,
            FormationRepository formationRepository, EvaluationRepository evaluationRepository) {
        this.formateurRepository = formateurRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.formationRepository = formationRepository;
        this.evaluationRepository = evaluationRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
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
        user.setEnabled(true);
        user.setProfileCompleted(true);
        user = userRepository.save(user);

        Formateur formateur = new Formateur();
        formateur.setUser(user);
        formateur.setCompetences(request.getCompetences());
        formateur.setRemarques(request.getRemarques());

        return ResponseEntity.ok(formateurRepository.save(formateur));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> updateFormateur(@PathVariable Long id, @RequestBody FormateurRequest request) {
        return formateurRepository.findById(id).map(formateur -> {
            User user = formateur.getUser();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            userRepository.save(user);

            formateur.setCompetences(request.getCompetences());
            formateur.setRemarques(request.getRemarques());
            return ResponseEntity.ok(formateurRepository.save(formateur));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> deleteFormateur(@PathVariable Long id) {
        return formateurRepository.findById(id).map(formateur -> {
            User user = formateur.getUser();
            formateurRepository.delete(formateur);
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> approveFormateur(@PathVariable Long id) {
        return formateurRepository.findById(id).map(formateur -> {
            User user = formateur.getUser();
            user.setEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok(formateur);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<?> getFormateurRating(@PathVariable Long id) {
        return formateurRepository.findById(id).map(formateur -> {
            List<Formation> formations = formationRepository.findByFormateurId(id);

            if (formations.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "averageRating", 0.0,
                        "totalEvaluations", 0));
            }

            int totalEvaluations = 0;
            double sumRatings = 0.0;

            for (Formation formation : formations) {
                List<Evaluation> evaluations = evaluationRepository.findByFormationId(formation.getId());
                for (Evaluation eval : evaluations) {
                    double avgForEval = ((eval.getQualitePedagogique() != null ? eval.getQualitePedagogique() : 0) +
                            (eval.getRythme() != null ? eval.getRythme() : 0) +
                            (eval.getSupportCours() != null ? eval.getSupportCours() : 0) +
                            (eval.getMaitriseSujet() != null ? eval.getMaitriseSujet() : 0)) / 4.0;

                    sumRatings += avgForEval;
                    totalEvaluations++;
                }
            }

            double averageRating = totalEvaluations > 0 ? sumRatings / totalEvaluations : 0.0;

            return ResponseEntity.ok(Map.of(
                    "averageRating", Math.round(averageRating * 10.0) / 10.0,
                    "totalEvaluations", totalEvaluations));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/rating")
    public ResponseEntity<?> getFormateurRatingByUserId(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .flatMap(user -> formateurRepository.findByUserId(userId))
                .map(formateur -> {
                    List<Formation> formations = formationRepository.findByFormateurId(formateur.getId());

                    if (formations.isEmpty()) {
                        return ResponseEntity.ok(Map.of(
                                "averageRating", 0.0,
                                "totalEvaluations", 0));
                    }

                    int totalEvaluations = 0;
                    double sumRatings = 0.0;

                    for (Formation formation : formations) {
                        List<Evaluation> evaluations = evaluationRepository.findByFormationId(formation.getId());
                        for (Evaluation eval : evaluations) {
                            double avgForEval = ((eval.getQualitePedagogique() != null ? eval.getQualitePedagogique()
                                    : 0) +
                                    (eval.getRythme() != null ? eval.getRythme() : 0) +
                                    (eval.getSupportCours() != null ? eval.getSupportCours() : 0) +
                                    (eval.getMaitriseSujet() != null ? eval.getMaitriseSujet() : 0)) / 4.0;

                            sumRatings += avgForEval;
                            totalEvaluations++;
                        }
                    }

                    double averageRating = totalEvaluations > 0 ? sumRatings / totalEvaluations : 0.0;

                    return ResponseEntity.ok(Map.of(
                            "averageRating", Math.round(averageRating * 10.0) / 10.0,
                            "totalEvaluations", totalEvaluations));
                })
                .orElse(ResponseEntity.ok(Map.of(
                        "averageRating", 0.0,
                        "totalEvaluations", 0)));
    }

    @GetMapping("/check-status")
    public ResponseEntity<?> checkApplicationStatus(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Check if user is a formateur
        if (!"FORMATEUR".equals(user.getRole().getName())) {
            return ResponseEntity.notFound().build();
        }

        // Return user status
        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "enabled", user.getEnabled()));
    }
}
