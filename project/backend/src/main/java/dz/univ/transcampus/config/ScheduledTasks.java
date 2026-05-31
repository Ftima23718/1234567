package dz.univ.transcampus.config;

import dz.univ.transcampus.entity.Inscription;
import dz.univ.transcampus.repository.InscriptionRepository;
import dz.univ.transcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    private final InscriptionRepository inscriptionRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void checkExpiredInscriptions() {
        LocalDate today = LocalDate.now();

        List<Inscription> expiring = inscriptionRepository.findByStatut(Inscription.StatutInscription.VALIDEE)
                .stream()
                .filter(i -> i.getDateFin() != null && !i.getDateFin().isAfter(today))
                .toList();

        for (Inscription i : expiring) {
            i.setStatut(Inscription.StatutInscription.EXPIREE);
            inscriptionRepository.save(i);

            notificationService.send(i.getEtudiant().getId(), NotificationService.Type.warning,
                    "Votre abonnement à la ligne " + i.getLigne().getNom() + " a expiré. Pensez à le renouveler.");
        }

        if (!expiring.isEmpty()) {
            log.info("Marked {} inscriptions as expired", expiring.size());
        }
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void sendExpirationReminders() {
        LocalDate in7Days = LocalDate.now().plusDays(7);

        List<Inscription> upcoming = inscriptionRepository.findByStatut(Inscription.StatutInscription.VALIDEE)
                .stream()
                .filter(i -> i.getDateFin() != null && i.getDateFin().equals(in7Days))
                .toList();

        for (Inscription i : upcoming) {
            notificationService.send(i.getEtudiant().getId(), NotificationService.Type.info,
                    "Votre abonnement à la ligne " + i.getLigne().getNom() + " expire dans 7 jours. Renouvelez-le dès maintenant.");
        }

        if (!upcoming.isEmpty()) {
            log.info("Sent {} expiration reminders", upcoming.size());
        }
    }
}
