package dz.univ.transcampus.mapper;

import dz.univ.transcampus.dto.*;
import dz.univ.transcampus.entity.*;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // === UTILISATEUR / PROFILE ===

    public TransportDtos.ProfileResponse toProfileResponse(Utilisateur u) {
        TransportDtos.ProfileResponse.ProfileResponseBuilder builder = TransportDtos.ProfileResponse.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .email(u.getEmail())
                .telephone(u.getTelephone())
                .role(u.getRole().name())
                .dateCreation(u.getDateCreation() != null ? u.getDateCreation().toString() : null);

        if (u.getEtudiant() != null) {
            builder.numeroEtudiant(u.getEtudiant().getNumeroEtudiant())
                    .filiere(u.getEtudiant().getFiliere())
                    .anneeEtude(u.getEtudiant().getAnneeEtude());
        }
        if (u.getChauffeur() != null) {
            builder.numeroPermis(u.getChauffeur().getNumeroPermis());
        }

        return builder.build();
    }

    // === LIGNE ===

    public Ligne toLigne(TransportDtos.LigneRequest req) {
        return Ligne.builder()
                .nom(req.getNom())
                .description(req.getDescription())
                .pointDepart(req.getPointDepart())
                .pointArrivee(req.getPointArrivee())
                .estActive(req.getEstActive() != null ? req.getEstActive() : true)
                .build();
    }

    public TransportDtos.LigneResponse toLigneResponse(Ligne l) {
        return TransportDtos.LigneResponse.builder()
                .id(l.getId())
                .nom(l.getNom())
                .description(l.getDescription())
                .pointDepart(l.getPointDepart())
                .pointArrivee(l.getPointArrivee())
                .estActive(l.getEstActive())
                .arretsCount(l.getArretsCount())
                .busCount(l.getBusCount())
                .build();
    }

    // === ARRET ===

    public Arret toArret(TransportDtos.ArretRequest req) {
        return Arret.builder()
                .nom(req.getNom())
                .adresse(req.getAdresse())
                .ordre(req.getOrdre())
                .build();
    }

    public TransportDtos.ArretResponse toArretResponse(Arret a) {
        return TransportDtos.ArretResponse.builder()
                .id(a.getId())
                .nom(a.getNom())
                .adresse(a.getAdresse())
                .ordre(a.getOrdre())
                .ligneId(a.getLigne() != null ? a.getLigne().getId() : null)
                .ligneNom(a.getLigne() != null ? a.getLigne().getNom() : null)
                .build();
    }

    // === BUS ===

    public Bus toBus(TransportDtos.BusRequest req) {
        return Bus.builder()
                .immatriculation(req.getImmatriculation())
                .marque(req.getMarque())
                .modele(req.getModele())
                .capacite(req.getCapacite())
                .placesDisponibles(req.getCapacite())
                .build();
    }

    public TransportDtos.BusResponse toBusResponse(Bus b) {
        return TransportDtos.BusResponse.builder()
                .id(b.getId())
                .immatriculation(b.getImmatriculation())
                .marque(b.getMarque())
                .modele(b.getModele())
                .capacite(b.getCapacite())
                .placesDisponibles(b.getPlacesDisponibles())
                .statut(b.getStatut().name())
                .tauxOccupation(b.getTauxOccupation())
                .ligneId(b.getLigne() != null ? b.getLigne().getId() : null)
                .ligneNom(b.getLigne() != null ? b.getLigne().getNom() : null)
                .build();
    }

    // === TRAJET ===

    public TransportDtos.TrajetResponse toTrajetResponse(Trajet t) {
        return TransportDtos.TrajetResponse.builder()
                .id(t.getId())
                .ligneId(t.getLigne() != null ? t.getLigne().getId() : null)
                .ligneNom(t.getLigne() != null ? t.getLigne().getNom() : null)
                .busId(t.getBus() != null ? t.getBus().getId() : null)
                .busImmatriculation(t.getBus() != null ? t.getBus().getImmatriculation() : null)
                .chauffeurId(t.getChauffeur() != null ? t.getChauffeur().getId() : null)
                .chauffeurNomComplet(t.getChauffeur() != null && t.getChauffeur().getUtilisateur() != null
                        ? t.getChauffeur().getUtilisateur().getNomComplet() : null)
                .heureDepart(t.getHeureDepart())
                .heureArrivee(t.getHeureArrivee())
                .joursSemaine(t.getJoursSemaine())
                .placesDisponibles(t.getPlacesDisponibles())
                .build();
    }

    // === CHAUFFEUR ===

    public TransportDtos.ChauffeurResponse toChauffeurResponse(Chauffeur c) {
        return TransportDtos.ChauffeurResponse.builder()
                .id(c.getId())
                .nom(c.getUtilisateur() != null ? c.getUtilisateur().getNom() : null)
                .prenom(c.getUtilisateur() != null ? c.getUtilisateur().getPrenom() : null)
                .email(c.getUtilisateur() != null ? c.getUtilisateur().getEmail() : null)
                .telephone(c.getUtilisateur() != null ? c.getUtilisateur().getTelephone() : null)
                .numeroPermis(c.getNumeroPermis())
                .trajets(c.getTrajets() != null ? c.getTrajets().stream()
                        .map(this::toTrajetResponse).collect(Collectors.toList()) : null)
                .build();
    }

    // === INSCRIPTION ===

    public InscriptionDtos.InscriptionResponse toInscriptionResponse(Inscription i) {
        InscriptionDtos.InscriptionResponse.InscriptionResponseBuilder builder = InscriptionDtos.InscriptionResponse.builder()
                .id(i.getId())
                .etudiantId(i.getEtudiant() != null ? i.getEtudiant().getId() : null)
                .etudiantNom(i.getEtudiant() != null ? i.getEtudiant().getNom() : null)
                .etudiantPrenom(i.getEtudiant() != null ? i.getEtudiant().getPrenom() : null)
                .etudiantEmail(i.getEtudiant() != null ? i.getEtudiant().getEmail() : null)
                .ligneId(i.getLigne() != null ? i.getLigne().getId() : null)
                .ligneNom(i.getLigne() != null ? i.getLigne().getNom() : null)
                .arretId(i.getArret() != null ? i.getArret().getId() : null)
                .arretNom(i.getArret() != null ? i.getArret().getNom() : null)
                .typeAbonnement(i.getTypeAbonnement().name())
                .statut(i.getStatut().name())
                .dateInscription(i.getDateInscription() != null ? i.getDateInscription().toString() : null)
                .dateDebut(i.getDateDebut())
                .dateFin(i.getDateFin())
                .motifRejet(i.getMotifRejet());

        if (i.getPaiement() != null) {
            builder.paiementStatut(i.getPaiement().getStatut().name());
        }
        builder.badgeGenere(i.getBadge() != null);

        return builder.build();
    }

    // === PAIEMENT ===

    public PaiementDtos.PaiementResponse toPaiementResponse(Paiement p) {
        return PaiementDtos.PaiementResponse.builder()
                .id(p.getId())
                .inscriptionId(p.getInscription() != null ? p.getInscription().getId() : null)
                .etudiantId(p.getEtudiant() != null ? p.getEtudiant().getId() : null)
                .etudiantNom(p.getEtudiant() != null ? p.getEtudiant().getNom() : null)
                .etudiantPrenom(p.getEtudiant() != null ? p.getEtudiant().getPrenom() : null)
                .montant(p.getMontant())
                .datePaiement(p.getDatePaiement() != null ? p.getDatePaiement().toString() : null)
                .modePaiement(p.getModePaiement().name())
                .statut(p.getStatut().name())
                .referenceTransaction(p.getReferenceTransaction())
                .build();
    }

    // === BADGE ===

    public TransportDtos.BadgeResponse toBadgeResponse(Badge b) {
        return TransportDtos.BadgeResponse.builder()
                .id(b.getId())
                .inscriptionId(b.getInscription() != null ? b.getInscription().getId() : null)
                .etudiantNom(b.getEtudiant() != null ? b.getEtudiant().getNom() : null)
                .etudiantPrenom(b.getEtudiant() != null ? b.getEtudiant().getPrenom() : null)
                .codeQr(b.getCodeQr())
                .dateExpiration(b.getDateExpiration() != null ? b.getDateExpiration().format(DATE_FMT) : null)
                .estValide(b.isEffectivementValide())
                .ligneNom(b.getInscription() != null && b.getInscription().getLigne() != null
                        ? b.getInscription().getLigne().getNom() : null)
                .build();
    }

    // === NOTIFICATION ===

    public NotificationDtos.NotificationResponse toNotificationResponse(Notification n) {
        return NotificationDtos.NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType().name())
                .message(n.getMessage())
                .dateEnvoi(n.getDateEnvoi() != null ? n.getDateEnvoi().toString() : null)
                .estLue(n.getEstLue())
                .build();
    }
}
