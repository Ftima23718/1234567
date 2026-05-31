package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StudentController {

    private final UtilisateurRepository utilisateurRepository;
    private final EntityMapper mapper;

    @GetMapping({"/students", "/etudiants"})
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<List<TransportDtos.ProfileResponse>> getAllStudents() {
        return ResponseEntity.ok(utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.STUDENT)
                .map(mapper::toProfileResponse)
                .toList());
    }
}
