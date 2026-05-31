package dz.univ.transcampus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

public class InscriptionDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class InscriptionRequest {
        @NotBlank(message = "La ligne est obligatoire")
        private String ligneId;
        @NotBlank(message = "L'arret est obligatoire")
        private String arretId;
        @NotBlank(message = "Le type d'abonnement est obligatoire")
        private String typeAbonnement;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class InscriptionUpdateRequest {
        @NotBlank private String statut;
        private String motifRejet;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InscriptionResponse {
        private String id;
        private String etudiantId;
        private String etudiantNom;
        private String etudiantPrenom;
        private String etudiantEmail;
        private String ligneId;
        private String ligneNom;
        private String arretId;
        private String arretNom;
        private String typeAbonnement;
        private String statut;
        private String dateInscription;
        private LocalDate dateDebut;
        private LocalDate dateFin;
        private String motifRejet;
        private String paiementStatut;
        private boolean badgeGenere;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InscriptionListResponse {
        private java.util.List<InscriptionResponse> content;
        private int pageNumber;
        private int pageSize;
        private long totalElements;
        private int totalPages;
    }
}
