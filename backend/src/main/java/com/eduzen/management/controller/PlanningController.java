package com.eduzen.management.controller;

import com.eduzen.management.model.Planning;
import com.eduzen.management.repository.PlanningRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    private final PlanningRepository planningRepository;

    public PlanningController(PlanningRepository planningRepository) {
        this.planningRepository = planningRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT', 'FORMATEUR')")
    public List<Planning> getAllPlannings() {
        return planningRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public Planning createPlanning(@RequestBody Planning planning) {
        return planningRepository.save(planning);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Planning> updatePlanning(@PathVariable Long id, @RequestBody Planning planningDetails) {
        Planning planning = planningRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planning not found with id: " + id));

        planning.setFormation(planningDetails.getFormation());
        planning.setFormateur(planningDetails.getFormateur());
        planning.setEntreprise(planningDetails.getEntreprise());
        planning.setDateDebut(planningDetails.getDateDebut());
        planning.setDateFin(planningDetails.getDateFin());
        planning.setAllDay(planningDetails.isAllDay());

        return ResponseEntity.ok(planningRepository.save(planning));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASSISTANT')")
    public ResponseEntity<Void> deletePlanning(@PathVariable Long id) {
        Planning planning = planningRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planning not found with id: " + id));

        planningRepository.delete(planning);
        return ResponseEntity.ok().build();
    }
}
