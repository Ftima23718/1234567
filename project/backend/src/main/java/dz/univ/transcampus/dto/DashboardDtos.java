package dz.univ.transcampus.dto;

import lombok.*;

public class DashboardDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardResponse {
        private long totalEtudiants;
        private long totalInscriptions;
        private long inscriptionsValidees;
        private long inscriptionsEnAttente;
        private double revenusTotaux;
        private long lignesActives;
        private long busActifs;
        private long notificationsNonLues;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class KPIsResponse {
        private long totalInscrits;
        private long inscriptionsEnAttente;
        private long inscriptionsValidees;
        private double revenusTotal;
        private long lignesActives;
        private long busActifs;
        private double tauxRemplissage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResponsableDashboardResponse {
        private long totalBus;
        private long totalLignes;
        private long totalTrajets;
        private long busActifs;
        private long lignesActives;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DriverDashboardResponse {
        private String chauffeurNom;
        private String chauffeurPrenom;
        private String trajetId;
        private String ligneName;
        private String busImmatriculation;
        private String trajetStatus;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentDashboardResponse {
        private long totalInscriptions;
        private long inscriptionsValidees;
        private long inscriptionsEnAttente;
        private long lignesActives;
        private String etudiantNom;
        private String etudiantPrenom;
    }
}
