package br.com.Gadiel_S.simulador_investimento_api.controllers;

import br.com.Gadiel_S.simulador_investimento_api.data.dto.SimulacaoRequest;
import br.com.Gadiel_S.simulador_investimento_api.data.dto.SimulacaoResponse;
import br.com.Gadiel_S.simulador_investimento_api.services.SimulacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulador")
@CrossOrigin(origins = "*")
public class SimuladorController {
  @Autowired
  private SimulacaoService simulacaoService;

  @PostMapping
  public ResponseEntity<SimulacaoResponse> simular(@RequestBody SimulacaoRequest request) {
    SimulacaoResponse resposta = simulacaoService.calcularInvestimento(request);
    return ResponseEntity.ok(resposta);
  }
}
