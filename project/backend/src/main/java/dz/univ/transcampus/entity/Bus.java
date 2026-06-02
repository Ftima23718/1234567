package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "bus")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String immatriculation;

    @Column(nullable = false)
    private String marque;

    @Column(nullable = false)
    private String modele;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacite = 50;

    @Column(name = "places_disponibles", nullable = false)
    @Builder.Default
    private Integer placesDisponibles = 50;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutBus statut = StatutBus.ACTIF;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ligne_id")
    private Ligne ligne;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    public enum StatutBus {
        ACTIF, EN_MAINTENANCE, HORS_SERVICE
    }

    @Transient
    public double getTauxOccupation() {
        return capacite > 0 ? ((double)(capacite - placesDisponibles) / capacite) * 100 : 0;
    }
}
