package dz.univ.transcampus.service;

import dz.univ.transcampus.dto.TransportDtos;
import dz.univ.transcampus.entity.*;
import dz.univ.transcampus.exception.BusinessException;
import dz.univ.transcampus.mapper.EntityMapper;
import dz.univ.transcampus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final LigneRepository ligneRepository;
    private final ArretRepository arretRepository;
    private final BusRepository busRepository;
    private final TrajetRepository trajetRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final EntityMapper mapper;

    // === LIGNE ===

    @Transactional
    public TransportDtos.LigneResponse createLigne(TransportDtos.LigneRequest req) {
        Ligne ligne = mapper.toLigne(req);
        ligne = ligneRepository.save(ligne);
        return mapper.toLigneResponse(ligne);
    }

    public List<TransportDtos.LigneResponse> getAllLignes() {
        return ligneRepository.findAll().stream().map(mapper::toLigneResponse).toList();
    }

    public List<TransportDtos.LigneResponse> getActiveLignes() {
        return ligneRepository.findByEstActiveTrue().stream().map(mapper::toLigneResponse).toList();
    }

    public TransportDtos.LigneResponse getLigneById(String id) {
        Ligne ligne = ligneRepository.findById(id)
                .orElseThrow(() -> BusinessException.notFound("Ligne non trouvée"));
        return mapper.toLigneResponse(ligne);
    }

    @Transactional
    public TransportDtos.LigneResponse updateLigne(String id, TransportDtos.LigneRequest req) {
        Ligne ligne = ligneRepository.findById(id)
                .orElseThrow(() -> BusinessException.notFound("Ligne non trouvée"));
        ligne.setNom(req.getNom());
        ligne.setDescription(req.getDescription());
        ligne.setPointDepart(req.getPointDepart());
        ligne.setPointArrivee(req.getPointArrivee());
        if (req.getEstActive() != null) ligne.setEstActive(req.getEstActive());
        ligne = ligneRepository.save(ligne);
        return mapper.toLigneResponse(ligne);
    }

    @Transactional
    public void deleteLigne(String id) {
        if (!ligneRepository.existsById(id)) {
            throw BusinessException.notFound("Ligne non trouvée");
        }
        ligneRepository.deleteById(id);
    }

    // === ARRET ===

    @Transactional
    public TransportDtos.ArretResponse createArret(TransportDtos.ArretRequest req) {
        Ligne ligne = ligneRepository.findById(req.getLigneId())
                .orElseThrow(() -> BusinessException.notFound("Ligne non trouvée"));
        Arret arret = mapper.toArret(req);
        arret.setLigne(ligne);
        arret = arretRepository.save(arret);
        return mapper.toArretResponse(arret);
    }

    public List<TransportDtos.ArretResponse> getArretsByLigne(String ligneId) {
        return arretRepository.findByLigneIdOrderByOrdreAsc(ligneId)
                .stream().map(mapper::toArretResponse).toList();
    }

    @Transactional
    public void deleteArret(String id) {
        if (!arretRepository.existsById(id)) {
            throw BusinessException.notFound("Arrêt non trouvé");
        }
        arretRepository.deleteById(id);
    }

    // === BUS ===

    @Transactional
    public TransportDtos.BusResponse createBus(TransportDtos.BusRequest req) {
        if (busRepository.existsByImmatriculation(req.getImmatriculation())) {
            throw BusinessException.conflict("Cette immatriculation existe déjà");
        }
        Bus bus = mapper.toBus(req);
        if (req.getLigneId() != null) {
            Ligne ligne = ligneRepository.findById(req.getLigneId())
                    .orElseThrow(() -> BusinessException.notFound("Ligne non trouvée"));
            bus.setLigne(ligne);
        }
        bus = busRepository.save(bus);
        return mapper.toBusResponse(bus);
    }

    public List<TransportDtos.BusResponse> getAllBus() {
        return busRepository.findAll().stream().map(mapper::toBusResponse).toList();
    }

    public List<TransportDtos.BusResponse> getBusByLigne(String ligneId) {
        return busRepository.findByLigneId(ligneId).stream().map(mapper::toBusResponse).toList();
    }

    @Transactional
    public TransportDtos.BusResponse updateBusStatus(String busId, TransportDtos.BusStatusRequest req) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> BusinessException.notFound("Bus non trouvé"));
        bus.setStatut(Bus.StatutBus.valueOf(req.getStatut()));
        bus = busRepository.save(bus);
        return mapper.toBusResponse(bus);
    }

    // === TRAJET ===

    @Transactional
    public TransportDtos.TrajetResponse createTrajet(TransportDtos.TrajetRequest req) {
        Ligne ligne = ligneRepository.findById(req.getLigneId())
                .orElseThrow(() -> BusinessException.notFound("Ligne non trouvée"));

        Trajet trajet = Trajet.builder()
                .ligne(ligne)
                .heureDepart(req.getHeureDepart())
                .heureArrivee(req.getHeureArrivee())
                .joursSemaine(req.getJoursSemaine())
                .build();

        if (req.getBusId() != null) {
            Bus bus = busRepository.findById(req.getBusId())
                    .orElseThrow(() -> BusinessException.notFound("Bus non trouvé"));
            trajet.setBus(bus);
        }
        if (req.getChauffeurId() != null) {
            Chauffeur chauffeur = chauffeurRepository.findById(req.getChauffeurId())
                    .orElseThrow(() -> BusinessException.notFound("Chauffeur non trouvé"));
            trajet.setChauffeur(chauffeur);
        }

        trajet = trajetRepository.save(trajet);
        return mapper.toTrajetResponse(trajet);
    }

    public List<TransportDtos.TrajetResponse> getTrajetsByLigne(String ligneId) {
        return trajetRepository.findByLigneId(ligneId).stream().map(mapper::toTrajetResponse).toList();
    }

    public List<TransportDtos.TrajetResponse> getTrajetsByChauffeur(String chauffeurId) {
        return trajetRepository.findByChauffeurId(chauffeurId).stream().map(mapper::toTrajetResponse).toList();
    }

    // === CHAUFFEUR ===

    public List<TransportDtos.ChauffeurResponse> getAllChauffeurs() {
        return chauffeurRepository.findAll().stream().map(mapper::toChauffeurResponse).toList();
    }

    public TransportDtos.ChauffeurResponse getChauffeurById(String id) {
        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() -> BusinessException.notFound("Chauffeur non trouvé"));
        return mapper.toChauffeurResponse(chauffeur);
    }
}
