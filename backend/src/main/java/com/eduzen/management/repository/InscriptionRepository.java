package com.eduzen.management.repository;

import com.eduzen.management.model.Inscription;
import com.eduzen.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByUser(User user);

    List<Inscription> findByFormation_Id(Long formationId);

    boolean existsByUser_IdAndFormation_Id(Long userId, Long formationId);

    long countByFormation_Id(Long formationId);
}
