package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.service.AuthService;
import dz.univ.transcampus.service.TransportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TransportController {

    private final TransportService transportService;
    private final AuthService authService;

    // === LIGNES ===

    @GetMapping("/lignes")
    public ResponseEntity<List<TransportDtos.LigneResponse>> getLignes(
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<TransportDtos.LigneResponse> lignes = activeOnly
                ? transportService.getActiveLignes()
                : transportService.getAllLignes();
        return ResponseEntity.ok(lignes);
    }

    @GetMapping("/lignes/{id}")
    public ResponseEntity<TransportDtos.LigneResponse> getLigne(@PathVariable String id) {
        return ResponseEntity.ok(transportService.getLigneById(id));
    }

    @PostMapping("/admin/lignes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransportDtos.LigneResponse> createLigne(@Valid @RequestBody TransportDtos.LigneRequest req) {
        return ResponseEntity.ok(transportService.createLigne(req));
    }

    @PutMapping("/admin/lignes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransportDtos.LigneResponse> updateLigne(
            @PathVariable String id, @Valid @RequestBody TransportDtos.LigneRequest req) {
        return ResponseEntity.ok(transportService.updateLigne(id, req));
    }

    @DeleteMapping("/admin/lignes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLigne(@PathVariable String id) {
        transportService.deleteLigne(id);
        return ResponseEntity.noContent().build();
    }

    // === ARRETS ===

    @GetMapping("/lignes/{ligneId}/arrets")
    public ResponseEntity<List<TransportDtos.ArretResponse>> getArrets(@PathVariable String ligneId) {
        return ResponseEntity.ok(transportService.getArretsByLigne(ligneId));
    }

    @PostMapping("/admin/arrets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransportDtos.ArretResponse> createArret(@Valid @RequestBody TransportDtos.ArretRequest req) {
        return ResponseEntity.ok(transportService.createArret(req));
    }

    @DeleteMapping("/admin/arrets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArret(@PathVariable String id) {
        transportService.deleteArret(id);
        return ResponseEntity.noContent().build();
    }

    // === BUS ===

    @GetMapping("/bus")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<List<TransportDtos.BusResponse>> getAllBus() {
        return ResponseEntity.ok(transportService.getAllBus());
    }

    @GetMapping("/lignes/{ligneId}/bus")
    public ResponseEntity<List<TransportDtos.BusResponse>> getBusByLigne(@PathVariable String ligneId) {
        return ResponseEntity.ok(transportService.getBusByLigne(ligneId));
    }

    @PostMapping("/admin/bus")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransportDtos.BusResponse> createBus(@Valid @RequestBody TransportDtos.BusRequest req) {
        return ResponseEntity.ok(transportService.createBus(req));
    }

    @PatchMapping("/driver/bus/{busId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','DRIVER')")
    public ResponseEntity<TransportDtos.BusResponse> updateBusStatus(
            @PathVariable String busId, @Valid @RequestBody TransportDtos.BusStatusRequest req) {
        return ResponseEntity.ok(transportService.updateBusStatus(busId, req));
    }

    // === TRAJETS ===

    @GetMapping("/lignes/{ligneId}/trajets")
    public ResponseEntity<List<TransportDtos.TrajetResponse>> getTrajets(@PathVariable String ligneId) {
        return ResponseEntity.ok(transportService.getTrajetsByLigne(ligneId));
    }

    @PostMapping("/admin/trajets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransportDtos.TrajetResponse> createTrajet(@Valid @RequestBody TransportDtos.TrajetRequest req) {
        return ResponseEntity.ok(transportService.createTrajet(req));
    }

    // === CHAUFFEURS ===

    @PostMapping("/auth/chauffeur")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<dz.univ.transcampus.dto.AuthDtos.AuthResponse> registerChauffeur(
            @Valid @RequestBody TransportDtos.ChauffeurRequest req) {
        return ResponseEntity.ok(authService.registerChauffeur(req));
    }

    @GetMapping("/chauffeurs")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<List<TransportDtos.ChauffeurResponse>> getAllChauffeurs() {
        return ResponseEntity.ok(transportService.getAllChauffeurs());
    }
}
