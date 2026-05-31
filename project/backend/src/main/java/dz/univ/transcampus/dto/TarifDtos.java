package dz.univ.transcampus.dto;

import lombok.*;

public class TarifDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TarifResponse {
        private String id;
        private String typeAbonnement;
        private double montant;
        private String description;
    }
}
