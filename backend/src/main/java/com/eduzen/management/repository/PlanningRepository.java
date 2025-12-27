package com.eduzen.management.repository;

import com.eduzen.management.model.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {
    List<Planning> findByFormateurId(Long formateurId);

    List<Planning> findByEntrepriseId(Long entrepriseId);

    List<Planning> findByFormationId(Long formationId);
}
