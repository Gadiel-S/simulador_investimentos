package br.com.Gadiel_S.simulador_investimento_api.data.dto;

import java.math.BigDecimal;

public record SimulacaoResponse(
    BigDecimal totalInvestido,
    BigDecimal valorBruto,
    BigDecimal rendimentoBruto,
    BigDecimal impostoDeRenda,
    BigDecimal valorLiquido
) {}
