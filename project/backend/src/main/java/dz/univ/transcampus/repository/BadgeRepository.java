package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, String> {
    Optional<Badge> findByInscriptionId(String inscriptionId);
    Optional<Badge> findByCodeQr(String codeQr);
    Optional<Badge> findByEtudiantId(String etudiantId);
}
