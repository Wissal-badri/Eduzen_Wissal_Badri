package com.eduzen.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "formations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "nombre_heures")
    private Integer nombreHeures;

    @Column(name = "duree_en_heures")
    private Integer dureeEnHeures;

    private BigDecimal cout;

    @Column(columnDefinition = "TEXT")
    private String objectifs;

    @Column(name = "programme_detaille", columnDefinition = "TEXT")
    private String programmeDetaille;

    private String categorie;

    private String domaine; // Communication, Marketing, Design, DevOps, etc.

    private String ville;

    @ManyToOne
    @JoinColumn(name = "formateur_id")
    private Formateur formateur;

    @Column(name = "pour_individus")
    private Boolean pourIndividus = false;

    private String statut = "OUVERTE"; // OUVERTE ou FERMEE

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;
}
