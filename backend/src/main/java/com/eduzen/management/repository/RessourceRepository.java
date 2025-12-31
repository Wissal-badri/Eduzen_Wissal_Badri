package com.eduzen.management.repository;

import com.eduzen.management.model.Ressource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RessourceRepository extends JpaRepository<Ressource, Long> {
    List<Ressource> findByFormationId(Long formationId);

    List<Ressource> findByFormateurId(Long formateurId);

    List<Ressource> findByFormationIdOrderByDateCreationDesc(Long formationId);
}
