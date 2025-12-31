package com.eduzen.management.repository;

import com.eduzen.management.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormateurRepository extends JpaRepository<Formateur, Long> {
    Optional<Formateur> findByUserId(Long userId);
}
