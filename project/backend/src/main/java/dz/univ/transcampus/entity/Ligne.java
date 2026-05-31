package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lignes")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Ligne {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    private String description;

    @Column(name = "point_depart", nullable = false)
    private String pointDepart;

    @Column(name = "point_arrivee", nullable = false)
    private String pointArrivee;

    @Column(name = "est_active", nullable = false)
    @Builder.Default
    private Boolean estActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "ligne", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordre ASC")
    @Builder.Default
    private List<Arret> arrets = new ArrayList<>();

    @OneToMany(mappedBy = "ligne", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Bus> bus = new ArrayList<>();

    @OneToMany(mappedBy = "ligne", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Trajet> trajets = new ArrayList<>();

    @Transient
    public int getArretsCount() {
        return arrets != null ? arrets.size() : 0;
    }

    @Transient
    public int getBusCount() {
        return bus != null ? bus.size() : 0;
    }
}
