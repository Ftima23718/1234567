package dz.univ.transcampus.dto;

import lombok.*;

public class NotificationDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class NotificationResponse {
        private String id;
        private String type;
        private String message;
        private String dateEnvoi;
        private Boolean estLue;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class NotificationSummary {
        private long unreadCount;
        private java.util.List<NotificationResponse> recentNotifications;
    }
}
