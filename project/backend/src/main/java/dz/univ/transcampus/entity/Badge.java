package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "badges")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscription_id", nullable = false, unique = true)
    private Inscription inscription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Utilisateur etudiant;

    @Column(name = "code_qr", unique = true, nullable = false)
    private String codeQr;

    @Column(name = "date_expiration", nullable = false)
    private LocalDate dateExpiration;

    @Column(name = "est_valide", nullable = false)
    @Builder.Default
    private Boolean estValide = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Transient
    public boolean isEffectivementValide() {
        return estValide && dateExpiration != null && dateExpiration.isAfter(LocalDate.now());
    }
}
