package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Trajet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrajetRepository extends JpaRepository<Trajet, String> {
    List<Trajet> findByLigneId(String ligneId);
    List<Trajet> findByChauffeurId(String chauffeurId);
}
