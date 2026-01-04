package com.eduzen.management.controller;

import com.eduzen.management.model.Individu;
import com.eduzen.management.repository.IndividuRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/individus")
public class IndividuController {

    private final IndividuRepository individuRepository;

    public IndividuController(IndividuRepository individuRepository) {
        this.individuRepository = individuRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public List<Individu> getAllIndividus() {
        return individuRepository.findAll();
    }

    @PostMapping("/register")
    public Individu registerIndividu(@RequestBody Individu individu) {
        return individuRepository.save(individu);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Void> deleteIndividu(@PathVariable Long id) {
        individuRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/public/count")
    public long getPublicIndividuCount() {
        return individuRepository.count();
    }
}
