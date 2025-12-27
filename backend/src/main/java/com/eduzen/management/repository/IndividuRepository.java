package com.eduzen.management.repository;

import com.eduzen.management.model.Individu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndividuRepository extends JpaRepository<Individu, Long> {
    List<Individu> findByFormation_Id(Long formationId);
}
