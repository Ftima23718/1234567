package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "chauffeurs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Chauffeur {

    @Id
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private Utilisateur utilisateur;

    @Column(name = "numero_permis", unique = true, nullable = false)
    private String numeroPermis;

    @OneToMany(mappedBy = "chauffeur")
    private List<Trajet> trajets;
}
