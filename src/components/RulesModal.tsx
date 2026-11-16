import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-amber-500/35 bg-[#121929] p-6 text-slate-200 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2
              id="rules-modal-title"
              className="font-display text-xl font-bold tracking-wide text-amber-300 sm:text-2xl"
            >
              Grimório de Regras & Danos
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Cada combatente inicia com 3 corações (6 Pontos de Vida · 1 Coração = 2 PV).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-amber-400"
            aria-label="Fechar regras"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm leading-relaxed">
          {/* Tabela de Danos */}
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#0d1320]">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                  <th className="px-4 py-2.5 font-semibold">Ação do Jogador</th>
                  <th className="px-4 py-2.5 font-semibold">Condição</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Efeito nos PV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-emerald-300">
                    Atacar com Raízes
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">2 raízes corretas</td>
                  <td className="font-mono-tabular px-4 py-2.5 text-right font-bold text-emerald-400">
                    -2 PV no Chefe
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-amber-300">
                    Atacar com Raízes
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">1 raiz correta</td>
                  <td className="font-mono-tabular px-4 py-2.5 text-right font-bold text-amber-400">
                    -1 PV no Chefe
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-rose-300">
                    Atacar com Raízes
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">
                    0 raízes ou armadilha (Δ &lt; 0)
                  </td>
                  <td className="font-mono-tabular px-4 py-2.5 text-right font-bold text-rose-400">
                    -2 PV em Você
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-amber-300">
                    Não possui Raiz (Δ &lt; 0)
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">
                    Contra-feitiço certeiro (Δ &lt; 0)
                  </td>
                  <td className="font-mono-tabular px-4 py-2.5 text-right font-bold text-amber-300">
                    -4 PV no Chefe
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-rose-300">
                    Não possui Raiz (Δ &lt; 0)
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">
                    Equação tinha raízes reais
                  </td>
                  <td className="font-mono-tabular px-4 py-2.5 text-right font-bold text-rose-400">
                    -2 PV em Você
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fórmulas e Dicas */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-[#0d1320] p-4">
              <p className="text-xs font-semibold tracking-wide text-amber-300">
                Fórmula de Bhaskara
              </p>
              <p className="font-mono-tabular mt-2 text-sm text-slate-100">
                Δ = b² - 4 · a · c
              </p>
              <p className="font-mono-tabular mt-1 text-sm text-slate-100">
                x = (-b ± √Δ) / (2 · a)
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#0d1320] p-4">
              <p className="text-xs font-semibold tracking-wide text-amber-300">
                Dicas de Preenchimento
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• A ordem entre R1 e R2 não importa.</li>
                <li>• Raiz dupla (Δ = 0): repita o valor em R1 e R2.</li>
                <li>• Decimais aceitam ponto (0.5) ou vírgula (0,5).</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-amber-300 whitespace-nowrap shrink-0"
          >
            Entendido, voltar à arena
          </button>
        </div>
      </div>
    </div>
  );
};
