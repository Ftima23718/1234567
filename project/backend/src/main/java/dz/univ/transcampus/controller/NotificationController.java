package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.NotificationDtos;
import dz.univ.transcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/summary")
    public ResponseEntity<NotificationDtos.NotificationSummary> getSummary(Authentication auth) {
        return ResponseEntity.ok(notificationService.getSummary(auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<NotificationDtos.NotificationResponse>> getAll(Authentication auth) {
        return ResponseEntity.ok(notificationService.getAll(auth.getName()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id, Authentication auth) {
        notificationService.markAsRead(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        notificationService.markAllAsRead(auth.getName());
        return ResponseEntity.noContent().build();
    }
}
