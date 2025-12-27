package com.eduzen.management.controller;

import com.eduzen.management.model.Formation;
import com.eduzen.management.repository.FormationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class FormationController {

    private final FormationRepository formationRepository;

    public FormationController(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    @GetMapping
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Formation> createFormation(@RequestBody Formation formation) {
        return ResponseEntity.ok(formationRepository.save(formation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return formationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Formation> updateFormation(@PathVariable Long id, @RequestBody Formation formationDetails) {
        return formationRepository.findById(id).map(formation -> {
            formation.setTitre(formationDetails.getTitre());
            formation.setNombreHeures(formationDetails.getNombreHeures());
            formation.setCout(formationDetails.getCout());
            formation.setObjectifs(formationDetails.getObjectifs());
            formation.setProgrammeDetaille(formationDetails.getProgrammeDetaille());
            formation.setCategorie(formationDetails.getCategorie());
            formation.setVille(formationDetails.getVille());
            formation.setFormateur(formationDetails.getFormateur());
            formation.setPourIndividus(formationDetails.getPourIndividus());
            return ResponseEntity.ok(formationRepository.save(formation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        return formationRepository.findById(id).map(formation -> {
            formationRepository.delete(formation);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
