package com.eduzen.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    private Formation formation;

    @ManyToOne
    @JoinColumn(name = "individu_id")
    private Individu individu;

    @ManyToOne(optional = true)
    @JoinColumn(name = "planification_id", nullable = true)
    private Planning planification;

    private String statut = "EN_ATTENTE"; // EN_ATTENTE, CONFIRMEE, ANNULEE

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription = LocalDateTime.now();
}
