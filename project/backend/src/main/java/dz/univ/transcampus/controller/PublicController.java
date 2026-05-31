package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.service.TransportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicController {

    private final TransportService transportService;

    @GetMapping("/lignes")
    public ResponseEntity<List<TransportDtos.LigneResponse>> getActiveLignes() {
        return ResponseEntity.ok(transportService.getActiveLignes());
    }

    @GetMapping("/lignes/{ligneId}/arrets")
    public ResponseEntity<List<TransportDtos.ArretResponse>> getArretsByLigne(@PathVariable String ligneId) {
        return ResponseEntity.ok(transportService.getArretsByLigne(ligneId));
    }
}
