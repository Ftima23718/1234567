package dz.univ.transcampus.service;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.entity.Badge;
import dz.univ.transcampus.entity.Inscription;
import dz.univ.transcampus.exception.BusinessException;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.BadgeRepository;
import dz.univ.transcampus.repository.InscriptionRepository;
import dz.univ.transcampus.util.QrCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final InscriptionRepository inscriptionRepository;
    private final EntityMapper mapper;
    private final QrCodeGenerator qrCodeGenerator;

    @Transactional
    public TransportDtos.BadgeResponse generateBadge(Inscription inscription) {
        badgeRepository.findByInscriptionId(inscription.getId())
                .ifPresent(b -> { throw BusinessException.conflict("Un badge existe déjà pour cette inscription"); });

        String qrContent = "TC-BADGE-" + inscription.getId() + "-" + UUID.randomUUID().toString().substring(0, 8);
        String qrBase64 = qrCodeGenerator.generateBase64(qrContent);

        Badge badge = Badge.builder()
                .inscription(inscription)
                .etudiant(inscription.getEtudiant())
                .codeQr(qrContent)
                .dateExpiration(inscription.getDateFin())
                .estValide(true)
                .build();

        badge = badgeRepository.save(badge);

        TransportDtos.BadgeResponse response = mapper.toBadgeResponse(badge);
        response.setQrCodeImageBase64(qrBase64);
        return response;
    }

    public TransportDtos.BadgeResponse getBadgeByInscription(String inscriptionId) {
        Badge badge = badgeRepository.findByInscriptionId(inscriptionId)
                .orElseThrow(() -> BusinessException.notFound("Badge non trouvé"));
        TransportDtos.BadgeResponse response = mapper.toBadgeResponse(badge);
        response.setQrCodeImageBase64(qrCodeGenerator.generateBase64(badge.getCodeQr()));
        return response;
    }

    public TransportDtos.BadgeResponse getBadgeByStudent(String studentId) {
        Badge badge = badgeRepository.findByEtudiantId(studentId)
                .orElseThrow(() -> BusinessException.notFound("Aucun badge trouvé"));
        TransportDtos.BadgeResponse response = mapper.toBadgeResponse(badge);
        response.setQrCodeImageBase64(qrCodeGenerator.generateBase64(badge.getCodeQr()));
        return response;
    }

    public TransportDtos.BadgeVerificationResponse verifyBadge(String qrCode) {
        Badge badge = badgeRepository.findByCodeQr(qrCode)
                .orElse(null);

        if (badge == null) {
            return TransportDtos.BadgeVerificationResponse.builder()
                    .valid(false)
                    .message("Badge non reconnu")
                    .build();
        }

        boolean valid = badge.isEffectivementValide();
        Inscription inscription = badge.getInscription();

        String ligneNom = inscription != null && inscription.getLigne() != null
                ? inscription.getLigne().getNom() : null;
        String typeAbonnement = inscription != null
                ? inscription.getTypeAbonnement().name() : null;

        return TransportDtos.BadgeVerificationResponse.builder()
                .valid(valid)
                .etudiantNom(badge.getEtudiant() != null ? badge.getEtudiant().getNom() : null)
                .etudiantPrenom(badge.getEtudiant() != null ? badge.getEtudiant().getPrenom() : null)
                .ligneNom(ligneNom)
                .dateExpiration(badge.getDateExpiration() != null ? badge.getDateExpiration().toString() : null)
                .typeAbonnement(typeAbonnement)
                .message(valid ? "Badge valide" : "Badge expiré ou invalide")
                .build();
    }
}
