package com.eduzen.management.controller;

import com.eduzen.management.model.Entreprise;
import com.eduzen.management.repository.EntrepriseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises")
public class EntrepriseController {

    private final EntrepriseRepository entrepriseRepository;

    public EntrepriseController(EntrepriseRepository entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public Entreprise createEntreprise(@RequestBody Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Entreprise> updateEntreprise(@PathVariable Long id,
            @RequestBody Entreprise entrepriseDetails) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise not found with id: " + id));

        entreprise.setNom(entrepriseDetails.getNom());
        entreprise.setAdresse(entrepriseDetails.getAdresse());
        entreprise.setTelephone(entrepriseDetails.getTelephone());
        entreprise.setUrl(entrepriseDetails.getUrl());
        entreprise.setEmail(entrepriseDetails.getEmail());

        return ResponseEntity.ok(entrepriseRepository.save(entreprise));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Void> deleteEntreprise(@PathVariable Long id) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entreprise not found with id: " + id));

        entrepriseRepository.delete(entreprise);
        return ResponseEntity.ok().build();
    }
}
