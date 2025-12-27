package com.eduzen.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "individus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Individu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    private String ville;

    @Column(unique = true, nullable = false)
    private String email;

    private String telephone;

    @ManyToOne
    @JoinColumn(name = "formation_id")
    private Formation formation;
}
