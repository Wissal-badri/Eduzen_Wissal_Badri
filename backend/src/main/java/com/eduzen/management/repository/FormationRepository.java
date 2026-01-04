package com.eduzen.management.repository;

import com.eduzen.management.model.Formation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByFormateurId(Long formateurId);
}
