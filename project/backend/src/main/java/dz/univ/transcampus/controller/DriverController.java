package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
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

    @GetMapping("/trajets")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<TransportDtos.TrajetResponse>> getMyTrajets(Authentication auth) {
        return ResponseEntity.ok(transportService.getTrajetsByChauffeur(auth.getName()));
    }
}
