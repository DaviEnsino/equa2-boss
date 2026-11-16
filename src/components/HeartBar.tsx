import React from 'react';

interface HeartBarProps {
  hp: number;
  maxHp?: number;
  label: string;
  align?: 'left' | 'right';
}

const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export const HeartBar: React.FC<HeartBarProps> = ({
  hp,
  maxHp = 6,
  label,
  align = 'left',
}) => {
  const safeHp = Math.max(0, Math.min(maxHp, hp));
  const totalHearts = Math.ceil(maxHp / 2);

  return (
    <div
      className={`flex items-center gap-3 ${
        align === 'right' ? 'justify-end' : 'justify-start'
      }`}
      role="status"
      aria-label={`${label}: ${safeHp} de ${maxHp} pontos de vida`}
    >
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: totalHearts }).map((_, idx) => {
          const heartHp = Math.max(0, Math.min(2, safeHp - idx * 2));
          const state: 'full' | 'half' | 'empty' =
            heartHp === 2 ? 'full' : heartHp === 1 ? 'half' : 'empty';
          const clipId = `heart-half-${label.replace(/\s+/g, '-')}-${idx}`;

          return (
            <svg
              key={idx}
              viewBox="0 0 24 24"
              className={`h-6 w-6 transition-transform duration-200 sm:h-7 sm:w-7 ${
                state === 'empty' ? 'scale-95 opacity-45' : 'scale-100'
              }`}
            >
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
              </defs>

              {/* Base hollow container */}
              <path
                d={HEART_PATH}
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Full heart */}
              {state === 'full' && (
                <path
                  d={HEART_PATH}
                  fill="#dc2626"
                  stroke="#fbbf24"
                  strokeWidth="1.15"
                />
              )}

              {/* Half heart */}
              {state === 'half' && (
                <>
                  <path
                    d={HEART_PATH}
                    fill="#dc2626"
                    clipPath={`url(#${clipId})`}
                  />
                  <path
                    d={HEART_PATH}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.15"
                  />
                </>
              )}
            </svg>
          );
        })}
      </div>

      <span className="font-mono-tabular text-xs font-bold tracking-wide text-slate-300 sm:text-sm">
        {safeHp}/{maxHp} PV
      </span>
    </div>
  );
};
