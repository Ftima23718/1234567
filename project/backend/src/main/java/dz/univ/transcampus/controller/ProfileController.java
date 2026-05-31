package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.UtilisateurRepository;
import dz.univ.transcampus.exception.BusinessException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UtilisateurRepository utilisateurRepository;
    private final EntityMapper mapper;

    @GetMapping
    public ResponseEntity<TransportDtos.ProfileResponse> getProfile(Authentication auth) {
        Utilisateur user = utilisateurRepository.findById(auth.getName())
                .orElseThrow(() -> BusinessException.notFound("Utilisateur non trouvé"));
        return ResponseEntity.ok(mapper.toProfileResponse(user));
    }

    @PutMapping
    public ResponseEntity<TransportDtos.ProfileResponse> updateProfile(
            Authentication auth, @Valid @RequestBody TransportDtos.ProfileUpdateRequest req) {
        Utilisateur user = utilisateurRepository.findById(auth.getName())
                .orElseThrow(() -> BusinessException.notFound("Utilisateur non trouvé"));

        if (req.getNom() != null) user.setNom(req.getNom());
        if (req.getPrenom() != null) user.setPrenom(req.getPrenom());
        if (req.getTelephone() != null) user.setTelephone(req.getTelephone());

        user = utilisateurRepository.save(user);
        return ResponseEntity.ok(mapper.toProfileResponse(user));
    }
}
