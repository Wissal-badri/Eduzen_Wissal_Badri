package com.eduzen.management.controller;

import com.eduzen.management.model.Individu;
import com.eduzen.management.model.Inscription;
import com.eduzen.management.model.Notification;
import com.eduzen.management.model.User;
import com.eduzen.management.model.Planning;
import com.eduzen.management.repository.FormationRepository;
import com.eduzen.management.repository.IndividuRepository;
import com.eduzen.management.repository.InscriptionRepository;
import com.eduzen.management.repository.NotificationRepository;
import com.eduzen.management.repository.PlanningRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
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
    private final IndividuRepository individuRepository;
    private final PlanningRepository planningRepository;

    public InscriptionController(InscriptionRepository inscriptionRepository,
            UserRepository userRepository,
            FormationRepository formationRepository,
            NotificationRepository notificationRepository,
            IndividuRepository individuRepository,
            PlanningRepository planningRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.userRepository = userRepository;
        this.formationRepository = formationRepository;
        this.notificationRepository = notificationRepository;
        this.individuRepository = individuRepository;
        this.planningRepository = planningRepository;
    }

    public static class RegistrationRequest {
        public String nom;
        public String prenom;
        public String email;
        public String telephone;
        public String ville;
        public String dateNaissance; // String to be parsed to LocalDate
    }

    @PostMapping("/formation/{formationId}")
    @PreAuthorize("hasAnyRole('INDIVIDU', 'ROLE_INDIVIDU')")
    public ResponseEntity<?> register(Authentication authentication,
            @PathVariable Long formationId,
            @RequestBody(required = false) RegistrationRequest request) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (inscriptionRepository.existsByUser_IdAndFormation_Id(user.getId(), formationId)) {
            return ResponseEntity.badRequest().body("Déjà inscrit à cette formation");
        }

        return formationRepository.findById(formationId).map(formation -> {
            // Find or update/create Individu record for this user
            Individu individu = individuRepository.findAll().stream()
                    .filter(i -> i.getEmail().equalsIgnoreCase(user.getEmail()))
                    .findFirst()
                    .orElseGet(() -> {
                        Individu newInd = new Individu();
                        newInd.setEmail(user.getEmail());
                        return newInd;
                    });

            // Update details from request if provided, otherwise from user profile
            if (request != null) {
                individu.setNom(request.nom != null ? request.nom : user.getLastName());
                individu.setPrenom(request.prenom != null ? request.prenom : user.getFirstName());
                individu.setEmail(request.email != null ? request.email : user.getEmail());
                individu.setTelephone(request.telephone != null ? request.telephone : user.getPhone());
                individu.setVille(request.ville != null ? request.ville : "");
                if (request.dateNaissance != null && !request.dateNaissance.isEmpty()) {
                    try {
                        individu.setDateNaissance(java.time.LocalDate.parse(request.dateNaissance));
                    } catch (Exception e) {
                        // Keep current if parse fails
                    }
                }
            } else {
                individu.setNom(user.getLastName());
                individu.setPrenom(user.getFirstName());
                individu.setTelephone(user.getPhone());
                individu.setVille("");
            }

            individu = individuRepository.save(individu);

            Inscription inscription = new Inscription();
            inscription.setUser(user);
            inscription.setFormation(formation);
            inscription.setIndividu(individu);
            inscription.setStatut("EN_ATTENTE");
            inscription.setDateInscription(LocalDateTime.now());

            inscriptionRepository.save(inscription);

            // Create notification for Admin/Assistant
            Notification notification = new Notification();
            notification.setMessage("Nouvelle inscription : " + individu.getPrenom() + " " + individu.getNom() +
                    " pour " + formation.getTitre());
            notification.setFormationId(formationId);
            notification.setType("INSCRIPTION");
            notificationRepository.save(notification);

            return ResponseEntity.ok(inscription);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('INDIVIDU', 'ROLE_INDIVIDU')")
    public List<Inscription> getMyInscriptions(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return inscriptionRepository.findByUser(user);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'FORMATEUR')")
    public List<Inscription> getAllInscriptions() {
        return inscriptionRepository.findAll();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return inscriptionRepository.findById(id).map(inscription -> {
            inscription.setStatut(status);
            inscriptionRepository.save(inscription);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut mis à jour");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/assign-planning")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    @Transactional
    public ResponseEntity<?> assignPlanning(@PathVariable Long id, @RequestParam Long planningId) {
        System.out.println("DEBUG: Assigning Planning " + planningId + " to Inscription " + id);
        try {
            Inscription inscription = inscriptionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Inscription non trouvée."));

            Planning planning = planningRepository.findById(planningId)
                    .orElseThrow(() -> new RuntimeException("Planning non trouvé."));

            inscription.setPlanification(planning);
            inscription.setStatut("CONFIRMEE");

            inscriptionRepository.save(inscription);
            System.out.println("DEBUG: Saved successfully!");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Affectation réussie");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("DEBUG: ERROR in assignPlanning: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @DeleteMapping("/formation/{formationId}")
    @PreAuthorize("hasAnyRole('INDIVIDU', 'ROLE_INDIVIDU')")
    public ResponseEntity<?> unregister(Authentication authentication, @PathVariable Long formationId) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return inscriptionRepository.findAll().stream()
                .filter(ins -> ins.getUser().getId().equals(user.getId())
                        && ins.getFormation().getId().equals(formationId))
                .findFirst()
                .map(inscription -> {
                    inscriptionRepository.delete(inscription);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalInscriptions = inscriptionRepository.count();
        stats.put("totalInscriptions", totalInscriptions);
        stats.put("totalIndividus", individuRepository.count());

        // Count by formation could be added here
        return ResponseEntity.ok(stats);
    }
}
