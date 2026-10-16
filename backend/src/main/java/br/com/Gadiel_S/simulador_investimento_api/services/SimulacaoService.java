package br.com.Gadiel_S.simulador_investimento_api.services;

import br.com.Gadiel_S.simulador_investimento_api.data.dto.SimulacaoRequest;
import br.com.Gadiel_S.simulador_investimento_api.data.dto.SimulacaoResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class SimulacaoService {
  private final CdiService cdiService;

  public SimulacaoService(CdiService cdiService) {
    this.cdiService = cdiService;
  }

  public BigDecimal obterTaxaCdiAnual() {
    return cdiService.buscarTaxaCdiAnual();
  }

  public void simular() {
    System.out.println("CDI anual: " + obterTaxaCdiAnual() + "%");
  }

  public SimulacaoResponse calcularInvestimento(SimulacaoRequest request) {
    BigDecimal taxaAnualCdiPercentual = obterTaxaCdiAnual();
    BigDecimal taxaAnualDecimal = taxaAnualCdiPercentual.divide(new BigDecimal("100"), 8, RoundingMode.HALF_UP);
    double taxaAnualDouble = taxaAnualDecimal.doubleValue();
    double taxaMensalDouble = Math.pow(1.0 + taxaAnualDouble, 1.0 / 12.0) - 1.0;
    BigDecimal taxaMensalCdi = BigDecimal.valueOf(taxaMensalDouble);
    BigDecimal fatorCdi = request.percentualCdi().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
    BigDecimal taxaMensalCdb = taxaMensalCdi.multiply(fatorCdi);

    BigDecimal montanteCdb = request.valorInicial();
    BigDecimal totalInvestido = request.valorInicial();

    for (int i = 1; i <= request.meses(); i++) {
      montanteCdb = montanteCdb.multiply(BigDecimal.ONE.add(taxaMensalCdb));
      montanteCdb = montanteCdb.add(request.aporteMensal());
      totalInvestido = totalInvestido.add(request.aporteMensal());
    }

    BigDecimal rendimentoBruto = montanteCdb.subtract(totalInvestido);

    BigDecimal aliquotaIr = determinarAliquotaIr(request.meses());
    BigDecimal impostoDeRenda = rendimentoBruto.multiply(aliquotaIr);
    BigDecimal montanteLiquido = montanteCdb.subtract(impostoDeRenda);

    return new SimulacaoResponse(
        totalInvestido.setScale(2, RoundingMode.HALF_UP),
        montanteCdb.setScale(2, RoundingMode.HALF_UP),
        rendimentoBruto.setScale(2, RoundingMode.HALF_UP),
        impostoDeRenda.setScale(2, RoundingMode.HALF_UP),
        montanteLiquido.setScale(2, RoundingMode.HALF_UP)
    );
  }

  private BigDecimal determinarAliquotaIr(int meses) {
    int dias = meses * 30;
    if (dias <= 180) return new BigDecimal("0.225");
    if (dias <= 360) return new BigDecimal("0.2");
    if (dias <= 720) return new BigDecimal("0.175");
    return new BigDecimal("0.15");
  }
}
