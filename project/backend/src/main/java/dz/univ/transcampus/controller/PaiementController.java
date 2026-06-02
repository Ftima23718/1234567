package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.PaiementDtos;
import dz.univ.transcampus.service.PaiementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<PaiementDtos.PaiementResponse> record(@Valid @RequestBody PaiementDtos.PaiementRequest req) {
        return ResponseEntity.ok(paiementService.recordPayment(req));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<List<PaiementDtos.PaiementResponse>> getAllPaiements() {
        return ResponseEntity.ok(paiementService.getAllPaiements());
    }

    @GetMapping("/me")
    public ResponseEntity<List<PaiementDtos.PaiementResponse>> getMyPayments(Authentication auth) {
        return ResponseEntity.ok(paiementService.getStudentPayments(auth.getName()));
    }

    @GetMapping("/inscription/{inscriptionId}")
    public ResponseEntity<PaiementDtos.PaiementResponse> getByInscription(@PathVariable String inscriptionId) {
        return ResponseEntity.ok(paiementService.getByInscription(inscriptionId));
    }
}
