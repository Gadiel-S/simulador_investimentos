package br.com.Gadiel_S.simulador_investimento_api.data.dto;

import java.math.BigDecimal;

public record SimulacaoRequest(
    BigDecimal valorInicial,
    BigDecimal aporteMensal,
    Integer meses,
    BigDecimal percentualCdi
) {}
