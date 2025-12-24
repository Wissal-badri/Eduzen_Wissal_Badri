package com.eduzen.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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

    @Column(name = "nombre_heures")
    private Integer nombreHeures;

    private BigDecimal cout;

    @Column(columnDefinition = "TEXT")
    private String objectifs;

    @Column(name = "programme_detaille", columnDefinition = "TEXT")
    private String programmeDetaille;

    private String categorie;

    private String ville;
}
