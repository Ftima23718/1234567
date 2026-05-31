package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, String> {
    Optional<Chauffeur> findByNumeroPermis(String numeroPermis);
    boolean existsByNumeroPermis(String numeroPermis);
}
