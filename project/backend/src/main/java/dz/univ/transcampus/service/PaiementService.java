package dz.univ.transcampus.service;

import dz.univ.transcampus.dto.PaiementDtos;
import dz.univ.transcampus.entity.Inscription;
import dz.univ.transcampus.entity.Paiement;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.exception.BusinessException;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.InscriptionRepository;
import dz.univ.transcampus.repository.PaiementRepository;
import dz.univ.transcampus.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final InscriptionRepository inscriptionRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EntityMapper mapper;
    private final NotificationService notificationService;

    @Transactional
    public PaiementDtos.PaiementResponse recordPayment(PaiementDtos.PaiementRequest req) {
        Inscription inscription = inscriptionRepository.findById(req.getInscriptionId())
                .orElseThrow(() -> BusinessException.notFound("Inscription non trouvée"));

        paiementRepository.findByInscriptionId(req.getInscriptionId())
                .ifPresent(p -> { throw BusinessException.conflict("Un paiement existe déjà pour cette inscription"); });

        Utilisateur student = inscription.getEtudiant();

        Paiement paiement = Paiement.builder()
                .inscription(inscription)
                .etudiant(student)
                .montant(req.getMontant())
                .modePaiement(Paiement.ModePaiement.valueOf(req.getModePaiement()))
                .statut(Paiement.StatutPaiement.PAYE)
                .referenceTransaction(req.getReferenceTransaction() != null
                        ? req.getReferenceTransaction()
                        : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        paiement = paiementRepository.save(paiement);

        notificationService.send(student.getId(), NotificationService.Type.success,
                "Paiement de " + req.getMontant() + " DA enregistré avec succès.");

        return mapper.toPaiementResponse(paiement);
    }

    public List<PaiementDtos.PaiementResponse> getStudentPayments(String studentId) {
        return paiementRepository.findByEtudiantId(studentId)
                .stream().map(mapper::toPaiementResponse).toList();
    }

    public PaiementDtos.PaiementResponse getByInscription(String inscriptionId) {
        Paiement paiement = paiementRepository.findByInscriptionId(inscriptionId)
                .orElseThrow(() -> BusinessException.notFound("Aucun paiement trouvé pour cette inscription"));
        return mapper.toPaiementResponse(paiement);
    }
}
