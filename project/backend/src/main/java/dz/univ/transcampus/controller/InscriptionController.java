package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.InscriptionDtos;
import dz.univ.transcampus.service.InscriptionService;
import dz.univ.transcampus.util.ExcelExporter;
import dz.univ.transcampus.util.PdfGenerator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inscriptions")
@RequiredArgsConstructor
public class InscriptionController {

    private final InscriptionService inscriptionService;
    private final ExcelExporter excelExporter;
    private final PdfGenerator pdfGenerator;

    @PostMapping
    public ResponseEntity<InscriptionDtos.InscriptionResponse> create(
            Authentication auth, @Valid @RequestBody InscriptionDtos.InscriptionRequest req) {
        return ResponseEntity.ok(inscriptionService.create(auth.getName(), req));
    }

    @GetMapping("/me")
    public ResponseEntity<InscriptionDtos.InscriptionListResponse> getMyInscriptions(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(inscriptionService.getStudentInscriptions(auth.getName(), page, size));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<List<InscriptionDtos.InscriptionResponse>> getPending() {
        return ResponseEntity.ok(inscriptionService.getPendingInscriptions());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<InscriptionDtos.InscriptionListResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(inscriptionService.getAllInscriptions(page, size));
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<InscriptionDtos.InscriptionResponse> validate(@PathVariable String id) {
        return ResponseEntity.ok(inscriptionService.validate(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<InscriptionDtos.InscriptionResponse> reject(
            @PathVariable String id, @Valid @RequestBody InscriptionDtos.InscriptionUpdateRequest req) {
        return ResponseEntity.ok(inscriptionService.reject(id, req));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<InscriptionDtos.InscriptionResponse> renew(@PathVariable String id) {
        return ResponseEntity.ok(inscriptionService.renew(id));
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSIBLE')")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        InscriptionDtos.InscriptionListResponse inscriptions = inscriptionService.getAllInscriptions(page, size);

        String[] headers = {"ID", "Étudiant", "Email", "Ligne", "Type", "Statut", "Date Inscription"};
        List<String[]> rows = inscriptions.getContent().stream()
                .map(i -> new String[]{
                        i.getId(), i.getEtudiantNom() + " " + i.getEtudiantPrenom(),
                        i.getEtudiantEmail(), i.getLigneNom(), i.getTypeAbonnement(),
                        i.getStatut(), i.getDateInscription()
                }).toList();

        byte[] excel = excelExporter.export("Inscriptions", headers, rows);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=inscriptions.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}
