package dz.univ.transcampus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "profiles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(columnDefinition = "TEXT")
    private String photoURL;

    @CreationTimestamp
    @Column(name = "date_creation", updatable = false)
    private Instant dateCreation;

    @OneToOne(mappedBy = "utilisateur", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Etudiant etudiant;

    @OneToOne(mappedBy = "utilisateur", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Chauffeur chauffeur;

    @Transient
    public String getNomComplet() {
        return prenom + " " + nom;
    }

    @Transient
    public String getInitials() {
        return (prenom != null && !prenom.isEmpty() ? String.valueOf(prenom.charAt(0)) : "") +
               (nom != null && !nom.isEmpty() ? String.valueOf(nom.charAt(0)) : "");
    }

    public enum Role {
        STUDENT, ADMIN, RESPONSIBLE, DRIVER
    }
}
