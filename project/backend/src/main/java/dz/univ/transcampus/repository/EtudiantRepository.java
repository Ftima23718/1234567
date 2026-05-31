package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EtudiantRepository extends JpaRepository<Etudiant, String> {
    Optional<Etudiant> findByNumeroEtudiant(String numeroEtudiant);
    boolean existsByNumeroEtudiant(String numeroEtudiant);
}
