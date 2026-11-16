import React from 'react';
import { RotateCcw, ShieldAlert, Trophy } from 'lucide-react';

interface EndGameModalProps {
  outcome: 'VICTORY' | 'GAME_OVER';
  turnos: number;
  acertosCriticos: number;
  contraFeiticos: number;
  erros: number;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const EndGameModal: React.FC<EndGameModalProps> = ({
  outcome,
  turnos,
  acertosCriticos,
  contraFeiticos,
  erros,
  onRestart,
  onReturnTitle,
}) => {
  const isVictory = outcome === 'VICTORY';

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="endgame-title"
    >
      <div
        className={`w-full max-w-md rounded-xl border p-6 text-center shadow-2xl sm:p-8 ${
          isVictory
            ? 'border-amber-500/50 bg-[#11192a]'
            : 'border-rose-500/45 bg-[#16121e]'
        }`}
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl border ${
            isVictory
              ? 'border-amber-400/40 bg-amber-500/15 text-amber-300'
              : 'border-rose-400/40 bg-rose-500/15 text-rose-300'
          }`}
        >
          {isVictory ? <Trophy className="h-7 w-7" /> : <ShieldAlert className="h-7 w-7" />}
        </div>

        <h2
          id="endgame-title"
          className={`font-display mt-4 text-2xl font-bold tracking-wide sm:text-3xl ${
            isVictory ? 'text-amber-300' : 'text-rose-300'
          }`}
        >
          {isVictory ? 'Vitória na Arena!' : 'Derrota na Arena'}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {isVictory
            ? 'Você derrotou o Arquimago de Bhaskara e provou domínio sobre o discriminante e as raízes reais.'
            : 'O Arquimago superou sua guarda desta vez. Revise o valor de Δ = b² - 4ac nos erros e volte mais forte!'}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-[#0b101b] p-4 text-left">
          <div>
            <div className="text-xs text-slate-400">Turnos jogados</div>
            <div className="font-mono-tabular mt-0.5 text-lg font-bold text-slate-100">
              {turnos}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Acertos críticos</div>
            <div className="font-mono-tabular mt-0.5 text-lg font-bold text-emerald-400">
              {acertosCriticos}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Contra-feitiços</div>
            <div className="font-mono-tabular mt-0.5 text-lg font-bold text-amber-300">
              {contraFeiticos}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Erros sofridos</div>
            <div className="font-mono-tabular mt-0.5 text-lg font-bold text-rose-400">
              {erros}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 ${
              isVictory
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 focus-visible:outline-amber-300'
                : 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-300'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            {isVictory ? 'Jogar Novamente' : 'Tentar Novamente'}
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Tela Inicial
          </button>
        </div>
      </div>
    </div>
  );
};
