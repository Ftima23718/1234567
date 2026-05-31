package dz.univ.transcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

public class TransportDtos {

    // === LIGNE ===
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LigneRequest {
        @NotBlank private String nom;
        private String description;
        @NotBlank private String pointDepart;
        @NotBlank private String pointArrivee;
        private Boolean estActive;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LigneResponse {
        private String id;
        private String nom;
        private String description;
        private String pointDepart;
        private String pointArrivee;
        private boolean estActive;
        private int arretsCount;
        private int busCount;
    }

    // === ARRET ===
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ArretRequest {
        @NotBlank private String nom;
        private String adresse;
        @NotNull private Integer ordre;
        @NotBlank private String ligneId;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ArretResponse {
        private String id;
        private String nom;
        private String adresse;
        private int ordre;
        private String ligneId;
        private String ligneNom;
    }

    // === BUS ===
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class BusRequest {
        @NotBlank private String immatriculation;
        @NotBlank private String marque;
        @NotBlank private String modele;
        @NotNull private Integer capacite;
        private String ligneId;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class BusStatusRequest {
        @NotBlank private String statut;
        private String note;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BusResponse {
        private String id;
        private String immatriculation;
        private String marque;
        private String modele;
        private int capacite;
        private int placesDisponibles;
        private String statut;
        private double tauxOccupation;
        private String ligneId;
        private String ligneNom;
    }

    // === TRAJET ===
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class TrajetRequest {
        @NotBlank private String ligneId;
        private String busId;
        private String chauffeurId;
        @NotBlank private String heureDepart;
        @NotBlank private String heureArrivee;
        private List<String> joursSemaine;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TrajetResponse {
        private String id;
        private String ligneId;
        private String ligneNom;
        private String busId;
        private String busImmatriculation;
        private String chauffeurId;
        private String chauffeurNomComplet;
        private String heureDepart;
        private String heureArrivee;
        private List<String> joursSemaine;
        private int placesDisponibles;
    }

    // === CHAUFFEUR ===
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ChauffeurRequest {
        @NotBlank private String nom;
        @NotBlank private String prenom;
        @NotBlank @jakarta.validation.constraints.Email private String email;
        @NotBlank private String telephone;
        @NotBlank private String numeroPermis;
        @NotBlank @Size(min = 6) private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ChauffeurResponse {
        private String id;
        private String nom;
        private String prenom;
        private String email;
        private String telephone;
        private String numeroPermis;
        private List<TrajetResponse> trajets;
    }

    // === BADGE ===
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BadgeResponse {
        private String id;
        private String inscriptionId;
        private String etudiantNom;
        private String etudiantPrenom;
        private String codeQr;
        private String qrCodeImageBase64;
        private String dateExpiration;
        private boolean estValide;
        private String ligneNom;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BadgeVerificationResponse {
        private boolean valid;
        private String etudiantNom;
        private String etudiantPrenom;
        private String ligneNom;
        private String dateExpiration;
        private String typeAbonnement;
        private String message;
    }

    // === PROFILE ===
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ProfileUpdateRequest {
        private String nom;
        private String prenom;
        private String telephone;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProfileResponse {
        private String id;
        private String nom;
        private String prenom;
        private String email;
        private String telephone;
        private String role;
        private String dateCreation;
        private String numeroEtudiant;
        private String filiere;
        private Integer anneeEtude;
        private String numeroPermis;
    }
}
