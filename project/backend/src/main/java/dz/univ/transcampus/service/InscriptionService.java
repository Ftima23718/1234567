package dz.univ.transcampus.service;

import dz.univ.transcampus.dto.InscriptionDtos;
import dz.univ.transcampus.entity.*;
import dz.univ.transcampus.exception.BusinessException;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final LigneRepository ligneRepository;
    private final ArretRepository arretRepository;
    private final PaiementRepository paiementRepository;
    private final BadgeRepository badgeRepository;
    private final EntityMapper mapper;
    private final NotificationService notificationService;
    private final BadgeService badgeService;

    @Transactional
    public InscriptionDtos.InscriptionResponse create(String studentId, InscriptionDtos.InscriptionRequest req) {
        Utilisateur student = utilisateurRepository.findById(studentId)
                .orElseThrow(() -> BusinessException.notFound("Étudiant non trouvé"));

        Ligne ligne = ligneRepository.findById(req.getLigneId())
                .orElseThrow(() -> BusinessException.notFound("Ligne non trouvée"));

        Arret arret = arretRepository.findById(req.getArretId())
                .orElseThrow(() -> BusinessException.notFound("Arrêt non trouvé"));

        Inscription.TypeAbonnement typeAbonnement = Inscription.TypeAbonnement.valueOf(req.getTypeAbonnement());

        LocalDate dateDebut = LocalDate.now();
        LocalDate dateFin = calculateEndDate(dateDebut, typeAbonnement);

        Inscription inscription = Inscription.builder()
                .etudiant(student)
                .ligne(ligne)
                .arret(arret)
                .typeAbonnement(typeAbonnement)
                .statut(Inscription.StatutInscription.EN_ATTENTE)
                .dateDebut(dateDebut)
                .dateFin(dateFin)
                .build();

        inscription = inscriptionRepository.save(inscription);

        notificationService.send(studentId, NotificationService.Type.info,
                "Votre inscription à la ligne " + ligne.getNom() + " a été soumise et est en attente de validation.");

        return mapper.toInscriptionResponse(inscription);
    }

    @Transactional(readOnly = true)
    public InscriptionDtos.InscriptionListResponse getStudentInscriptions(String studentId, int page, int size) {
        Page<Inscription> pageResult = inscriptionRepository.findByEtudiantId(
                studentId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateInscription")));

        // Force initialization of lazy relationships while session is active
        List<InscriptionDtos.InscriptionResponse> content = pageResult.getContent()
                .stream()
                .peek(i -> {
                    // Trigger lazy loading while session is open
                    if (i.getEtudiant() != null) {
                        i.getEtudiant().getId();
                    }
                    if (i.getLigne() != null) {
                        i.getLigne().getId();
                    }
                    if (i.getArret() != null) {
                        i.getArret().getId();
                    }
                })
                .map(mapper::toInscriptionResponse).toList();

        return InscriptionDtos.InscriptionListResponse.builder()
                .content(content)
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public List<InscriptionDtos.InscriptionResponse> getPendingInscriptions() {
        return inscriptionRepository.findByStatut(Inscription.StatutInscription.EN_ATTENTE)
                .stream()
                .peek(i -> {
                    if (i.getEtudiant() != null) i.getEtudiant().getId();
                    if (i.getLigne() != null) i.getLigne().getId();
                    if (i.getArret() != null) i.getArret().getId();
                })
                .map(mapper::toInscriptionResponse).toList();
    }

    @Transactional(readOnly = true)
    public InscriptionDtos.InscriptionListResponse getAllInscriptions(int page, int size) {
        Page<Inscription> pageResult = inscriptionRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateInscription")));

        List<InscriptionDtos.InscriptionResponse> content = pageResult.getContent()
                .stream()
                .peek(i -> {
                    if (i.getEtudiant() != null) i.getEtudiant().getId();
                    if (i.getLigne() != null) i.getLigne().getId();
                    if (i.getArret() != null) i.getArret().getId();
                })
                .map(mapper::toInscriptionResponse).toList();

        return InscriptionDtos.InscriptionListResponse.builder()
                .content(content)
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Transactional
    public InscriptionDtos.InscriptionResponse validate(String inscriptionId) {
        Inscription inscription = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> BusinessException.notFound("Inscription non trouvée"));

        if (inscription.getStatut() != Inscription.StatutInscription.EN_ATTENTE) {
            throw BusinessException.conflict("Seule une inscription en attente peut être validée");
        }

        inscription.setStatut(Inscription.StatutInscription.VALIDEE);
        inscription = inscriptionRepository.save(inscription);

        badgeService.generateBadge(inscription);

        notificationService.send(inscription.getEtudiant().getId(), NotificationService.Type.success,
                "Votre inscription à la ligne " + inscription.getLigne().getNom() + " a été validée ! Votre badge est prêt.");

        return mapper.toInscriptionResponse(inscription);
    }

    @Transactional
    public InscriptionDtos.InscriptionResponse reject(String inscriptionId, InscriptionDtos.InscriptionUpdateRequest req) {
        Inscription inscription = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> BusinessException.notFound("Inscription non trouvée"));

        if (inscription.getStatut() != Inscription.StatutInscription.EN_ATTENTE) {
            throw BusinessException.conflict("Seule une inscription en attente peut être rejetée");
        }

        inscription.setStatut(Inscription.StatutInscription.REJETEE);
        inscription.setMotifRejet(req.getMotifRejet());
        inscription = inscriptionRepository.save(inscription);

        notificationService.send(inscription.getEtudiant().getId(), NotificationService.Type.error,
                "Votre inscription a été rejetée. Motif : " + req.getMotifRejet());

        return mapper.toInscriptionResponse(inscription);
    }

    @Transactional
    public InscriptionDtos.InscriptionResponse renew(String inscriptionId) {
        Inscription old = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> BusinessException.notFound("Inscription non trouvée"));

        if (old.getStatut() != Inscription.StatutInscription.VALIDEE && old.getStatut() != Inscription.StatutInscription.EXPIREE) {
            throw BusinessException.conflict("Seule une inscription validée ou expirée peut être renouvelée");
        }

        Inscription renewed = Inscription.builder()
                .etudiant(old.getEtudiant())
                .ligne(old.getLigne())
                .arret(old.getArret())
                .typeAbonnement(old.getTypeAbonnement())
                .statut(Inscription.StatutInscription.EN_ATTENTE)
                .dateDebut(LocalDate.now())
                .dateFin(calculateEndDate(LocalDate.now(), old.getTypeAbonnement()))
                .build();

        renewed = inscriptionRepository.save(renewed);

        notificationService.send(old.getEtudiant().getId(), NotificationService.Type.info,
                "Votre demande de renouvellement pour la ligne " + old.getLigne().getNom() + " a été soumise.");

        return mapper.toInscriptionResponse(renewed);
    }

    private LocalDate calculateEndDate(LocalDate debut, Inscription.TypeAbonnement type) {
        return switch (type) {
            case MENSUEL -> debut.plusMonths(1);
            case SEMESTRIEL -> debut.plusMonths(6);
            case ANNUEL -> debut.plusYears(1);
        };
    }
}
