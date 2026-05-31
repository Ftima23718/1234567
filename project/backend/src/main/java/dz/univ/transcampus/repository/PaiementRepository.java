package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaiementRepository extends JpaRepository<Paiement, String> {
    Optional<Paiement> findByInscriptionId(String inscriptionId);
    List<Paiement> findByEtudiantId(String etudiantId);
}
