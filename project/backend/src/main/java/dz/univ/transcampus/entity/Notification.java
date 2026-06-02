package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "notifications")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur utilisateur;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Type type = Type.info;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "date_envoi", updatable = false)
    @Builder.Default
    private Instant dateEnvoi = Instant.now();

    @Column(name = "est_lue", nullable = false)
    @Builder.Default
    private Boolean estLue = false;

    public enum Type {
        info, success, warning, error
    }
}
