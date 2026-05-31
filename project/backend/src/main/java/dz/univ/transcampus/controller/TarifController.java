package dz.univ.transcampus.controller;

import dz.univ.transcampus.dto.TarifDtos;
import dz.univ.transcampus.service.TarifService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/tarifs")
@RequiredArgsConstructor
public class TarifController {

    private final TarifService tarifService;

    @GetMapping
    public ResponseEntity<List<TarifDtos.TarifResponse>> getAll() {
        List<TarifDtos.TarifResponse> response = new ArrayList<>();
        for (dz.univ.transcampus.entity.Tarif t : tarifService.getAllTarifs()) {
            response.add(TarifDtos.TarifResponse.builder()
                    .id(t.getId())
                    .typeAbonnement(t.getTypeAbonnement().name())
                    .montant(t.getMontant().doubleValue())
                    .description(t.getDescription())
                    .build());
        }
        return ResponseEntity.ok(response);
    }
}
