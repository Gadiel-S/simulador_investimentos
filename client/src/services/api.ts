import type { SimulationRequest, SimulationResponse } from '../types/simulation';

const API_URL = 'http://localhost:8080/api/simulador';

export async function simularInvestimento(data: SimulationRequest): Promise<SimulationResponse> {
  const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(data),
    });

  if (!response.ok) {
      throw new Error('Erro ao consumir a api');
    }

  return response.json();
}