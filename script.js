const MAX_HP = 6;
const TOLERANCE = 0.05;

const FALLBACK_EQUACOES = [
  { id: 1, nivel: 'facil', equacao: 'x² - 5x + 6 = 0', tem_raiz_real: true, raizes: [2, 3], dica: 'Δ = (-5)² - 4(1)(6) = 1' },
  { id: 2, nivel: 'facil', equacao: 'x² - 7x + 10 = 0', tem_raiz_real: true, raizes: [2, 5], dica: 'Δ = (-7)² - 4(1)(10) = 9' },
  { id: 3, nivel: 'facil', equacao: 'x² - 4x + 3 = 0', tem_raiz_real: true, raizes: [1, 3], dica: 'Δ = (-4)² - 4(1)(3) = 4' },
  { id: 4, nivel: 'facil', equacao: 'x² + 2x + 5 = 0', tem_raiz_real: false, raizes: [], dica: 'Δ = 2² - 4(1)(5) = -16 (Contra-feitiço!)' },
  { id: 5, nivel: 'facil', equacao: 'x² + 5x + 6 = 0', tem_raiz_real: true, raizes: [-3, -2], dica: 'Atenção aos sinais: Δ = 25 - 24 = 1' },
  { id: 6, nivel: 'facil', equacao: 'x² - x - 6 = 0', tem_raiz_real: true, raizes: [-2, 3], dica: 'Δ = (-1)² - 4(1)(-6) = 25' },
  { id: 7, nivel: 'facil', equacao: 'x² - 6x + 9 = 0', tem_raiz_real: true, raizes: [3, 3], dica: 'Raiz dupla (Δ = 0): repita o mesmo valor nas duas caixas!' },
  { id: 8, nivel: 'facil', equacao: 'x² + x + 4 = 0', tem_raiz_real: false, raizes: [], dica: 'Δ = 1² - 4(1)(4) = -15 (Contra-feitiço!)' },
  { id: 9, nivel: 'facil', equacao: 'x² - 2x - 8 = 0', tem_raiz_real: true, raizes: [-2, 4], dica: 'Δ = (-2)² - 4(1)(-8) = 36' },
  { id: 10, nivel: 'facil', equacao: 'x² + 3x - 10 = 0', tem_raiz_real: true, raizes: [-5, 2], dica: 'Δ = 3² - 4(1)(-10) = 49' },
  { id: 11, nivel: 'medio', equacao: '2x² - 10x + 12 = 0', tem_raiz_real: true, raizes: [2, 3], dica: 'Cuidado no denominador: 2a = 4 (Δ = 4)' },
  { id: 12, nivel: 'medio', equacao: 'x² - 16 = 0', tem_raiz_real: true, raizes: [-4, 4], dica: 'Equação incompleta: b = 0 e c = -16 (Δ = 64)' },
  { id: 13, nivel: 'medio', equacao: '2x² + 4x + 5 = 0', tem_raiz_real: false, raizes: [], dica: 'Δ = 4² - 4(2)(5) = -24 (Contra-feitiço!)' },
  { id: 14, nivel: 'medio', equacao: 'x² + 6x = 0', tem_raiz_real: true, raizes: [-6, 0], dica: 'Equação incompleta: c = 0, então Δ = 36' },
  { id: 15, nivel: 'medio', equacao: '3x² - 3x - 18 = 0', tem_raiz_real: true, raizes: [-2, 3], dica: 'Δ = (-3)² - 4(3)(-18) = 225 (√225 = 15)' },
  { id: 16, nivel: 'medio', equacao: '-x² + 4x - 3 = 0', tem_raiz_real: true, raizes: [1, 3], dica: 'Atenção ao sinal de a = -1 no denominador (2a = -2)' },
  { id: 17, nivel: 'medio', equacao: 'x² + 9 = 0', tem_raiz_real: false, raizes: [], dica: 'b = 0 e c = 9 -> Δ = 0² - 4(1)(9) = -36 (Contra-feitiço!)' },
  { id: 18, nivel: 'medio', equacao: '2x² + 8x + 8 = 0', tem_raiz_real: true, raizes: [-2, -2], dica: 'Raiz dupla (Δ = 0): repita o valor nas duas caixas!' },
  { id: 19, nivel: 'medio', equacao: '-x² + 2x + 8 = 0', tem_raiz_real: true, raizes: [-2, 4], dica: 'a = -1, b = 2, c = 8 -> Δ = 36' },
  { id: 20, nivel: 'medio', equacao: '3x² - 2x + 4 = 0', tem_raiz_real: false, raizes: [], dica: 'Δ = (-2)² - 4(3)(4) = -44 (Contra-feitiço!)' },
  { id: 21, nivel: 'dificil', equacao: '2x² - 7x + 3 = 0', tem_raiz_real: true, raizes: [0.5, 3], dica: 'Raiz fracionária: Δ = 25. As raízes são 1/2 (ou 0,5) e 3.' },
  { id: 22, nivel: 'dificil', equacao: '3x² - 11x + 10 = 0', tem_raiz_real: true, raizes: [1.667, 2], dica: 'Cuidado com a fração: Δ = 1. Raízes: 5/3 (aprox. 1,67) e 2.' },
  { id: 23, nivel: 'dificil', equacao: 'x² - 3x + 4 = 0', tem_raiz_real: false, raizes: [], dica: 'Δ = (-3)² - 4(1)(4) = -7 (Contra-feitiço!)' },
  { id: 24, nivel: 'dificil', equacao: '4x² - 4x + 1 = 0', tem_raiz_real: true, raizes: [0.5, 0.5], dica: 'Raiz dupla perfeita (Δ = 0): as duas raízes são 1/2 (0,5).' },
  { id: 25, nivel: 'dificil', equacao: 'x² - 5x = -6', tem_raiz_real: true, raizes: [2, 3], dica: 'Atenção: jogue o -6 para o lado esquerdo antes de começar! (x² - 5x + 6 = 0)' },
  { id: 26, nivel: 'dificil', equacao: '2x² + 5x - 3 = 0', tem_raiz_real: true, raizes: [-3, 0.5], dica: 'Δ = 49. Cuidado com o jogo de sinais nas raízes (-3 e 1/2).' },
  { id: 27, nivel: 'dificil', equacao: '-2x² + 3x - 2 = 0', tem_raiz_real: false, raizes: [], dica: 'a = -2, b = 3, c = -2 -> Δ = 9 - 16 = -7 (Contra-feitiço!)' },
  { id: 28, nivel: 'dificil', equacao: '3x² = 10x - 3', tem_raiz_real: true, raizes: [0.333, 3], dica: 'Organize a casa: passe tudo para o lado esquerdo (3x² - 10x + 3 = 0).' },
  { id: 29, nivel: 'dificil', equacao: '5x² - 7x + 2 = 0', tem_raiz_real: true, raizes: [0.4, 1], dica: 'Δ = 9. Raízes: 2/5 (0,4) e 1.' },
  { id: 30, nivel: 'dificil', equacao: '4x² + 2x + 3 = 0', tem_raiz_real: false, raizes: [], dica: 'Δ = 2² - 4(4)(3) = 4 - 48 = -44 (Contra-feitiço!)' },
];

const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

const state = {
  equations: [...FALLBACK_EQUACOES],
  screen: 'TITLE',
  modo: 'dinamico',
  playerHP: MAX_HP,
  bossHP: MAX_HP,
  currentEq: FALLBACK_EQUACOES[0],
  usedIds: [],
  turno: 1,
  isResolving: false,
  muted: false,
  acertosCriticos: 0,
  contraFeiticos: 0,
  erros: 0,
  timers: [],
};

// Elementos do DOM
const el = {
  startScreen: document.getElementById('start-screen'),
  battleScreen: document.getElementById('battle-screen'),
  btnStart: document.getElementById('btn-start'),
  btnExit: document.getElementById('btn-exit'),
  btnMute: document.getElementById('btn-mute'),
  iconSoundOn: document.getElementById('icon-sound-on'),
  iconSoundOff: document.getElementById('icon-sound-off'),
  btnInfo: document.getElementById('btn-info'),
  rulesModal: document.getElementById('rules-modal'),
  btnCloseRules: document.getElementById('btn-close-rules'),
  btnRulesOk: document.getElementById('btn-rules-ok'),
  difficultyButtons: Array.from(document.querySelectorAll('.diff-btn')),
  difficultyDesc: document.getElementById('difficulty-desc'),
  turnIndicator: document.getElementById('turn-indicator'),
  bossPhaseLabel: document.getElementById('boss-phase-label'),
  bossHearts: document.getElementById('boss-hearts'),
  bossHpText: document.getElementById('boss-hp-text'),
  playerHearts: document.getElementById('player-hearts'),
  playerHpText: document.getElementById('player-hp-text'),
  bossSpriteWrap: document.getElementById('boss-sprite-wrap'),
  playerSpriteWrap: document.getElementById('player-sprite-wrap'),
  bossFloatDmg: document.getElementById('boss-float-dmg'),
  playerFloatDmg: document.getElementById('player-float-dmg'),
  equationMeta: document.getElementById('equation-meta'),
  equationText: document.getElementById('equation-text'),
  battleLog: document.getElementById('battle-log'),
  logMessage: document.getElementById('log-message'),
  logHint: document.getElementById('log-hint'),
  commandForm: document.getElementById('command-form'),
  inputR1: document.getElementById('input-r1'),
  inputR2: document.getElementById('input-r2'),
  inputError: document.getElementById('input-error'),
  btnAttack: document.getElementById('btn-attack'),
  btnCounter: document.getElementById('btn-counter'),
  endgameModal: document.getElementById('endgame-modal'),
  endgameCard: document.getElementById('endgame-card'),
  endgameBadge: document.getElementById('endgame-badge'),
  endgameTitle: document.getElementById('endgame-title'),
  endgameDesc: document.getElementById('endgame-desc'),
  statTurnos: document.getElementById('stat-turnos'),
  statCriticos: document.getElementById('stat-criticos'),
  statContra: document.getElementById('stat-contra'),
  statErros: document.getElementById('stat-erros'),
  btnRestart: document.getElementById('btn-restart'),
  btnReturnTitle: document.getElementById('btn-return-title'),
  btnInstall: document.getElementById('btn-install'),
  iosInstallModal: document.getElementById('ios-install-modal'),
  btnCloseIosInstall: document.getElementById('btn-close-ios-install'),
  offlineBadge: document.getElementById('offline-badge'),
};

// ================= ÁUDIO (Web Audio API) =================
let audioCtx = null;

function getAudioContext() {
  if (state.muted) return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(ctx, freq, offset, duration, type = 'triangle', volume = 0.12, endFreq = null) {
  const now = ctx.currentTime + offset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq !== null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
  }
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playSound(effect) {
  const ctx = getAudioContext();
  if (!ctx) return;

  switch (effect) {
    case 'click':
      playTone(ctx, 520, 0, 0.06, 'sine', 0.07, 640);
      break;
    case 'partial':
      playTone(ctx, 440, 0, 0.11, 'triangle', 0.11);
      playTone(ctx, 554.37, 0.08, 0.16, 'triangle', 0.1);
      break;
    case 'crit':
      playTone(ctx, 440, 0, 0.1, 'triangle', 0.12);
      playTone(ctx, 554.37, 0.07, 0.12, 'triangle', 0.12);
      playTone(ctx, 659.25, 0.14, 0.22, 'sawtooth', 0.09);
      break;
    case 'counter':
      playTone(ctx, 220, 0, 0.14, 'sawtooth', 0.1, 140);
      playTone(ctx, 523.25, 0.08, 0.16, 'triangle', 0.13);
      playTone(ctx, 659.25, 0.16, 0.18, 'triangle', 0.13);
      playTone(ctx, 783.99, 0.24, 0.34, 'sine', 0.15);
      break;
    case 'hurt':
      playTone(ctx, 185, 0, 0.18, 'sawtooth', 0.12, 82);
      playTone(ctx, 130, 0.08, 0.24, 'square', 0.07, 65);
      break;
    case 'victory':
      playTone(ctx, 523.25, 0, 0.14, 'triangle', 0.12);
      playTone(ctx, 659.25, 0.12, 0.14, 'triangle', 0.12);
      playTone(ctx, 783.99, 0.24, 0.16, 'triangle', 0.13);
      playTone(ctx, 1046.5, 0.38, 0.48, 'triangle', 0.15);
      break;
    case 'defeat':
      playTone(ctx, 329.63, 0, 0.2, 'sawtooth', 0.09);
      playTone(ctx, 293.66, 0.2, 0.2, 'sawtooth', 0.09);
      playTone(ctx, 246.94, 0.4, 0.45, 'triangle', 0.11, 164.81);
      break;
  }
}

// ================= UTILIDADES E MATEMÁTICA =================
function clearAllTimers() {
  state.timers.forEach((id) => window.clearTimeout(id));
  state.timers = [];
}

function scheduleTimer(fn, ms) {
  const id = window.setTimeout(fn, ms);
  state.timers.push(id);
  return id;
}

function getNivelLabel(nivel) {
  if (nivel === 'facil') return 'Fácil';
  if (nivel === 'medio') return 'Médio';
  return 'Difícil';
}

function getTargetDifficulty(bossHP, mode) {
  if (mode !== 'dinamico') return mode;
  if (bossHP > 4) return 'facil';
  if (bossHP > 2) return 'medio';
  return 'dificil';
}

function parseBrazilianNumber(raw) {
  const cleaned = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
  if (!cleaned || cleaned === '-' || cleaned === '+' || cleaned === '.') {
    return null;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function approxEqual(a, b) {
  return Math.abs(a - b) <= TOLERANCE;
}

function evaluateRootsAttack(r1, r2, eq) {
  if (!eq.tem_raiz_real) {
    return {
      bossDamage: 0,
      playerDamage: 2,
      tone: 'error',
      mensagem:
        'Armadilha ativada! Esta equação tem Δ < 0 e não possui raízes reais. O Chefe contra-atacou (-2 PV).',
      showHint: true,
    };
  }

  const [t1, t2] = eq.raizes;
  const matchDirect = approxEqual(r1, t1) && approxEqual(r2, t2);
  const matchSwapped = approxEqual(r1, t2) && approxEqual(r2, t1);

  if (matchDirect || matchSwapped) {
    return {
      bossDamage: 2,
      playerDamage: 0,
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
      tone: 'partial',
      mensagem: 'Acerto Parcial! Você acertou apenas uma das raízes (-1 PV no Chefe).',
      showHint: true,
    };
  }

  return {
    bossDamage: 0,
    playerDamage: 2,
    tone: 'error',
    mensagem: 'Você errou as raízes! O Chefe contra-atacou (-2 PV).',
    showHint: true,
  };
}

function evaluateCounterSpell(eq) {
  if (!eq.tem_raiz_real) {
    return {
      bossDamage: 4,
      playerDamage: 0,
      tone: 'counter',
      mensagem:
        'CONTRA-FEITIÇO PERFEITO! Você detectou Δ < 0 e causou dano massivo (-4 PV no Chefe)!',
      showHint: false,
    };
  }

  return {
    bossDamage: 0,
    playerDamage: 2,
    tone: 'error',
    mensagem: 'O contra-feitiço falhou! Essa equação possui raízes reais (-2 PV).',
    showHint: true,
  };
}

function pickNextEquation(lastId = null) {
  const targetNivel = getTargetDifficulty(state.bossHP, state.modo);
  const levelPool = state.equations.filter((eq) => eq.nivel === targetNivel);
  const pool = levelPool.length > 0 ? levelPool : state.equations;

  let candidates = pool.filter((eq) => !state.usedIds.includes(eq.id));

  if (candidates.length === 0) {
    candidates = pool.filter((eq) => eq.id !== lastId);
    if (candidates.length === 0) {
      candidates = pool;
    }
    const poolIds = new Set(pool.map((eq) => eq.id));
    state.usedIds = state.usedIds.filter((id) => !poolIds.has(id));
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  state.usedIds.push(chosen.id);
  return chosen;
}

// ================= RENDERIZAÇÃO DE UI =================
function createHeartSVG(heartState, clipId) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', `heart-svg ${heartState === 'empty' ? 'is-empty' : ''}`);

  if (heartState === 'half') {
    const defs = document.createElementNS(svgNS, 'defs');
    const clip = document.createElementNS(svgNS, 'clipPath');
    clip.setAttribute('id', clipId);
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', '12');
    rect.setAttribute('height', '24');
    clip.appendChild(rect);
    defs.appendChild(clip);
    svg.appendChild(defs);
  }

  const basePath = document.createElementNS(svgNS, 'path');
  basePath.setAttribute('d', HEART_PATH);
  basePath.setAttribute('fill', '#1e293b');
  basePath.setAttribute('stroke', '#475569');
  basePath.setAttribute('stroke-width', '1.5');
  svg.appendChild(basePath);

  if (heartState === 'full') {
    const fullPath = document.createElementNS(svgNS, 'path');
    fullPath.setAttribute('d', HEART_PATH);
    fullPath.setAttribute('fill', '#dc2626');
    fullPath.setAttribute('stroke', '#fbbf24');
    fullPath.setAttribute('stroke-width', '1.15');
    svg.appendChild(fullPath);
  } else if (heartState === 'half') {
    const halfFill = document.createElementNS(svgNS, 'path');
    halfFill.setAttribute('d', HEART_PATH);
    halfFill.setAttribute('fill', '#dc2626');
    halfFill.setAttribute('clip-path', `url(#${clipId})`);
    svg.appendChild(halfFill);

    const halfStroke = document.createElementNS(svgNS, 'path');
    halfStroke.setAttribute('d', HEART_PATH);
    halfStroke.setAttribute('fill', 'none');
    halfStroke.setAttribute('stroke', '#fbbf24');
    halfStroke.setAttribute('stroke-width', '1.15');
    svg.appendChild(halfStroke);
  }

  return svg;
}

function renderHearts(containerEl, textEl, hp, labelPrefix) {
  const safeHp = Math.max(0, Math.min(MAX_HP, hp));
  const totalHearts = Math.ceil(MAX_HP / 2);
  containerEl.innerHTML = '';
  containerEl.setAttribute('aria-label', `${labelPrefix}: ${safeHp} de ${MAX_HP} pontos de vida`);

  for (let i = 0; i < totalHearts; i += 1) {
    const heartHp = Math.max(0, Math.min(2, safeHp - i * 2));
    const heartState = heartHp === 2 ? 'full' : heartHp === 1 ? 'half' : 'empty';
    const clipId = `heart-${labelPrefix}-${i}`;
    containerEl.appendChild(createHeartSVG(heartState, clipId));
  }

  textEl.textContent = `${safeHp}/${MAX_HP} PV`;
}

function updateHUD() {
  renderHearts(el.bossHearts, el.bossHpText, state.bossHP, 'Arquimago');
  renderHearts(el.playerHearts, el.playerHpText, state.playerHP, 'Jogador');

  const nivelLabel = getNivelLabel(state.currentEq.nivel);
  const phaseLabel = getNivelLabel(getTargetDifficulty(state.bossHP, state.modo));

  el.turnIndicator.textContent = `Turno ${state.turno} · Nível ${nivelLabel}`;
  el.bossPhaseLabel.textContent = `Fase: ${phaseLabel}`;
  el.equationMeta.textContent = `Equação Desafiadora · Nível ${nivelLabel}`;
  el.equationText.textContent = state.currentEq.equacao;

  el.bossSpriteWrap.setAttribute('data-nivel', state.currentEq.nivel);
  el.bossSpriteWrap.classList.toggle('is-defeated', state.bossHP <= 0);
}

function setControlsDisabled(disabled) {
  el.inputR1.disabled = disabled;
  el.inputR2.disabled = disabled;
  el.btnAttack.disabled = disabled;
  el.btnCounter.disabled = disabled;
}

function showInputError(msg) {
  if (!msg) {
    el.inputError.classList.add('hidden');
    el.inputError.textContent = '';
    return;
  }
  el.inputError.textContent = msg;
  el.inputError.classList.remove('hidden');
}

function updateBattleLog(mensagem, tone, dica = null, equacaoTexto = '') {
  el.battleLog.className = `battle-log tone-${tone}`;
  el.logMessage.textContent = mensagem;

  if (dica) {
    el.logHint.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = `Dica (${equacaoTexto}): `;
    el.logHint.appendChild(strong);
    el.logHint.appendChild(document.createTextNode(dica));
    el.logHint.classList.remove('hidden');
  } else {
    el.logHint.textContent = '';
    el.logHint.classList.add('hidden');
  }
}

function triggerSpriteAnimations(bossDamage, playerDamage) {
  el.bossSpriteWrap.classList.remove('anim-idle-boss', 'anim-hit-shake', 'anim-boss-attack');
  el.playerSpriteWrap.classList.remove('anim-idle-player', 'anim-hit-shake', 'anim-player-attack');

  // Força reflow para reiniciar animações CSS
  void el.bossSpriteWrap.offsetWidth;

  if (bossDamage > 0) {
    el.playerSpriteWrap.classList.add('anim-player-attack');
    el.bossSpriteWrap.classList.add('anim-hit-shake');

    el.bossFloatDmg.className = 'float-damage';
    if (bossDamage === 4) {
      el.bossFloatDmg.textContent = '-4 PV CRÍTICO!';
      el.bossFloatDmg.classList.add('tone-counter');
    } else if (bossDamage === 2) {
      el.bossFloatDmg.textContent = '-2 PV';
      el.bossFloatDmg.classList.add('tone-crit');
    } else {
      el.bossFloatDmg.textContent = '-1 PV';
      el.bossFloatDmg.classList.add('tone-damage');
    }
  } else {
    el.bossSpriteWrap.classList.add('anim-boss-attack');
    el.playerSpriteWrap.classList.add('anim-hit-shake');

    el.playerFloatDmg.className = 'float-damage tone-player-hit';
    el.playerFloatDmg.textContent = `-${playerDamage} PV`;
  }
}

function resetSpriteAnimations() {
  el.bossSpriteWrap.classList.remove('anim-hit-shake', 'anim-boss-attack');
  el.bossSpriteWrap.classList.add('anim-idle-boss');

  el.playerSpriteWrap.classList.remove('anim-hit-shake', 'anim-player-attack');
  el.playerSpriteWrap.classList.add('anim-idle-player');

  el.bossFloatDmg.classList.add('hidden');
  el.playerFloatDmg.classList.add('hidden');
}

// ================= FLUXO DO JOGO =================
function openEndgameModal(outcome) {
  const isVictory = outcome === 'VICTORY';
  state.screen = outcome;

  el.endgameCard.classList.toggle('is-defeat', !isVictory);
  el.endgameBadge.classList.toggle('is-defeat', !isVictory);
  el.endgameBadge.textContent = isVictory ? '🏆' : '🛡️';

  el.endgameTitle.classList.toggle('is-defeat', !isVictory);
  el.endgameTitle.textContent = isVictory ? 'Vitória na Arena!' : 'Derrota na Arena';

  el.endgameDesc.textContent = isVictory
    ? 'Você derrotou o Arquimago de Bhaskara e provou domínio sobre o discriminante e as raízes reais.'
    : 'O Arquimago superou sua guarda desta vez. Revise o valor de Δ = b² - 4ac nos erros e volte mais forte!';

  el.statTurnos.textContent = String(state.turno);
  el.statCriticos.textContent = String(state.acertosCriticos);
  el.statContra.textContent = String(state.contraFeiticos);
  el.statErros.textContent = String(state.erros);

  el.btnRestart.classList.toggle('is-defeat', !isVictory);
  el.btnRestart.textContent = isVictory ? 'Jogar Novamente' : 'Tentar Novamente';

  el.endgameModal.classList.remove('hidden');
}

function applyTurnOutcome(resolution, wasCounterSpell) {
  state.isResolving = true;
  setControlsDisabled(true);
  showInputError(null);

  const nextBossHP = Math.max(0, state.bossHP - resolution.bossDamage);
  const nextPlayerHP = Math.max(0, state.playerHP - resolution.playerDamage);

  if (resolution.bossDamage === 4 && wasCounterSpell) {
    state.contraFeiticos += 1;
  } else if (resolution.bossDamage === 2) {
    state.acertosCriticos += 1;
  } else if (resolution.playerDamage > 0) {
    state.erros += 1;
  }

  if (resolution.bossDamage === 4) {
    playSound('counter');
  } else if (resolution.bossDamage === 2) {
    playSound('crit');
  } else if (resolution.bossDamage === 1) {
    playSound('partial');
  } else {
    playSound('hurt');
  }

  state.bossHP = nextBossHP;
  state.playerHP = nextPlayerHP;

  triggerSpriteAnimations(resolution.bossDamage, resolution.playerDamage);
  updateHUD();
  updateBattleLog(
    resolution.mensagem,
    resolution.tone,
    resolution.showHint ? state.currentEq.dica : null,
    state.currentEq.equacao
  );

  scheduleTimer(() => {
    resetSpriteAnimations();

    if (nextBossHP <= 0) {
      playSound('victory');
      state.isResolving = false;
      openEndgameModal('VICTORY');
      return;
    }

    if (nextPlayerHP <= 0) {
      playSound('defeat');
      state.isResolving = false;
      openEndgameModal('GAME_OVER');
      return;
    }

    state.currentEq = pickNextEquation(state.currentEq.id);
    state.turno += 1;
    state.isResolving = false;

    el.inputR1.value = '';
    el.inputR2.value = '';
    setControlsDisabled(false);
    updateHUD();

    scheduleTimer(() => {
      el.inputR1.focus();
    }, 40);
  }, 650);
}

function startBattle() {
  clearAllTimers();
  playSound('click');

  state.playerHP = MAX_HP;
  state.bossHP = MAX_HP;
  state.usedIds = [];
  state.turno = 1;
  state.isResolving = false;
  state.acertosCriticos = 0;
  state.contraFeiticos = 0;
  state.erros = 0;
  state.currentEq = pickNextEquation();
  state.screen = 'PLAYING';

  el.inputR1.value = '';
  el.inputR2.value = '';
  showInputError(null);
  setControlsDisabled(false);
  resetSpriteAnimations();
  el.endgameModal.classList.add('hidden');

  updateHUD();
  updateBattleLog(
    'O Arquimago bloqueou seu caminho! Resolva as raízes ou lance um contra-feitiço se Δ < 0.',
    'info'
  );

  el.startScreen.classList.add('hidden');
  el.battleScreen.classList.remove('hidden');

  scheduleTimer(() => {
    el.inputR1.focus();
  }, 60);
}

function returnToTitle() {
  clearAllTimers();
  playSound('click');
  state.screen = 'TITLE';
  el.endgameModal.classList.add('hidden');
  el.battleScreen.classList.add('hidden');
  el.startScreen.classList.remove('hidden');
}

function toggleRulesModal(forceState = null) {
  const willOpen = forceState !== null ? forceState : el.rulesModal.classList.contains('hidden');
  el.rulesModal.classList.toggle('hidden', !willOpen);
}

function toggleMute() {
  state.muted = !state.muted;
  el.iconSoundOn.classList.toggle('hidden', state.muted);
  el.iconSoundOff.classList.toggle('hidden', !state.muted);
  el.btnMute.setAttribute('aria-label', state.muted ? 'Ativar som' : 'Silenciar som');
}

// ================= OFFLINE / PWA =================
let deferredInstallPrompt = null;

function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isIOSDevice() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function updateOnlineIndicator() {
  if (!el.offlineBadge) return;
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  el.offlineBadge.classList.toggle('hidden', !offline);
}

function initPWA() {
  updateOnlineIndicator();
  window.addEventListener('online', updateOnlineIndicator);
  window.addEventListener('offline', updateOnlineIndicator);

  if (window.location.protocol !== 'file:' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  if (isStandaloneMode()) return;

  if (isIOSDevice() && el.btnInstall) {
    el.btnInstall.classList.remove('hidden');
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (el.btnInstall) {
      el.btnInstall.classList.remove('hidden');
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (el.btnInstall) {
      el.btnInstall.classList.add('hidden');
    }
  });

  if (el.btnInstall) {
    el.btnInstall.addEventListener('click', async () => {
      playSound('click');
      if (deferredInstallPrompt) {
        await deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          deferredInstallPrompt = null;
          el.btnInstall.classList.add('hidden');
        }
      } else if (isIOSDevice() && el.iosInstallModal) {
        el.iosInstallModal.classList.remove('hidden');
      }
    });
  }

  if (el.btnCloseIosInstall && el.iosInstallModal) {
    el.btnCloseIosInstall.addEventListener('click', () => {
      el.iosInstallModal.classList.add('hidden');
    });
    el.iosInstallModal.addEventListener('click', (e) => {
      if (e.target === el.iosInstallModal) {
        el.iosInstallModal.classList.add('hidden');
      }
    });
  }
}

// ================= EVENTOS E INICIALIZAÇÃO =================
async function loadEquations() {
  if (window.location.protocol === 'file:') {
    return;
  }
  try {
    const response = await fetch('./equacoes.json');
    if (!response.ok) return;
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      state.equations = data;
    }
  } catch {
    // Fallback embutido já carregado em state.equations
  }
}

el.difficultyButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    playSound('click');
    const mode = btn.getAttribute('data-mode') || 'dinamico';
    state.modo = mode;

    el.difficultyButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', String(active));
    });

    el.difficultyDesc.textContent =
      mode === 'dinamico'
        ? 'Recomendado: o nível sobe automaticamente (Fácil → Médio → Difícil) conforme a vida do Chefe cai.'
        : `Modo fixo: todas as equações sorteadas serão do nível ${getNivelLabel(mode)}.`;
  });
});

el.btnStart.addEventListener('click', startBattle);
el.btnExit.addEventListener('click', returnToTitle);
el.btnRestart.addEventListener('click', startBattle);
el.btnReturnTitle.addEventListener('click', returnToTitle);

el.btnMute.addEventListener('click', toggleMute);
el.btnInfo.addEventListener('click', () => {
  playSound('click');
  toggleRulesModal(true);
});
el.btnCloseRules.addEventListener('click', () => toggleRulesModal(false));
el.btnRulesOk.addEventListener('click', () => toggleRulesModal(false));
el.rulesModal.addEventListener('click', (e) => {
  if (e.target === el.rulesModal) {
    toggleRulesModal(false);
  }
});

el.inputR1.addEventListener('input', () => showInputError(null));
el.inputR2.addEventListener('input', () => showInputError(null));

el.commandForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (state.isResolving || state.screen !== 'PLAYING') return;

  const r1 = parseBrazilianNumber(el.inputR1.value);
  const r2 = parseBrazilianNumber(el.inputR2.value);

  if (r1 === null || r2 === null) {
    showInputError(
      'Preencha R1 e R2 com números válidos (ex: -2 ou 0,5). Para raiz dupla, repita o mesmo valor.'
    );
    return;
  }

  const resolution = evaluateRootsAttack(r1, r2, state.currentEq);
  applyTurnOutcome(resolution, false);
});

el.btnCounter.addEventListener('click', () => {
  if (state.isResolving || state.screen !== 'PLAYING') return;
  const resolution = evaluateCounterSpell(state.currentEq);
  applyTurnOutcome(resolution, true);
});

window.addEventListener('keydown', (e) => {
  const tag = document.activeElement?.tagName;
  const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

  if (e.key === 'Escape' && !el.rulesModal.classList.contains('hidden')) {
    toggleRulesModal(false);
    return;
  }

  if (state.screen === 'TITLE' && el.rulesModal.classList.contains('hidden') && !isInput) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startBattle();
      return;
    }
  }

  if (!isInput) {
    if (e.key.toLowerCase() === 'i') {
      e.preventDefault();
      toggleRulesModal();
    } else if (e.key.toLowerCase() === 'm') {
      e.preventDefault();
      toggleMute();
    }
  }
});

initPWA();
void loadEquations();
