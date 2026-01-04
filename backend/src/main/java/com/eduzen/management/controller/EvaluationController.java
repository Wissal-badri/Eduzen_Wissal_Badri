package com.eduzen.management.controller;

import com.eduzen.management.model.Evaluation;
import com.eduzen.management.model.Formation;
import com.eduzen.management.model.User;
import com.eduzen.management.repository.EvaluationRepository;
import com.eduzen.management.repository.FormationRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    private final EvaluationRepository evaluationRepository;
    private final FormationRepository formationRepository;
    private final UserRepository userRepository;

    public EvaluationController(EvaluationRepository evaluationRepository,
            FormationRepository formationRepository,
            UserRepository userRepository) {
        this.evaluationRepository = evaluationRepository;
        this.formationRepository = formationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/formation/{formationId}")
    public ResponseEntity<?> submitEvaluation(
            @PathVariable Long formationId,
            Authentication authentication,
            @RequestBody Map<String, Object> payload) {

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
        }

        Optional<Formation> formationOpt = formationRepository.findById(formationId);
        if (formationOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Formation non trouvée"));
        }

        Evaluation evaluation = new Evaluation();
        evaluation.setUser(userOpt.get());
        evaluation.setFormation(formationOpt.get());

        // Use a safe way to convert numbers from JSON Map
        evaluation.setQualitePedagogique(parseSafeInt(payload.get("qualitePedagogique")));
        evaluation.setRythme(parseSafeInt(payload.get("rythme")));
        evaluation.setSupportCours(parseSafeInt(payload.get("supportCours")));
        evaluation.setMaitriseSujet(parseSafeInt(payload.get("maitriseSujet")));

        evaluation.setCommentaires((String) payload.get("commentaires"));
        evaluation.setDateEvaluation(LocalDateTime.now());

        Evaluation saved = evaluationRepository.save(evaluation);
        return ResponseEntity.ok(saved);
    }

    private Integer parseSafeInt(Object obj) {
        if (obj == null)
            return 0;
        if (obj instanceof Integer)
            return (Integer) obj;
        if (obj instanceof Number)
            return ((Number) obj).intValue();
        try {
            return Integer.parseInt(obj.toString());
        } catch (Exception e) {
            return 0;
        }
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<Evaluation>> getByFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(evaluationRepository.findByFormationId(formationId));
    }
}
