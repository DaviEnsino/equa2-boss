import type { CombatTone, Equacao, ModoJogo, NivelDificuldade } from '../types/game';

const TOLERANCE = 0.05;

export function parseBrazilianNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, '').replace(',', '.');
  if (!cleaned || cleaned === '-' || cleaned === '+' || cleaned === '.') {
    return null;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function approxEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= TOLERANCE;
}

export interface TurnResolution {
  bossDamage: number;
  playerDamage: number;
  hits: 0 | 1 | 2;
  tone: CombatTone;
  mensagem: string;
  showHint: boolean;
}

export function evaluateRootsAttack(
  r1: number,
  r2: number,
  equacao: Equacao
): TurnResolution {
  if (!equacao.tem_raiz_real) {
    return {
      bossDamage: 0,
      playerDamage: 2,
      hits: 0,
      tone: 'error',
      mensagem:
        'Armadilha ativada! Esta equação tem Δ < 0 e não possui raízes reais. O Chefe contra-atacou (-2 PV).',
      showHint: true,
    };
  }

  const [t1, t2] = equacao.raizes;

  const bothMatchDirect = approxEqual(r1, t1) && approxEqual(r2, t2);
  const bothMatchSwapped = approxEqual(r1, t2) && approxEqual(r2, t1);

  if (bothMatchDirect || bothMatchSwapped) {
    return {
      bossDamage: 2,
      playerDamage: 0,
      hits: 2,
      tone: 'crit',
      mensagem: 'Acerto Crítico! Você encontrou as duas raízes (-2 PV no Chefe).',
      showHint: false,
    };
  }

  const anyMatch =
    approxEqual(r1, t1) ||
    approxEqual(r1, t2) ||
    approxEqual(r2, t1) ||
    approxEqual(r2, t2);

  if (anyMatch) {
    return {
      bossDamage: 1,
      playerDamage: 0,
      hits: 1,
      tone: 'partial',
      mensagem:
        'Acerto Parcial! Você acertou apenas uma das raízes (-1 PV no Chefe).',
      showHint: true,
    };
  }

  return {
    bossDamage: 0,
    playerDamage: 2,
    hits: 0,
    tone: 'error',
    mensagem: 'Você errou as raízes! O Chefe contra-atacou (-2 PV).',
    showHint: true,
  };
}

export function evaluateCounterSpell(equacao: Equacao): TurnResolution {
  if (!equacao.tem_raiz_real) {
    return {
      bossDamage: 4,
      playerDamage: 0,
      hits: 2,
      tone: 'counter',
      mensagem:
        'CONTRA-FEITIÇO PERFEITO! Você detectou Δ < 0 e causou dano massivo (-4 PV no Chefe)!',
      showHint: false,
    };
  }

  return {
    bossDamage: 0,
    playerDamage: 2,
    hits: 0,
    tone: 'error',
    mensagem:
      'O contra-feitiço falhou! Essa equação possui raízes reais (-2 PV).',
    showHint: true,
  };
}

export function getTargetDifficulty(bossHP: number, mode: ModoJogo): NivelDificuldade {
  if (mode !== 'dinamico') {
    return mode;
  }
  if (bossHP > 4) return 'facil';
  if (bossHP > 2) return 'medio';
  return 'dificil';
}

export function pickNextEquation(
  allEquations: Equacao[],
  usedIds: number[],
  bossHP: number,
  mode: ModoJogo,
  lastId?: number
): { equation: Equacao; nextUsedIds: number[] } {
  const targetNivel = getTargetDifficulty(bossHP, mode);
  const levelPool = allEquations.filter((eq) => eq.nivel === targetNivel);
  const pool = levelPool.length > 0 ? levelPool : allEquations;

  let candidates = pool.filter((eq) => !usedIds.includes(eq.id));
  let nextUsedIds = [...usedIds];

  if (candidates.length === 0) {
    candidates = pool.filter((eq) => eq.id !== lastId);
    if (candidates.length === 0) {
      candidates = pool;
    }
    const poolIds = new Set(pool.map((eq) => eq.id));
    nextUsedIds = nextUsedIds.filter((id) => !poolIds.has(id));
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  nextUsedIds.push(chosen.id);

  return { equation: chosen, nextUsedIds };
}

export function getNivelLabel(nivel: NivelDificuldade): string {
  switch (nivel) {
    case 'facil':
      return 'Fácil';
    case 'medio':
      return 'Médio';
    case 'dificil':
      return 'Difícil';
  }
}
