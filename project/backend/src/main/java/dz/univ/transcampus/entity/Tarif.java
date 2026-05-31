package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tarifs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Tarif {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "type_abonnement", unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    private Inscription.TypeAbonnement typeAbonnement;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montant;

    private String description;
}
