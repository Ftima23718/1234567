package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "etudiants")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Etudiant {

    @Id
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @MapsId
    @JoinColumn(name = "id")
    private Utilisateur utilisateur;

    @Column(name = "numero_etudiant", unique = true, nullable = false)
    private String numeroEtudiant;

    @Column(nullable = false)
    private String filiere;

    @Column(name = "annee_etude", nullable = false)
    @Builder.Default
    private Integer anneeEtude = 1;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "carte_etudiante_url")
    private String carteEtudianteUrl;
}
