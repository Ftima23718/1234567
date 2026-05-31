package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "trajets")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Trajet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ligne_id", nullable = false)
    private Ligne ligne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chauffeur_id")
    private Chauffeur chauffeur;

    @Column(name = "heure_depart", nullable = false)
    private String heureDepart;

    @Column(name = "heure_arrivee", nullable = false)
    private String heureArrivee;

    @ElementCollection
    @CollectionTable(name = "trajet_jours", joinColumns = @JoinColumn(name = "trajet_id"))
    @Column(name = "jours_semaine")
    @Builder.Default
    private List<String> joursSemaine = List.of("Lun", "Mar", "Mer", "Jeu", "Ven");

    @Column(name = "places_disponibles", nullable = false)
    @Builder.Default
    private Integer placesDisponibles = 50;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
