package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Ligne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LigneRepository extends JpaRepository<Ligne, String> {
    List<Ligne> findByEstActiveTrue();
    long countByEstActiveTrue();
}
