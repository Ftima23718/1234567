package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUtilisateurIdOrderByDateEnvoiDesc(String utilisateurId);
    long countByUtilisateurIdAndEstLueFalse(String utilisateurId);
}
