type SoundEffect =
  | 'click'
  | 'crit'
  | 'partial'
  | 'counter'
  | 'hurt'
  | 'victory'
  | 'defeat';

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined' || isMuted) return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioMuted(muted: boolean): void {
  isMuted = muted;
}

export function getAudioMuted(): boolean {
  return isMuted;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = 'triangle',
  volume = 0.12,
  endFreq?: number
) {
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq !== undefined) {
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

export function playSound(effect: SoundEffect): void {
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
