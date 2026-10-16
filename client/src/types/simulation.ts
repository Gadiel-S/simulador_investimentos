export interface SimulationRequest {
  valorInicial: number;
  aporteMensal: number;
  meses: number;
  percentualCdi: number;
}

export interface SimulationResponse {
  totalInvestido: number;
  valorBruto: number;
  rendimentoBruto: number;
  impostoDeRenda: number;
  valorLiquido: number;
}