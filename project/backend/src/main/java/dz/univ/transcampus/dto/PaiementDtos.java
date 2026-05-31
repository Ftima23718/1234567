package dz.univ.transcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

public class PaiementDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class PaiementRequest {
        @NotBlank(message = "L'inscription est obligatoire")
        private String inscriptionId;
        @NotNull(message = "Le montant est obligatoire")
        private BigDecimal montant;
        @NotBlank(message = "Le mode de paiement est obligatoire")
        private String modePaiement;
        private String referenceTransaction;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PaiementResponse {
        private String id;
        private String inscriptionId;
        private String etudiantId;
        private String etudiantNom;
        private String etudiantPrenom;
        private BigDecimal montant;
        private String datePaiement;
        private String modePaiement;
        private String statut;
        private String referenceTransaction;
    }
}
