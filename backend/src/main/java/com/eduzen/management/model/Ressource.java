package com.eduzen.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ressources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ressource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String type; // PDF, VIDEO, LIEN, DOCUMENT, IMAGE

    @Column(name = "url_fichier")
    private String urlFichier; // URL ou chemin du fichier

    @Column(name = "lien_externe")
    private String lienExterne; // Lien YouTube, Google Drive, etc.

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    private Formation formation;

    @ManyToOne
    @JoinColumn(name = "formateur_id")
    private Formateur formateur; // Le formateur qui a ajouté la ressource

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "taille_fichier")
    private Long tailleFichier; // En bytes

    @Column(name = "nombre_telechargements")
    private Integer nombreTelechargements = 0;

    @Column(name = "nom_fichier_original")
    private String nomFichierOriginal; // Nom original du fichier uploadé

    @Column(name = "content_type")
    private String contentType; // Type MIME du fichier

    @Column(name = "archived")
    private Boolean archived = false; // Si la ressource est archivée
}
