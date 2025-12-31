package com.eduzen.management.repository;

import com.eduzen.management.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByFormationId(Long formationId);

    List<Evaluation> findByUserId(Long userId);
}
