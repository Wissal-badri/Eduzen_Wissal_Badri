package com.eduzen.management.controller;

import com.eduzen.management.model.Inscription;
import com.eduzen.management.model.Notification;
import com.eduzen.management.model.User;
import com.eduzen.management.repository.FormationRepository;
import com.eduzen.management.repository.InscriptionRepository;
import com.eduzen.management.repository.NotificationRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    private final InscriptionRepository inscriptionRepository;
    private final UserRepository userRepository;
    private final FormationRepository formationRepository;
    private final NotificationRepository notificationRepository;

    public InscriptionController(InscriptionRepository inscriptionRepository,
            UserRepository userRepository,
            FormationRepository formationRepository,
            NotificationRepository notificationRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.userRepository = userRepository;
        this.formationRepository = formationRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping("/formation/{formationId}")
    @PreAuthorize("hasRole('INDIVIDU')")
    public ResponseEntity<?> register(Authentication authentication, @PathVariable Long formationId) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (inscriptionRepository.existsByUser_IdAndFormation_Id(user.getId(), formationId)) {
            return ResponseEntity.badRequest().body("Déjà inscrit à cette formation");
        }

        return formationRepository.findById(formationId).map(formation -> {
            Inscription inscription = new Inscription();
            inscription.setUser(user);
            inscription.setFormation(formation);
            inscription.setStatut("EN_ATTENTE");
            inscription.setDateInscription(LocalDateTime.now());

            inscriptionRepository.save(inscription);

            // Create notification for Admin/Assistant
            Notification notification = new Notification();
            notification.setMessage("Nouvelle inscription : " + user.getFirstName() + " " + user.getLastName() +
                    " pour " + formation.getTitre());
            notification.setFormationId(formationId);
            notification.setType("INSCRIPTION");
            notificationRepository.save(notification);

            return ResponseEntity.ok(inscription);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('INDIVIDU')")
    public List<Inscription> getMyInscriptions(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return inscriptionRepository.findByUser(user);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalInscriptions = inscriptionRepository.count();
        stats.put("totalInscriptions", totalInscriptions);

        // Count by formation could be added here
        return ResponseEntity.ok(stats);
    }
}
