package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Inscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InscriptionRepository extends JpaRepository<Inscription, String> {
    long countByStatut(Inscription.StatutInscription statut);

    List<Inscription> findByEtudiantId(String etudiantId);
    Page<Inscription> findByEtudiantId(String etudiantId, Pageable pageable);
    List<Inscription> findByStatut(Inscription.StatutInscription statut);
    Page<Inscription> findByStatut(Inscription.StatutInscription statut, Pageable pageable);
    List<Inscription> findByLigneId(String ligneId);
}
