package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.AuthDtos;
import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.exception.BusinessException;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.UtilisateurRepository;
import dz.univ.transcampus.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UtilisateurRepository utilisateurRepository;
    private final EntityMapper mapper;

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(@Valid @RequestBody AuthDtos.RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @GetMapping("/me")
    public ResponseEntity<TransportDtos.ProfileResponse> me(Authentication auth) {
        Utilisateur user = utilisateurRepository.findById(auth.getName())
                .orElseThrow(() -> BusinessException.notFound("Utilisateur non trouvé"));
        return ResponseEntity.ok(mapper.toProfileResponse(user));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(Authentication auth,
                                                              @Valid @RequestBody AuthDtos.ChangePasswordRequest req) {
        authService.changePassword(auth.getName(), req);
        return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès"));
    }

    @PostMapping("/create-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthDtos.AuthResponse> createUser(@Valid @RequestBody AuthDtos.CreateUserRequest req) {
        return ResponseEntity.ok(authService.createUser(req));
    }
}
