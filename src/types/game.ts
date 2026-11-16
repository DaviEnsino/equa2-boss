export type NivelDificuldade = 'facil' | 'medio' | 'dificil';

export type ModoJogo = 'dinamico' | NivelDificuldade;

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'VICTORY' | 'GAME_OVER';

export interface Equacao {
  id: number;
  nivel: NivelDificuldade;
  equacao: string;
  tem_raiz_real: boolean;
  raizes: number[];
  dica: string;
}

export type CombatTone = 'crit' | 'partial' | 'counter' | 'error' | 'info';

export interface CombatLogEntry {
  id: number;
  turno: number;
  mensagem: string;
  dica?: string;
  tone: CombatTone;
  equacao: string;
}

export type SpriteAnim = 'idle' | 'hit' | 'attack';

export interface FloatingDamage {
  id: number;
  target: 'boss' | 'player';
  text: string;
  tone: 'damage' | 'crit' | 'counter' | 'player-hit';
}
