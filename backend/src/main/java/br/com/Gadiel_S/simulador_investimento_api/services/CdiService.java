package br.com.Gadiel_S.simulador_investimento_api.services;

import br.com.Gadiel_S.simulador_investimento_api.data.dto.BcbCdiResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CdiService {
  private final RestClient restClient = RestClient.builder()
      .baseUrl("https://api.bcb.gov.br")
      .defaultHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
      .build();

  @Cacheable("taxaCdi")
  public BigDecimal buscarTaxaCdiAnual() {
    List<BcbCdiResponse> dados = restClient.get()
        .uri("/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json")
        .retrieve()
        .body(new ParameterizedTypeReference<List<BcbCdiResponse>>() {});

    if (dados == null || dados.isEmpty()) {
      throw new IllegalStateException(
          "Nenhum dado de CDI foi retornado pelo Banco Central."
      );
    }

    return new BigDecimal(dados.getFirst().valor());
  }
}
