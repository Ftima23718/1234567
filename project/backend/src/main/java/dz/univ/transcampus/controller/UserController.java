package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UtilisateurRepository utilisateurRepository;
    private final EntityMapper mapper;

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<List<TransportDtos.ProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(utilisateurRepository.findAll().stream()
                .map(mapper::toProfileResponse)
                .toList());
    }

    @GetMapping({"/drivers", "/chauffeurs"})
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<List<TransportDtos.ProfileResponse>> getAllDrivers() {
        return ResponseEntity.ok(utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.DRIVER)
                .map(mapper::toProfileResponse)
                .toList());
    }

    @PostMapping("/users/photo")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE','STUDENT','DRIVER')")
    public ResponseEntity<Map<String, String>> uploadPhoto(
            Authentication auth,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Convert file to Base64
            String base64Photo = Base64.getEncoder().encodeToString(file.getBytes());
            String photoDataUrl = "data:" + file.getContentType() + ";base64," + base64Photo;

            // Save to database
            user.setPhotoURL(photoDataUrl);
            utilisateurRepository.saveAndFlush(user);

            Map<String, String> response = new HashMap<>();
            response.put("photoURL", photoDataUrl);
            response.put("message", "Photo uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload photo: " + e.getMessage()));
        }
    }
}
