package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.entity.Chauffeur;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.repository.UtilisateurRepository;
import dz.univ.transcampus.service.TransportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/driver")
@RequiredArgsConstructor
public class DriverController {

    private final TransportService transportService;
    private final UtilisateurRepository utilisateurRepository;

    @GetMapping("/trajets")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<TransportDtos.TrajetResponse>> getMyTrajets(Authentication auth) {
        // auth.getName() = userId (UUID) — pas email!
        // auth.getCredentials() = email
        String userId = auth.getName(); // c'est le UUID du user

        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Chauffeur chauffeur = user.getChauffeur();
        if (chauffeur == null) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(transportService.getTrajetsByChauffeur(chauffeur.getId()));
    }
}