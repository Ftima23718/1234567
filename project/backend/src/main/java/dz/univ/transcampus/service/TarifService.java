package dz.univ.transcampus.service;

import dz.univ.transcampus.entity.Inscription;
import dz.univ.transcampus.entity.Tarif;
import dz.univ.transcampus.repository.TarifRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarifService {

    private final TarifRepository tarifRepository;

    public List<Tarif> getAllTarifs() {
        return tarifRepository.findAll();
    }

    public Tarif getByType(Inscription.TypeAbonnement type) {
        return tarifRepository.findByTypeAbonnement(type).orElse(null);
    }
}
