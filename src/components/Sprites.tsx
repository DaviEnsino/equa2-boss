import React from 'react';
import type { NivelDificuldade, SpriteAnim } from '../types/game';

interface BossSpriteProps {
  anim: SpriteAnim;
  nivel: NivelDificuldade;
  defeated?: boolean;
}

export const BossSprite: React.FC<BossSpriteProps> = ({
  anim,
  nivel,
  defeated = false,
}) => {
  const animClass = defeated
    ? 'opacity-25 scale-90 transition-all duration-500'
    : anim === 'hit'
      ? 'animate-hit-shake'
      : anim === 'attack'
        ? 'animate-boss-attack'
        : 'animate-idle-boss';

  const auraColor =
    nivel === 'dificil'
      ? '#ef4444'
      : nivel === 'medio'
        ? '#f97316'
        : '#eab308';

  const eyeColor =
    nivel === 'dificil'
      ? '#fca5a5'
      : nivel === 'medio'
        ? '#fdba74'
        : '#fde047';

  return (
    <div className={`relative flex items-center justify-center select-none ${animClass}`}>
      {/* Rotating arcane delta circle behind boss */}
      <svg
        viewBox="0 0 220 220"
        className="animate-rune-spin pointer-events-none absolute h-44 w-44 opacity-30 sm:h-52 sm:w-52"
        aria-hidden="true"
      >
        <circle
          cx="110"
          cy="110"
          r="98"
          fill="none"
          stroke={auraColor}
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />
        <circle
          cx="110"
          cy="110"
          r="80"
          fill="none"
          stroke={auraColor}
          strokeWidth="0.9"
        />
        <polygon
          points="110,20 188,155 32,155"
          fill="none"
          stroke={auraColor}
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>

      {/* Main Boss SVG */}
      <svg
        viewBox="0 0 200 200"
        className="relative z-10 h-36 w-36 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)] sm:h-44 sm:w-44"
        role="img"
        aria-label="Arquimago de Bhaskara, o chefe da arena"
      >
        <defs>
          <radialGradient id="bossGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={auraColor} stopOpacity="0.32" />
            <stop offset="100%" stopColor={auraColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="robeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>

        {/* Ambient aura */}
        <circle cx="100" cy="95" r="85" fill="url(#bossGlow)" />

        {/* Shadow under floating boss */}
        <ellipse cx="100" cy="186" rx="46" ry="8" fill="#020617" opacity="0.65" />

        {/* Floating spectral cloak & shoulders */}
        <path
          d="M52 172 C48 134, 58 92, 74 78 L126 78 C142 92, 152 134, 148 172 L130 162 L116 176 L100 164 L84 176 L70 162 Z"
          fill="url(#robeGrad)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Golden shoulder pauldrons */}
        <path
          d="M58 96 Q76 74 96 86 L84 108 Q64 110 58 96 Z"
          fill="#1e293b"
          stroke="url(#goldTrim)"
          strokeWidth="2.5"
        />
        <path
          d="M142 96 Q124 74 104 86 L116 108 Q136 110 142 96 Z"
          fill="#1e293b"
          stroke="url(#goldTrim)"
          strokeWidth="2.5"
        />

        {/* Chest Delta Mantle Emblem */}
        <polygon
          points="100,98 113,122 87,122"
          fill="#0f172a"
          stroke="url(#goldTrim)"
          strokeWidth="2.2"
        />
        <polygon points="100,105 107,118 93,118" fill={auraColor} opacity="0.8" />

        {/* Hood & Horns */}
        <path
          d="M72 78 C72 42, 128 42, 128 78 L118 92 L82 92 Z"
          fill="#0f172a"
          stroke="url(#goldTrim)"
          strokeWidth="2.2"
        />
        {/* Crown spikes / horns */}
        <path
          d="M78 52 L64 26 L86 44 Z"
          fill="url(#goldTrim)"
        />
        <path
          d="M122 52 L136 26 L114 44 Z"
          fill="url(#goldTrim)"
        />
        <path
          d="M100 44 L94 22 L100 28 L106 22 Z"
          fill="url(#goldTrim)"
        />

        {/* Face shadow inside hood */}
        <ellipse cx="100" cy="68" rx="19" ry="18" fill="#020617" />

        {/* Glowing eyes */}
        <path d="M87 65 L95 68 L88 71 Z" fill={eyeColor} />
        <path d="M113 65 L105 68 L112 71 Z" fill={eyeColor} />

        {/* Staff on right hand */}
        <line
          x1="158"
          y1="44"
          x2="152"
          y2="174"
          stroke="url(#goldTrim)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <polygon
          points="158,20 172,44 144,44"
          fill="#0f172a"
          stroke="url(#goldTrim)"
          strokeWidth="2.5"
        />
        <circle cx="158" cy="36" r="5" fill={auraColor} />

        {/* Left hand casting arcane orb */}
        <circle cx="44" cy="112" r="11" fill={auraColor} opacity="0.22" />
        <circle
          cx="44"
          cy="112"
          r="6"
          fill={eyeColor}
          stroke={auraColor}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

interface PlayerSpriteProps {
  anim: SpriteAnim;
}

export const PlayerSprite: React.FC<PlayerSpriteProps> = ({ anim }) => {
  const animClass =
    anim === 'hit'
      ? 'animate-hit-shake'
      : anim === 'attack'
        ? 'animate-player-attack'
        : 'animate-idle-player';

  return (
    <div className={`relative flex items-center justify-center select-none ${animClass}`}>
      <svg
        viewBox="0 0 180 180"
        className="h-28 w-28 drop-shadow-[0_10px_18px_rgba(0,0,0,0.65)] sm:h-36 sm:w-36"
        role="img"
        aria-label="Aprendiz de Bhaskara, o jogador"
      >
        <defs>
          <linearGradient id="heroCloak" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="heroGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="86" cy="166" rx="44" ry="8" fill="#020617" opacity="0.65" />

        {/* Arcane staff held forward toward boss */}
        <line
          x1="138"
          y1="26"
          x2="118"
          y2="162"
          stroke="#92400e"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="139" cy="24" r="12" fill="#f59e0b" opacity="0.22" />
        <polygon
          points="139,12 148,28 130,28"
          fill="#0f172a"
          stroke="url(#heroGold)"
          strokeWidth="2.2"
        />
        <circle cx="139" cy="23" r="4" fill="#fef08a" />

        {/* Back-view cape & shoulders */}
        <path
          d="M44 162 L56 84 C62 72, 108 72, 114 84 L126 162 L104 155 L86 166 L68 155 Z"
          fill="url(#heroCloak)"
          stroke="url(#heroGold)"
          strokeWidth="2"
        />

        {/* Golden cloak trim & clasp */}
        <path
          d="M62 84 Q85 96 108 84"
          fill="none"
          stroke="url(#heroGold)"
          strokeWidth="3"
        />

        {/* Back of hood */}
        <path
          d="M64 82 C62 46, 108 46, 106 82 L85 92 Z"
          fill="#172554"
          stroke="url(#heroGold)"
          strokeWidth="2"
        />
        {/* Hood peak */}
        <path d="M85 48 L79 38 L91 44 Z" fill="#172554" stroke="url(#heroGold)" strokeWidth="1.5" />

        {/* Floating open grimoire in left hand */}
        <g transform="translate(22, 92) rotate(-10)">
          <path
            d="M4 10 L22 4 L22 30 L4 34 Z"
            fill="#f8fafc"
            stroke="#d97706"
            strokeWidth="2"
          />
          <path
            d="M22 4 L40 10 L40 34 L22 30 Z"
            fill="#e2e8f0"
            stroke="#d97706"
            strokeWidth="2"
          />
          <line x1="8" y1="15" x2="18" y2="12" stroke="#475569" strokeWidth="1.4" />
          <line x1="8" y1="21" x2="18" y2="18" stroke="#475569" strokeWidth="1.4" />
          <line x1="26" y1="12" x2="36" y2="15" stroke="#475569" strokeWidth="1.4" />
          <line x1="26" y1="18" x2="36" y2="21" stroke="#475569" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
};

export const TitleEmblem: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    className="h-20 w-20 drop-shadow-[0_6px_18px_rgba(217,119,6,0.35)] sm:h-24 sm:w-24"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="54" fill="#0f172a" stroke="url(#crestGold)" strokeWidth="2.5" />
    <circle cx="60" cy="60" r="46" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
    {/* Crossed staves */}
    <line x1="26" y1="92" x2="94" y2="28" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    <line x1="94" y1="92" x2="26" y2="28" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    {/* Central Delta */}
    <polygon
      points="60,24 90,80 30,80"
      fill="#1e293b"
      stroke="url(#crestGold)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <polygon
      points="60,40 76,71 44,71"
      fill="#dc2626"
      opacity="0.85"
    />
  </svg>
);
