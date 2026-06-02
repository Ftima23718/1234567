package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "inscriptions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Utilisateur etudiant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ligne_id", nullable = false)
    private Ligne ligne;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "arret_id", nullable = false)
    private Arret arret;

    @Column(name = "type_abonnement", nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeAbonnement typeAbonnement;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutInscription statut = StatutInscription.EN_ATTENTE;

    @CreationTimestamp
    @Column(name = "date_inscription", updatable = false)
    private Instant dateInscription;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @Column(name = "motif_rejet")
    private String motifRejet;

    @OneToOne(mappedBy = "inscription", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Paiement paiement;

    @OneToOne(mappedBy = "inscription", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Badge badge;

    public enum TypeAbonnement {
        MENSUEL, SEMESTRIEL, ANNUEL
    }

    public enum StatutInscription {
        EN_ATTENTE, VALIDEE, REJETEE, EXPIREE
    }
}
