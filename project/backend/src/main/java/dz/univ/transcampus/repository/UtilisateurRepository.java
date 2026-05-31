package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, String> {
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
}
