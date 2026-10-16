import { useState } from 'react';
import type { SimulationRequest, SimulationResponse } from '../types/simulation';
import { simularInvestimento } from '../services/api';

export default function SimulationForm() {
  const [formData, setFormData] = useState<SimulationRequest>({
    valorInicial: 1000,
    aporteMensal: 200,
    meses: 12,
    percentualCdi: 100,
  });

  const [resultado, setResultado] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const data = await simularInvestimento(formData);
      setResultado(data);
    } catch (err) {
      setErro('Falha ao conectar com o servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 min-h-screen text-slate-100 flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-emerald-400">Simulador de Investimentos</h1>
        <p className="text-slate-400 mt-2">Compare e projete seus rendimentos de renda fixa atrelados ao CDI.</p>
      </header>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Valor Inicial (R$)</label>
            <input
              type="number"
              name="valorInicial"
              value={formData.valorInicial}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Aporte Mensal (R$)</label>
            <input
              type="number"
              name="aporteMensal"
              value={formData.aporteMensal}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Prazo (Meses)</label>
            <input
              type="number"
              name="meses"
              value={formData.meses}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Percentual do CDI (%)</label>
            <input
              type="number"
              step="0.1"
              name="percentualCdi"
              value={formData.percentualCdi}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 transition-colors font-bold rounded-lg text-slate-950 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Calculando...' : 'Simular Investimento'}
          </button>

          {erro && <p className="text-red-400 text-sm mt-2">{erro}</p>}
        </form>

        {/* Card de Resultados */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-md border border-slate-700 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-emerald-400 mb-4 border-b border-slate-800 pb-2">Resultado da Projeção</h2>

            {resultado ? (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Investido:</span>
                  <span className="font-semibold text-slate-200">
                    R$ {resultado.totalInvestido.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Rendimento Bruto:</span>
                  <span className="font-semibold text-emerald-400">
                    R$ {resultado.rendimentoBruto.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Imposto de Renda (IR):</span>
                  <span className="font-semibold text-red-400">
                    R$ {resultado.impostoDeRenda.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between text-base">
                  <span className="text-slate-300 font-bold">Valor Líquido:</span>
                  <span className="font-extrabold text-emerald-300 text-lg">
                    R$ {resultado.valorLiquido.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-center py-12">
                Preencha os daods ao lado e clique em "Simular Investimento".
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 mt-6 text-center">
            * Cálculos baseados na taxa CDI oficial obtida em tempo real via API do Banco Central do Brasil.
          </div>
        </div>
      </div>
    </div>
  );
}
