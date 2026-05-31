package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Arret;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArretRepository extends JpaRepository<Arret, String> {
    List<Arret> findByLigneIdOrderByOrdreAsc(String ligneId);
}
