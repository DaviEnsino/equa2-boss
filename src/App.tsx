import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Info, ShieldBan, Swords, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { EQUATIONS_FALLBACK, loadEquations } from './data/equationsFallback';
import type {
  CombatLogEntry,
  Equacao,
  FloatingDamage,
  GameState,
  ModoJogo,
  SpriteAnim,
} from './types/game';
import {
  evaluateCounterSpell,
  evaluateRootsAttack,
  getNivelLabel,
  getTargetDifficulty,
  parseBrazilianNumber,
  pickNextEquation,
} from './utils/combat';
import { getAudioMuted, playSound, setAudioMuted } from './utils/sound';
import { HeartBar } from './components/HeartBar';
import { BossSprite, PlayerSprite, TitleEmblem } from './components/Sprites';
import { RulesModal } from './components/RulesModal';
import { EndGameModal } from './components/EndGameModal';

const MAX_HP = 6;

const MODO_OPTIONS: { value: ModoJogo; label: string }[] = [
  { value: 'dinamico', label: 'Progressão Dinâmica' },
  { value: 'facil', label: 'Fácil' },
  { value: 'medio', label: 'Médio' },
  { value: 'dificil', label: 'Difícil' },
];

export default function App() {
  const [equations, setEquations] = useState<Equacao[]>(EQUATIONS_FALLBACK);
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [modo, setModo] = useState<ModoJogo>('dinamico');

  const [playerHP, setPlayerHP] = useState<number>(MAX_HP);
  const [bossHP, setBossHP] = useState<number>(MAX_HP);
  const [currentEq, setCurrentEq] = useState<Equacao>(EQUATIONS_FALLBACK[0]);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [turno, setTurno] = useState<number>(1);

  const [r1Input, setR1Input] = useState<string>('');
  const [r2Input, setR2Input] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);

  const [bossAnim, setBossAnim] = useState<SpriteAnim>('idle');
  const [playerAnim, setPlayerAnim] = useState<SpriteAnim>('idle');
  const [floatingDmg, setFloatingDmg] = useState<FloatingDamage | null>(null);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const [logs, setLogs] = useState<CombatLogEntry[]>([]);
  const [acertosCriticos, setAcertosCriticos] = useState<number>(0);
  const [contraFeiticos, setContraFeiticos] = useState<number>(0);
  const [erros, setErros] = useState<number>(0);

  const [showRules, setShowRules] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(getAudioMuted());

  const r1Ref = useRef<HTMLInputElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    let active = true;
    void loadEquations().then((loaded) => {
      if (active && loaded.length > 0) {
        setEquations(loaded);
      }
    });
    return () => {
      active = false;
      clearTimers();
    };
  }, [clearTimers]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      setAudioMuted(next);
      return next;
    });
  }, []);

  const startBattle = useCallback(() => {
    clearTimers();
    playSound('click');

    const { equation, nextUsedIds } = pickNextEquation(
      equations,
      [],
      MAX_HP,
      modo
    );

    setPlayerHP(MAX_HP);
    setBossHP(MAX_HP);
    setCurrentEq(equation);
    setUsedIds(nextUsedIds);
    setTurno(1);
    setR1Input('');
    setR2Input('');
    setInputError(null);
    setBossAnim('idle');
    setPlayerAnim('idle');
    setFloatingDmg(null);
    setIsResolving(false);
    setAcertosCriticos(0);
    setContraFeiticos(0);
    setErros(0);
    setLogs([
      {
        id: Date.now(),
        turno: 0,
        mensagem:
          'O Arquimago bloqueou seu caminho! Resolva as raízes ou lance um contra-feitiço se Δ < 0.',
        tone: 'info',
        equacao: equation.equacao,
      },
    ]);
    setGameState('PLAYING');

    scheduleTimer(() => {
      r1Ref.current?.focus();
    }, 60);
  }, [clearTimers, equations, modo, scheduleTimer]);

  // Global keyboard shortcuts (Enter/Space on Title Screen, I for rules, M for audio)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      if (gameState === 'TITLE_MENU' && !showRules && !isInput) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startBattle();
        }
      }

      if (!isInput) {
        if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          setShowRules((prev) => !prev);
        } else if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          toggleMute();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, showRules, startBattle, toggleMute]);

  const applyTurnOutcome = useCallback(
    (
      resolution: ReturnType<typeof evaluateRootsAttack>,
      wasCounterSpell: boolean
    ) => {
      setIsResolving(true);
      setInputError(null);

      const nextBossHP = Math.max(0, bossHP - resolution.bossDamage);
      const nextPlayerHP = Math.max(0, playerHP - resolution.playerDamage);

      // Update counters
      if (resolution.bossDamage === 4 && wasCounterSpell) {
        setContraFeiticos((c) => c + 1);
      } else if (resolution.bossDamage === 2) {
        setAcertosCriticos((c) => c + 1);
      } else if (resolution.playerDamage > 0) {
        setErros((c) => c + 1);
      }

      // Animations & sound
      if (resolution.bossDamage > 0) {
        setPlayerAnim('attack');
        setBossAnim('hit');
        setFloatingDmg({
          id: Date.now(),
          target: 'boss',
          text:
            resolution.bossDamage === 4
              ? `-4 PV CRÍTICO!`
              : resolution.bossDamage === 2
                ? `-2 PV`
                : `-1 PV`,
          tone:
            resolution.bossDamage === 4
              ? 'counter'
              : resolution.bossDamage === 2
                ? 'crit'
                : 'damage',
        });

        if (resolution.bossDamage === 4) {
          playSound('counter');
        } else if (resolution.bossDamage === 2) {
          playSound('crit');
        } else {
          playSound('partial');
        }
      } else {
        setBossAnim('attack');
        setPlayerAnim('hit');
        setFloatingDmg({
          id: Date.now(),
          target: 'player',
          text: `-${resolution.playerDamage} PV`,
          tone: 'player-hit',
        });
        playSound('hurt');
      }

      setBossHP(nextBossHP);
      setPlayerHP(nextPlayerHP);

      setLogs((prev) => [
        {
          id: Date.now(),
          turno,
          mensagem: resolution.mensagem,
          dica: resolution.showHint ? currentEq.dica : undefined,
          tone: resolution.tone,
          equacao: currentEq.equacao,
        },
        ...prev.slice(0, 5),
      ]);

      scheduleTimer(() => {
        setBossAnim('idle');
        setPlayerAnim('idle');
        setFloatingDmg(null);

        if (nextBossHP <= 0) {
          playSound('victory');
          setGameState('VICTORY');
          setIsResolving(false);
          return;
        }

        if (nextPlayerHP <= 0) {
          playSound('defeat');
          setGameState('GAME_OVER');
          setIsResolving(false);
          return;
        }

        const { equation, nextUsedIds } = pickNextEquation(
          equations,
          usedIds,
          nextBossHP,
          modo,
          currentEq.id
        );

        setCurrentEq(equation);
        setUsedIds(nextUsedIds);
        setTurno((t) => t + 1);
        setR1Input('');
        setR2Input('');
        setIsResolving(false);

        scheduleTimer(() => {
          r1Ref.current?.focus();
        }, 40);
      }, 650);
    },
    [bossHP, currentEq, equations, modo, playerHP, scheduleTimer, turno, usedIds]
  );

  const handleSubmitRoots = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResolving || gameState !== 'PLAYING') return;

    const val1 = parseBrazilianNumber(r1Input);
    const val2 = parseBrazilianNumber(r2Input);

    if (val1 === null || val2 === null) {
      setInputError(
        'Preencha R1 e R2 com números válidos (ex: -2 ou 0,5). Para raiz dupla, repita o mesmo valor.'
      );
      return;
    }

    const resolution = evaluateRootsAttack(val1, val2, currentEq);
    applyTurnOutcome(resolution, false);
  };

  const handleCounterSpell = () => {
    if (isResolving || gameState !== 'PLAYING') return;
    const resolution = evaluateCounterSpell(currentEq);
    applyTurnOutcome(resolution, true);
  };

  const activeDifficulty = getTargetDifficulty(bossHP, modo);
  const latestLog = logs[0];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#090d16] text-slate-100">
      {/* Subtle ambient arena lighting */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(217, 119, 6, 0.11), transparent 52%), radial-gradient(circle at 18% 82%, rgba(30, 58, 138, 0.14), transparent 48%), radial-gradient(circle at 84% 78%, rgba(185, 28, 28, 0.08), transparent 45%)',
        }}
        aria-hidden="true"
      />

      {/* Global Top-Right Utility Controls (Info button fixed at top-4 right-4 z-50) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/80 bg-[#121929]/90 text-slate-300 shadow-lg transition-colors hover:border-amber-500/50 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-amber-400"
          aria-label={muted ? 'Ativar som' : 'Silenciar som'}
          title={muted ? 'Ativar som (M)' : 'Silenciar som (M)'}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            setShowRules(true);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-500/45 bg-[#121929]/90 text-amber-300 shadow-lg transition-colors hover:border-amber-400 hover:bg-amber-500/15 focus-visible:outline-2 focus-visible:outline-amber-400"
          aria-label="Regras do jogo"
          title="Regras e tabela de danos (I)"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* ================= TITLE SCREEN ================= */}
      {gameState === 'TITLE_MENU' && (
        <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-5 py-14 text-center">
          <TitleEmblem />

          <h1 className="font-display mt-6 max-w-2xl text-4xl font-extrabold tracking-wide text-amber-200 sm:text-5xl md:text-6xl [text-wrap:balance]">
            Bhaskara Boss Battle
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Enfrente o Arquimago do Discriminante em duelos de turno. Calcule as
            raízes da equação do 2º grau para atacar ou identifique{' '}
            <span className="font-mono-tabular font-bold text-amber-300">
              Δ &lt; 0
            </span>{' '}
            para lançar um contra-feitiço devastador.
          </p>

          {/* Clean unboxed mechanics summary */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-400 sm:text-sm">
            <span>3 Corações cada (6 PV)</span>
            <span aria-hidden="true">·</span>
            <span>2 Raízes certas = -2 PV</span>
            <span aria-hidden="true">·</span>
            <span>1 Raiz certa = -1 PV</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300/90">
              Contra-feitiço (Δ &lt; 0) = -4 PV
            </span>
          </div>

          {/* Difficulty Selector */}
          <div className="mt-8 w-full max-w-lg rounded-xl border border-slate-800 bg-[#111827]/85 p-4">
            <div className="mb-3 text-xs font-semibold tracking-wide text-slate-400">
              Modo de Dificuldade
            </div>
            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              role="radiogroup"
              aria-label="Modo de Dificuldade"
            >
              {MODO_OPTIONS.map((opt) => {
                const active = modo === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      playSound('click');
                      setModo(opt.value);
                    }}
                    className={`min-h-[44px] rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400 sm:text-sm ${
                      active
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'border border-slate-700/80 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {opt.value === 'dinamico' ? 'Dinâmico' : opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-xs text-slate-400">
              {modo === 'dinamico'
                ? 'Recomendado: o nível sobe automaticamente (Fácil → Médio → Difícil) conforme a vida do Chefe cai.'
                : `Modo fixo: todas as equações sorteadas serão do nível ${getNivelLabel(modo)}.`}
            </p>
          </div>

          {/* Primary Start CTA */}
          <button
            type="button"
            onClick={startBattle}
            className="mt-7 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-8 py-3.5 text-base font-bold text-slate-950 shadow-[0_8px_28px_rgba(245,158,11,0.3)] transition-all duration-150 hover:bg-amber-400 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-amber-200 whitespace-nowrap shrink-0"
          >
            <Swords className="h-5 w-5" />
            Começar Batalha
          </button>

          <p className="mt-5 text-xs text-slate-500">
            Enter para iniciar · I para regras · M para áudio
          </p>
        </main>
      )}

      {/* ================= BATTLE ARENA ================= */}
      {gameState !== 'TITLE_MENU' && (
        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between gap-4 px-4 pt-4 pb-6 sm:px-6 sm:pt-6 lg:py-6">
          {/* Top-left back link (quiet, non-intrusive) */}
          <div className="flex items-center justify-between pr-24">
            <button
              type="button"
              onClick={() => {
                clearTimers();
                playSound('click');
                setGameState('TITLE_MENU');
              }}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-slate-200 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Sair da arena
            </button>

            <div className="font-mono-tabular text-xs font-medium text-slate-400 sm:text-sm">
              Turno {turno} · Nível {getNivelLabel(currentEq.nivel)}
            </div>
          </div>

          {/* TOP-CENTER: BOSS & EQUATION PARCHMENT */}
          <section
            aria-label="Área do Chefe"
            className="flex flex-col items-center justify-center gap-4"
          >
            {/* Boss Status Plaque */}
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#121929]/90 px-4 py-3 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-bold tracking-wide text-amber-200 sm:text-lg">
                    Arquimago de Bhaskara
                  </h2>
                  <p className="text-xs text-slate-400">
                    Fase: {getNivelLabel(activeDifficulty)}
                  </p>
                </div>
                <HeartBar hp={bossHP} label="Arquimago" align="right" />
              </div>
            </div>

            {/* Boss Sprite + Floating Damage */}
            <div className="relative flex items-center justify-center py-1">
              <BossSprite
                anim={bossAnim}
                nivel={currentEq.nivel}
                defeated={bossHP <= 0}
              />

              {floatingDmg && floatingDmg.target === 'boss' && (
                <div
                  key={floatingDmg.id}
                  className={`animate-float-damage font-mono-tabular pointer-events-none absolute top-2 left-1/2 z-20 rounded-md px-2.5 py-1 text-base font-extrabold tracking-tight shadow-lg sm:text-xl ${
                    floatingDmg.tone === 'counter'
                      ? 'bg-amber-500 text-slate-950'
                      : floatingDmg.tone === 'crit'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-400/90 text-slate-950'
                  }`}
                >
                  {floatingDmg.text}
                </div>
              )}
            </div>

            {/* Pergaminho / Painel da Equação */}
            <div className="w-full max-w-2xl rounded-xl border border-amber-500/40 bg-[#161f33] px-5 py-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:px-8 sm:py-5">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-300/85">
                <span>Equação Desafiadora</span>
                <span aria-hidden="true">·</span>
                <span>Nível {getNivelLabel(currentEq.nivel)}</span>
              </div>
              <p
                className="font-mono-tabular mt-1.5 text-2xl font-bold tracking-tight text-amber-100 sm:text-3xl md:text-4xl"
                aria-live="polite"
              >
                {currentEq.equacao}
              </p>
            </div>
          </section>

          {/* BOTTOM GRID: PLAYER (LEFT) & COMMAND PANEL (RIGHT) */}
          <section
            aria-label="Área do Jogador e Comandos"
            className="grid grid-cols-1 items-end gap-5 lg:grid-cols-12"
          >
            {/* Bottom-Left: Player Sprite, Status & Combat Log */}
            <div className="flex flex-col gap-3 lg:col-span-5">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <PlayerSprite anim={playerAnim} />
                  {floatingDmg && floatingDmg.target === 'player' && (
                    <div
                      key={floatingDmg.id}
                      className="animate-float-damage font-mono-tabular pointer-events-none absolute top-1 left-1/2 z-20 rounded-md bg-rose-600 px-2.5 py-1 text-base font-extrabold text-white shadow-lg"
                    >
                      {floatingDmg.text}
                    </div>
                  )}
                </div>

                <div className="flex-1 rounded-xl border border-slate-800 bg-[#121929]/90 px-4 py-3 shadow-lg">
                  <h2 className="font-display text-sm font-bold tracking-wide text-slate-100 sm:text-base">
                    Aprendiz de Bhaskara
                  </h2>
                  <div className="mt-2">
                    <HeartBar hp={playerHP} label="Jogador" />
                  </div>
                </div>
              </div>

              {/* Battle Log (displays latest result + equation hint on error) */}
              {latestLog && (
                <div
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                    latestLog.tone === 'crit'
                      ? 'border-emerald-500/40 bg-emerald-950/35 text-emerald-100'
                      : latestLog.tone === 'counter'
                        ? 'border-amber-400/50 bg-amber-950/40 text-amber-100'
                        : latestLog.tone === 'partial'
                          ? 'border-amber-500/35 bg-amber-950/25 text-amber-100'
                          : latestLog.tone === 'error'
                            ? 'border-rose-500/45 bg-rose-950/40 text-rose-100'
                            : 'border-slate-800 bg-[#111827]/85 text-slate-200'
                  }`}
                >
                  <p className="font-medium">{latestLog.mensagem}</p>
                  {latestLog.dica && (
                    <p className="mt-1.5 text-xs text-slate-300">
                      <span className="font-semibold text-amber-300">
                        Dica ({latestLog.equacao}):
                      </span>{' '}
                      {latestLog.dica}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom-Right: RPG Command Panel */}
            <div className="rounded-xl border border-amber-500/35 bg-[#121929]/95 p-4 shadow-2xl sm:p-5 lg:col-span-7">
              <form onSubmit={handleSubmitRoots} noValidate>
                <div className="flex items-center justify-between gap-2 pb-3">
                  <span className="font-display text-sm font-bold tracking-wide text-amber-200 sm:text-base">
                    Painel de Feitiços
                  </span>
                  <span className="text-xs text-slate-400">
                    Aceita ponto (.) ou vírgula (,)
                  </span>
                </div>

                {/* Top Row: Two side-by-side numeric inputs R1 and R2 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="input-r1"
                      className="mb-1.5 block text-xs font-semibold text-slate-300"
                    >
                      Raiz 1 (R1 · x₁)
                    </label>
                    <input
                      ref={r1Ref}
                      id="input-r1"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      disabled={isResolving || gameState !== 'PLAYING'}
                      value={r1Input}
                      onChange={(e) => {
                        setR1Input(e.target.value);
                        if (inputError) setInputError(null);
                      }}
                      placeholder="Ex: 2"
                      className="font-mono-tabular h-12 w-full rounded-lg border border-slate-700 bg-[#0b101b] px-3.5 text-base font-bold text-slate-100 placeholder:font-normal placeholder:text-slate-500 focus:border-amber-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="input-r2"
                      className="mb-1.5 block text-xs font-semibold text-slate-300"
                    >
                      Raiz 2 (R2 · x₂)
                    </label>
                    <input
                      id="input-r2"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      disabled={isResolving || gameState !== 'PLAYING'}
                      value={r2Input}
                      onChange={(e) => {
                        setR2Input(e.target.value);
                        if (inputError) setInputError(null);
                      }}
                      placeholder="Ex: 3"
                      className="font-mono-tabular h-12 w-full rounded-lg border border-slate-700 bg-[#0b101b] px-3.5 text-base font-bold text-slate-100 placeholder:font-normal placeholder:text-slate-500 focus:border-amber-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {inputError && (
                  <p
                    role="alert"
                    className="mt-2.5 text-xs font-medium text-rose-300"
                  >
                    {inputError}
                  </p>
                )}

                {/* Primary Attack Button */}
                <button
                  type="submit"
                  disabled={isResolving || gameState !== 'PLAYING'}
                  className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-amber-200 whitespace-nowrap shrink-0 sm:text-base"
                >
                  <Swords className="h-4 w-4 sm:h-5 sm:w-5" />
                  Atacar com Raízes
                </button>

                {/* Wide Counter-Spell Button below */}
                <button
                  type="button"
                  onClick={handleCounterSpell}
                  disabled={isResolving || gameState !== 'PLAYING'}
                  className="mt-2.5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-rose-500/50 bg-rose-950/45 px-5 py-3 text-sm font-semibold text-rose-200 transition-colors hover:border-rose-400 hover:bg-rose-900/55 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-rose-300 whitespace-nowrap shrink-0 sm:text-base"
                >
                  <ShieldBan className="h-4 w-4 sm:h-5 sm:w-5" />
                  Não possui Raiz (Δ &lt; 0)
                </button>
              </form>
            </div>
          </section>
        </main>
      )}

      {/* ================= MODALS ================= */}
      <RulesModal open={showRules} onClose={() => setShowRules(false)} />

      {(gameState === 'VICTORY' || gameState === 'GAME_OVER') && (
        <EndGameModal
          outcome={gameState}
          turnos={turno}
          acertosCriticos={acertosCriticos}
          contraFeiticos={contraFeiticos}
          erros={erros}
          onRestart={startBattle}
          onReturnTitle={() => {
            playSound('click');
            setGameState('TITLE_MENU');
          }}
        />
      )}
    </div>
  );
}
