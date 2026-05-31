package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.service.BadgeService;
import dz.univ.transcampus.util.PdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;
    private final PdfGenerator pdfGenerator;

    @GetMapping("/me")
    public ResponseEntity<TransportDtos.BadgeResponse> getMyBadge(Authentication auth) {
        return ResponseEntity.ok(badgeService.getBadgeByStudent(auth.getName()));
    }

    @GetMapping("/inscription/{inscriptionId}")
    public ResponseEntity<TransportDtos.BadgeResponse> getByInscription(@PathVariable String inscriptionId) {
        return ResponseEntity.ok(badgeService.getBadgeByInscription(inscriptionId));
    }

    @GetMapping("/{inscriptionId}/pdf")
    public ResponseEntity<byte[]> downloadBadgePdf(@PathVariable String inscriptionId) {
        TransportDtos.BadgeResponse badge = badgeService.getBadgeByInscription(inscriptionId);

        byte[] pdf = pdfGenerator.generateBadgePdf(
                badge.getEtudiantNom(),
                badge.getEtudiantPrenom(),
                badge.getLigneNom(),
                null,
                badge.getDateExpiration(),
                badge.getQrCodeImageBase64()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=badge.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/verify")
    public ResponseEntity<TransportDtos.BadgeVerificationResponse> verify(@RequestBody java.util.Map<String, String> body) {
        String qrCode = body.get("qrCode");
        return ResponseEntity.ok(badgeService.verifyBadge(qrCode));
    }
}
