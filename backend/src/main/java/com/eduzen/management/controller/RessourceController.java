package com.eduzen.management.controller;

import com.eduzen.management.model.Formateur;
import com.eduzen.management.model.Formation;
import com.eduzen.management.model.Ressource;
import com.eduzen.management.model.User;
import com.eduzen.management.repository.FormateurRepository;
import com.eduzen.management.repository.FormationRepository;
import com.eduzen.management.repository.RessourceRepository;
import com.eduzen.management.repository.UserRepository;
import com.eduzen.management.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/ressources")
public class RessourceController {

    private final RessourceRepository ressourceRepository;
    private final FormationRepository formationRepository;
    private final FormateurRepository formateurRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public RessourceController(RessourceRepository ressourceRepository,
            FormationRepository formationRepository,
            FormateurRepository formateurRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService) {
        this.ressourceRepository = ressourceRepository;
        this.formationRepository = formationRepository;
        this.formateurRepository = formateurRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Get all resources for a specific formation (active only)
     */
    @GetMapping("/formation/{formationId}")
    public ResponseEntity<?> getResourcesByFormation(@PathVariable Long formationId) {
        List<Ressource> ressources = ressourceRepository.findByFormationIdOrderByDateCreationDesc(formationId);
        // Filter out archived resources for normal view
        List<Ressource> activeResources = ressources.stream()
                .filter(r -> r.getArchived() == null || !r.getArchived())
                .toList();
        return ResponseEntity.ok(activeResources.stream().map(this::toDto).toList());
    }

    /**
     * Get resources added by the current formateur (including archived)
     */
    @GetMapping("/mes-ressources")
    @PreAuthorize("hasRole('FORMATEUR')")
    public ResponseEntity<?> getMyResources(Authentication authentication,
            @RequestParam(required = false, defaultValue = "false") Boolean includeArchived) {
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
        if (formateurOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Formateur not found"));
        }

        List<Ressource> ressources = ressourceRepository.findByFormateurId(formateurOpt.get().getId());

        if (!includeArchived) {
            ressources = ressources.stream()
                    .filter(r -> r.getArchived() == null || !r.getArchived())
                    .toList();
        }

        return ResponseEntity.ok(ressources.stream().map(this::toDto).toList());
    }

    /**
     * Add a new resource with file upload
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('FORMATEUR', 'ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> addResourceWithFile(
            Authentication authentication,
            @RequestParam("formationId") Long formationId,
            @RequestParam("nom") String nom,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("type") String type,
            @RequestParam(value = "lienExterne", required = false) String lienExterne,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Optional<Formation> formationOpt = formationRepository.findById(formationId);
        if (formationOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Formation not found"));
        }

        Formation formation = formationOpt.get();

        // Get the formateur from the current user
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        Formateur formateur = null;
        if (userOpt.isPresent()) {
            Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
            formateur = formateurOpt.orElse(null);
        }

        // Validate that formateur can only add to their own formations
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        if (role.contains("FORMATEUR") && formateur != null) {
            if (formation.getFormateur() == null || !formation.getFormateur().getId().equals(formateur.getId())) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Vous ne pouvez ajouter des ressources qu'à vos propres formations"));
            }
        }

        Ressource ressource = new Ressource();
        ressource.setNom(nom);
        ressource.setDescription(description);
        ressource.setType(type != null ? type : "DOCUMENT");
        ressource.setLienExterne(lienExterne);
        ressource.setFormation(formation);
        ressource.setFormateur(formateur);
        ressource.setDateCreation(LocalDateTime.now());
        ressource.setNombreTelechargements(0);
        ressource.setArchived(false);

        // Handle file upload
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            ressource.setUrlFichier(fileName);
            ressource.setNomFichierOriginal(file.getOriginalFilename());
            ressource.setContentType(file.getContentType());
            ressource.setTailleFichier(file.getSize());
        }

        Ressource saved = ressourceRepository.save(ressource);
        return ResponseEntity.ok(toDto(saved));
    }

    /**
     * Add a new resource without file (JSON)
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('FORMATEUR', 'ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> addResource(Authentication authentication, @RequestBody Map<String, Object> payload) {
        Long formationId = Long.valueOf(payload.get("formationId").toString());
        String nom = (String) payload.get("nom");
        String description = (String) payload.get("description");
        String type = (String) payload.get("type");
        String urlFichier = (String) payload.get("urlFichier");
        String lienExterne = (String) payload.get("lienExterne");

        Optional<Formation> formationOpt = formationRepository.findById(formationId);
        if (formationOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Formation not found"));
        }

        Formation formation = formationOpt.get();

        // Get the formateur from the current user
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        Formateur formateur = null;
        if (userOpt.isPresent()) {
            Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
            formateur = formateurOpt.orElse(null);
        }

        // Validate that formateur can only add to their own formations
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        if (role.contains("FORMATEUR") && formateur != null) {
            if (formation.getFormateur() == null || !formation.getFormateur().getId().equals(formateur.getId())) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Vous ne pouvez ajouter des ressources qu'à vos propres formations"));
            }
        }

        Ressource ressource = new Ressource();
        ressource.setNom(nom);
        ressource.setDescription(description);
        ressource.setType(type != null ? type : "DOCUMENT");
        ressource.setUrlFichier(urlFichier);
        ressource.setLienExterne(lienExterne);
        ressource.setFormation(formation);
        ressource.setFormateur(formateur);
        ressource.setDateCreation(LocalDateTime.now());
        ressource.setNombreTelechargements(0);
        ressource.setArchived(false);

        Ressource saved = ressourceRepository.save(ressource);
        return ResponseEntity.ok(toDto(saved));
    }

    /**
     * Update a resource
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FORMATEUR', 'ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> updateResource(@PathVariable Long id,
            Authentication authentication,
            @RequestBody Map<String, Object> payload) {
        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();

        // Check ownership for formateurs
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        if (role.contains("FORMATEUR")) {
            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isPresent()) {
                Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
                if (formateurOpt.isPresent() && ressource.getFormateur() != null
                        && !ressource.getFormateur().getId().equals(formateurOpt.get().getId())) {
                    return ResponseEntity.status(403)
                            .body(Map.of("message", "Vous ne pouvez modifier que vos propres ressources"));
                }
            }
        }

        if (payload.containsKey("nom"))
            ressource.setNom((String) payload.get("nom"));
        if (payload.containsKey("description"))
            ressource.setDescription((String) payload.get("description"));
        if (payload.containsKey("type"))
            ressource.setType((String) payload.get("type"));
        if (payload.containsKey("urlFichier"))
            ressource.setUrlFichier((String) payload.get("urlFichier"));
        if (payload.containsKey("lienExterne"))
            ressource.setLienExterne((String) payload.get("lienExterne"));

        Ressource saved = ressourceRepository.save(ressource);
        return ResponseEntity.ok(toDto(saved));
    }

    /**
     * Update a resource with file
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('FORMATEUR', 'ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> updateResourceWithFile(
            @PathVariable Long id,
            Authentication authentication,
            @RequestParam("nom") String nom,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("type") String type,
            @RequestParam(value = "lienExterne", required = false) String lienExterne,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();

        // Check ownership for formateurs
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        if (role.contains("FORMATEUR")) {
            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isPresent()) {
                Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
                if (formateurOpt.isPresent() && ressource.getFormateur() != null
                        && !ressource.getFormateur().getId().equals(formateurOpt.get().getId())) {
                    return ResponseEntity.status(403)
                            .body(Map.of("message", "Vous ne pouvez modifier que vos propres ressources"));
                }
            }
        }

        ressource.setNom(nom);
        ressource.setDescription(description);
        ressource.setType(type);
        ressource.setLienExterne(lienExterne);

        // Handle new file upload
        if (file != null && !file.isEmpty()) {
            // Delete old file if exists
            if (ressource.getUrlFichier() != null) {
                fileStorageService.deleteFile(ressource.getUrlFichier());
            }

            String fileName = fileStorageService.storeFile(file);
            ressource.setUrlFichier(fileName);
            ressource.setNomFichierOriginal(file.getOriginalFilename());
            ressource.setContentType(file.getContentType());
            ressource.setTailleFichier(file.getSize());
        }

        Ressource saved = ressourceRepository.save(ressource);
        return ResponseEntity.ok(toDto(saved));
    }

    /**
     * Archive a resource
     */
    @PutMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('FORMATEUR', 'ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> archiveResource(@PathVariable Long id, Authentication authentication) {
        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();

        // Check ownership for formateurs
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        if (role.contains("FORMATEUR")) {
            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isPresent()) {
                Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
                if (formateurOpt.isPresent() && ressource.getFormateur() != null
                        && !ressource.getFormateur().getId().equals(formateurOpt.get().getId())) {
                    return ResponseEntity.status(403)
                            .body(Map.of("message", "Vous ne pouvez archiver que vos propres ressources"));
                }
            }
        }

        ressource.setArchived(true);
        Ressource saved = ressourceRepository.save(ressource);
        return ResponseEntity.ok(Map.of("message", "Ressource archivée avec succès", "resource", toDto(saved)));
    }

    /**
     * Unarchive a resource
     */
    @PutMapping("/{id}/unarchive")
    @PreAuthorize("hasAnyRole('FORMATEUR', 'ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> unarchiveResource(@PathVariable Long id, Authentication authentication) {
        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();

        // Check ownership for formateurs
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        if (role.contains("FORMATEUR")) {
            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isPresent()) {
                Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
                if (formateurOpt.isPresent() && ressource.getFormateur() != null
                        && !ressource.getFormateur().getId().equals(formateurOpt.get().getId())) {
                    return ResponseEntity.status(403)
                            .body(Map.of("message", "Vous ne pouvez désarchiver que vos propres ressources"));
                }
            }
        }

        ressource.setArchived(false);
        Ressource saved = ressourceRepository.save(ressource);
        return ResponseEntity.ok(Map.of("message", "Ressource désarchivée avec succès", "resource", toDto(saved)));
    }

    /**
     * Delete a resource
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FORMATEUR', 'ADMIN', 'ASSISTANT')")
    public ResponseEntity<?> deleteResource(@PathVariable Long id, Authentication authentication) {
        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();

        // Check ownership for formateurs
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        if (role.contains("FORMATEUR")) {
            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isPresent()) {
                Optional<Formateur> formateurOpt = formateurRepository.findByUserId(userOpt.get().getId());
                if (formateurOpt.isPresent() && ressource.getFormateur() != null
                        && !ressource.getFormateur().getId().equals(formateurOpt.get().getId())) {
                    return ResponseEntity.status(403)
                            .body(Map.of("message", "Vous ne pouvez supprimer que vos propres ressources"));
                }
            }
        }

        // Delete file if exists
        if (ressource.getUrlFichier() != null) {
            try {
                fileStorageService.deleteFile(ressource.getUrlFichier());
            } catch (Exception e) {
                // Log but continue with deletion
                System.err.println("Could not delete file: " + ressource.getUrlFichier());
            }
        }

        ressourceRepository.delete(ressource);
        return ResponseEntity.ok(Map.of("message", "Ressource supprimée avec succès"));
    }

    /**
     * Download a file
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadFile(@PathVariable Long id, HttpServletRequest request) {
        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();

        if (ressource.getUrlFichier() == null) {
            return ResponseEntity.status(400).body(Map.of("message", "Cette ressource n'a pas de fichier attaché"));
        }

        // Increment download count
        ressource.setNombreTelechargements(ressource.getNombreTelechargements() + 1);
        ressourceRepository.save(ressource);

        try {
            Resource resource = fileStorageService.loadFileAsResource(ressource.getUrlFichier());

            // Try to determine file's content type
            String contentType = ressource.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String fileName = ressource.getNomFichierOriginal() != null
                    ? ressource.getNomFichierOriginal()
                    : ressource.getUrlFichier();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Erreur lors du téléchargement: " + e.getMessage()));
        }
    }

    /**
     * View a file (inline)
     */
    @GetMapping("/{id}/view")
    public ResponseEntity<?> viewFile(@PathVariable Long id) {
        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();

        if (ressource.getUrlFichier() == null) {
            return ResponseEntity.status(400).body(Map.of("message", "Cette ressource n'a pas de fichier attaché"));
        }

        try {
            Resource resource = fileStorageService.loadFileAsResource(ressource.getUrlFichier());

            String contentType = ressource.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de l'affichage: " + e.getMessage()));
        }
    }

    /**
     * Increment download count (for external links)
     */
    @PostMapping("/{id}/download")
    public ResponseEntity<?> incrementDownload(@PathVariable Long id) {
        Optional<Ressource> ressourceOpt = ressourceRepository.findById(id);
        if (ressourceOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ressource not found"));
        }

        Ressource ressource = ressourceOpt.get();
        ressource.setNombreTelechargements(ressource.getNombreTelechargements() + 1);
        ressourceRepository.save(ressource);

        return ResponseEntity.ok(Map.of("downloads", ressource.getNombreTelechargements()));
    }

    private Map<String, Object> toDto(Ressource r) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", r.getId());
        dto.put("nom", r.getNom());
        dto.put("description", r.getDescription());
        dto.put("type", r.getType());
        dto.put("urlFichier", r.getUrlFichier());
        dto.put("lienExterne", r.getLienExterne());
        dto.put("dateCreation", r.getDateCreation());
        dto.put("nombreTelechargements", r.getNombreTelechargements());
        dto.put("tailleFichier", r.getTailleFichier());
        dto.put("nomFichierOriginal", r.getNomFichierOriginal());
        dto.put("contentType", r.getContentType());
        dto.put("archived", r.getArchived());
        dto.put("hasFile", r.getUrlFichier() != null);

        if (r.getFormation() != null) {
            dto.put("formationId", r.getFormation().getId());
            dto.put("formationTitre", r.getFormation().getTitre());
        }

        if (r.getFormateur() != null && r.getFormateur().getUser() != null) {
            dto.put("formateurId", r.getFormateur().getId());
            dto.put("formateurNom", r.getFormateur().getUser().getUsername());
        }

        return dto;
    }
}
