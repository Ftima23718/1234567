package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "paiements")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inscription_id", nullable = false, unique = true)
    private Inscription inscription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Utilisateur etudiant;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montant;

    @CreationTimestamp
    @Column(name = "date_paiement", updatable = false)
    private Instant datePaiement;

    @Column(name = "mode_paiement", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ModePaiement modePaiement = ModePaiement.ESPECES;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutPaiement statut = StatutPaiement.EN_ATTENTE;

    @Column(name = "reference_transaction", unique = true)
    private String referenceTransaction;

    public enum ModePaiement {
        ESPECES, VIREMENT
    }

    public enum StatutPaiement {
        EN_ATTENTE, PAYE, ANNULE
    }
}
