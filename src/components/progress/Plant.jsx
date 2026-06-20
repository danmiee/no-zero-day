import { plantStage } from '../../lib/progress';

export default function Plant({ seeds = 0, size = 120 }) {
  const stage = plantStage(seeds);
  const leaf    = 'var(--mint)',     leafInk = 'var(--mint-ink)';
  const potA    = 'var(--peach)',    potB    = 'var(--peach-ink)';
  const stemH   = [0, 14, 30, 46, 56, 60][stage];
  const top     = 96 - stemH;

  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
      <path d="M28 96 L72 96 L66 116 L34 116 Z" fill={potA} stroke={potB} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="50" cy="96" rx="22" ry="5" fill={potB} opacity="0.25" />
      {stage >= 1 && <path d={`M50 96 L50 ${top}`} stroke={leafInk} strokeWidth="3.4" strokeLinecap="round" fill="none" />}
      {stage === 1 && <g>
        <path d="M50 88 Q40 82 44 92 Q50 90 50 88" fill={leaf} stroke={leafInk} strokeWidth="1.6" />
        <path d="M50 84 Q60 78 56 88 Q50 86 50 84" fill={leaf} stroke={leafInk} strokeWidth="1.6" />
      </g>}
      {stage >= 2 && <g stroke={leafInk} strokeWidth="1.8">
        <path d={`M50 ${top + 22} Q32 ${top + 14} 40 ${top + 30} Q50 ${top + 26} 50 ${top + 22}`} fill={leaf} />
        <path d={`M50 ${top + 18} Q68 ${top + 10} 60 ${top + 26} Q50 ${top + 22} 50 ${top + 18}`} fill={leaf} />
      </g>}
      {stage >= 3 && <g stroke={leafInk} strokeWidth="1.8">
        <path d={`M50 ${top + 10} Q30 ${top + 2} 39 ${top + 18} Q50 ${top + 14} 50 ${top + 10}`} fill={leaf} />
        <path d={`M50 ${top + 6} Q70 ${top - 2} 61 ${top + 14} Q50 ${top + 10} 50 ${top + 6}`} fill={leaf} />
      </g>}
      {stage === 4 && <circle cx="50" cy={top} r="7" fill={potA} stroke={potB} strokeWidth="2" />}
      {stage >= 5 && <g>
        {[0, 72, 144, 216, 288].map((deg) => {
          const r = deg * Math.PI / 180;
          return <ellipse key={deg} cx={50 + Math.cos(r) * 9} cy={top + Math.sin(r) * 9} rx="6" ry="9" fill={potA} stroke={potB} strokeWidth="1.6" transform={`rotate(${deg} ${50 + Math.cos(r) * 9} ${top + Math.sin(r) * 9})`} />;
        })}
        <circle cx="50" cy={top} r="6" fill="var(--peach-ink)" />
      </g>}
    </svg>
  );
}
