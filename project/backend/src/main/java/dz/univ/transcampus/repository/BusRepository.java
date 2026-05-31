package dz.univ.transcampus.repository;

import dz.univ.transcampus.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusRepository extends JpaRepository<Bus, String> {
    List<Bus> findByLigneId(String ligneId);
    boolean existsByImmatriculation(String immatriculation);
    long countByStatut(Bus.StatutBus statut);
}
