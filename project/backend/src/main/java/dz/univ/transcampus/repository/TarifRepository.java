package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Inscription;
import dz.univ.transcampus.entity.Tarif;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TarifRepository extends JpaRepository<Tarif, String> {
    Optional<Tarif> findByTypeAbonnement(Inscription.TypeAbonnement typeAbonnement);
}
