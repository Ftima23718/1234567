package dz.univ.transcampus.service;

import dz.univ.transcampus.dto.NotificationDtos;
import dz.univ.transcampus.entity.Notification;
import dz.univ.transcampus.entity.Utilisateur;
import dz.univ.transcampus.exception.BusinessException;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.NotificationRepository;
import dz.univ.transcampus.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EntityMapper mapper;

    public enum Type { info, success, warning, error }

    @Transactional
    public void send(String userId, Type type, String message) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElse(null);
        if (user == null) return;

        Notification notification = Notification.builder()
                .utilisateur(user)
                .type(Notification.Type.valueOf(type.name()))
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public NotificationDtos.NotificationSummary getSummary(String userId) {
        long unreadCount = notificationRepository.countByUtilisateurIdAndEstLueFalse(userId);
        List<Notification> recent = notificationRepository.findByUtilisateurIdOrderByDateEnvoiDesc(userId)
                .stream().limit(10).toList();

        return NotificationDtos.NotificationSummary.builder()
                .unreadCount(unreadCount)
                .recentNotifications(recent.stream().map(mapper::toNotificationResponse).toList())
                .build();
    }

    @Transactional(readOnly = true)
    public List<NotificationDtos.NotificationResponse> getAll(String userId) {
        return notificationRepository.findByUtilisateurIdOrderByDateEnvoiDesc(userId)
                .stream().map(mapper::toNotificationResponse).toList();
    }

    @Transactional
    public void markAsRead(String notificationId, String userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> BusinessException.notFound("Notification non trouvée"));
        if (!n.getUtilisateur().getId().equals(userId)) {
            throw BusinessException.forbidden("Accès non autorisé");
        }
        n.setEstLue(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUtilisateurIdOrderByDateEnvoiDesc(userId)
                .stream().filter(n -> !n.getEstLue()).toList();
        unread.forEach(n -> n.setEstLue(true));
        notificationRepository.saveAll(unread);
    }
}
