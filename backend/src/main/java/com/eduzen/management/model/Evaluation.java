package com.eduzen.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    private Formation formation;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "qualite_pedagogique")
    private Integer qualitePedagogique; // Note de 1 à 5

    private Integer rythme; // Note de 1 à 5

    @Column(name = "support_cours")
    private Integer supportCours; // Note de 1 à 5

    @Column(name = "maitrise_sujet")
    private Integer maitriseSujet; // Note de 1 à 5

    @Column(columnDefinition = "TEXT")
    private String commentaires;

    @Column(name = "date_evaluation")
    private LocalDateTime dateEvaluation = LocalDateTime.now();
}
