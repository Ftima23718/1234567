package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "arrets")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Arret {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    private String adresse;

    @Column(nullable = false)
    @Builder.Default
    private Integer ordre = 1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ligne_id", nullable = false)
    private Ligne ligne;

    private String coordonnees;
}
