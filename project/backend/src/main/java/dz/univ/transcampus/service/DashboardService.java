package dz.univ.transcampus.service;

import dz.univ.transcampus.dto.DashboardDtos;
import dz.univ.transcampus.entity.*;
import dz.univ.transcampus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UtilisateurRepository utilisateurRepository;
    private final InscriptionRepository inscriptionRepository;
    private final PaiementRepository paiementRepository;
    private final LigneRepository ligneRepository;
    private final BusRepository busRepository;
    private final NotificationRepository notificationRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final TrajetRepository trajetRepository;

    public DashboardDtos.DashboardResponse getSummary() {
        long totalEtudiants = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == dz.univ.transcampus.entity.Utilisateur.Role.STUDENT)
                .count();

        long totalInscriptions = inscriptionRepository.count();
        long inscriptionsValidees = inscriptionRepository.countByStatut(Inscription.StatutInscription.VALIDEE);
        long inscriptionsEnAttente = inscriptionRepository.countByStatut(Inscription.StatutInscription.EN_ATTENTE);

        double revenusTotaux = paiementRepository.findAll().stream()
                .filter(p -> p.getStatut() == Paiement.StatutPaiement.PAYE)
                .mapToDouble(p -> p.getMontant().doubleValue())
                .sum();

        long lignesActives = ligneRepository.countByEstActiveTrue();
        long busActifs = busRepository.countByStatut(dz.univ.transcampus.entity.Bus.StatutBus.ACTIF);
        long notificationsNonLues = notificationRepository.findAll().stream()
                .filter(n -> !n.getEstLue())
                .count();

        return DashboardDtos.DashboardResponse.builder()
                .totalEtudiants(totalEtudiants)
                .totalInscriptions(totalInscriptions)
                .inscriptionsValidees(inscriptionsValidees)
                .inscriptionsEnAttente(inscriptionsEnAttente)
                .revenusTotaux(revenusTotaux)
                .lignesActives(lignesActives)
                .busActifs(busActifs)
                .notificationsNonLues(notificationsNonLues)
                .build();
    }

    public DashboardDtos.KPIsResponse getKPIs() {
        long totalInscrits = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.STUDENT)
                .count();

        long inscriptionsEnAttente = inscriptionRepository.countByStatut(Inscription.StatutInscription.EN_ATTENTE);
        long inscriptionsValidees = inscriptionRepository.countByStatut(Inscription.StatutInscription.VALIDEE);

        double revenusTotal = paiementRepository.findAll().stream()
                .filter(p -> p.getStatut() == Paiement.StatutPaiement.PAYE)
                .mapToDouble(p -> p.getMontant().doubleValue())
                .sum();

        long lignesActives = ligneRepository.countByEstActiveTrue();
        long busActifs = busRepository.countByStatut(Bus.StatutBus.ACTIF);

        // Calculate occupancy rate: total inscribed / total bus capacity
        List<Bus> allBuses = busRepository.findAll();
        long totalCapacity = allBuses.stream().mapToLong(Bus::getCapacite).sum();
        double tauxRemplissage = totalCapacity > 0 ? ((double) totalInscrits / totalCapacity) * 100 : 0;

        return DashboardDtos.KPIsResponse.builder()
                .totalInscrits(totalInscrits)
                .inscriptionsEnAttente(inscriptionsEnAttente)
                .inscriptionsValidees(inscriptionsValidees)
                .revenusTotal(revenusTotal)
                .lignesActives(lignesActives)
                .busActifs(busActifs)
                .tauxRemplissage(Math.min(tauxRemplissage, 100.0)) // Cap at 100%
                .build();
    }

    public DashboardDtos.ResponsableDashboardResponse getResponsableDashboard() {
        long totalBus = busRepository.count();
        long totalLignes = ligneRepository.count();
        long busActifs = busRepository.countByStatut(Bus.StatutBus.ACTIF);
        long lignesActives = ligneRepository.countByEstActiveTrue();

        return DashboardDtos.ResponsableDashboardResponse.builder()
                .totalBus(totalBus)
                .totalLignes(totalLignes)
                .totalTrajets(0) // Trajets not implemented yet
                .busActifs(busActifs)
                .lignesActives(lignesActives)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardDtos.DriverDashboardResponse getDriverDashboard(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("Invalid user ID");
        }
        Utilisateur user = utilisateurRepository.findById(userId.trim())
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Eagerly initialize chauffeur relationship
        if (user.getChauffeur() != null) {
            user.getChauffeur().getId();
        }
        Chauffeur chauffeur = user.getChauffeur();
        if (chauffeur == null) {
            throw new RuntimeException("Chauffeur profile not found");
        }

        List<Trajet> trajets = trajetRepository.findByChauffeurId(chauffeur.getId());
        int totalPlaces = trajets.stream()
                .mapToInt(t -> t.getPlacesDisponibles() == null ? 0 : t.getPlacesDisponibles())
                .sum();
        long trajetsParSemaine = trajets.stream()
                .mapToLong(t -> t.getJoursSemaine() == null ? 0 : t.getJoursSemaine().size())
                .sum();

        return DashboardDtos.DriverDashboardResponse.builder()
                .chauffeurNom(user.getNom())
                .chauffeurPrenom(user.getPrenom())
                .trajetId(trajets.isEmpty() ? "N/A" : trajets.get(0).getId())
                .ligneName(trajets.isEmpty() ? "N/A" : trajets.get(0).getLigne().getNom())
                .busImmatriculation(trajets.isEmpty() ? "N/A" : trajets.get(0).getBus().getImmatriculation())
                .trajetStatus(trajets.isEmpty() ? "PENDING" : "ASSIGNED")
                .totalTrajets(trajets.size())
                .placesDisponibles(totalPlaces)
                .trajetsParSemaine(trajetsParSemaine)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardDtos.StudentDashboardResponse getStudentDashboard(String userId) {
        // Ensure userId is trimmed and not null
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("Invalid user ID");
        }
        Utilisateur user = utilisateurRepository.findById(userId.trim())
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        String etudiantId = user.getId();
        List<Inscription> inscriptions = inscriptionRepository.findByEtudiantId(etudiantId);
        
        // Eagerly initialize lazy relationships
        inscriptions.forEach(i -> {
            if (i.getEtudiant() != null) i.getEtudiant().getId();
            if (i.getLigne() != null) i.getLigne().getId();
        });

        long totalInscriptions = inscriptions.size();
        long inscriptionsValidees = inscriptions.stream()
                .filter(i -> i.getStatut() == Inscription.StatutInscription.VALIDEE)
                .count();
        long inscriptionsEnAttente = inscriptions.stream()
                .filter(i -> i.getStatut() == Inscription.StatutInscription.EN_ATTENTE)
                .count();

        long lignesActives = ligneRepository.countByEstActiveTrue();

        return DashboardDtos.StudentDashboardResponse.builder()
                .totalInscriptions(totalInscriptions)
                .inscriptionsValidees(inscriptionsValidees)
                .inscriptionsEnAttente(inscriptionsEnAttente)
                .lignesActives(lignesActives)
                .etudiantNom(user.getNom())
                .etudiantPrenom(user.getPrenom())
                .build();
    }
}
