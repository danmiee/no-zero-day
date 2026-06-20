import { plantStage } from '../../lib/progress';

export default function CafeMenuProgress({ seeds = 0, size = 120 }) {
  const stage = plantStage(seeds);
  const board = 'var(--card)';
  const ink   = 'var(--peach-ink)';

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <rect x="22" y="15" width="76" height="92" rx="10" fill={board} stroke={ink} strokeWidth="3" />
      <path d="M34 33 H86" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.78" />
      {stage >= 1 && <path d="M34 47 H68" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.72" />}
      {stage >= 1 && <g>
        <rect x="34" y="61" width="52" height="10" rx="5" fill="var(--peach-soft)" stroke="var(--peach-ink)" strokeWidth="1.8" />
        <path d="M41 66 H61" stroke="var(--peach-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>}
      {stage >= 2 && <g>
        <circle cx="79" cy="66" r="10" fill="var(--lav)" stroke="var(--lav-ink)" strokeWidth="2" />
        <path d="M74 66 h10 M79 61 v10" stroke="var(--lav-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>}
      {stage >= 3 && <g>
        <path d="M37 83 h28 q5 0 5 5 q0 5-5 5 H43 q-6 0-6-6z" fill="var(--mint-soft)" stroke="var(--mint-ink)" strokeWidth="2" />
        <path d="M70 85 h6 q4 0 4 4 q0 5-6 5 h-5" fill="none" stroke="var(--mint-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>}
      {stage >= 4 && <g>
        <path d="M79 82 l4 7 l8 1 l-6 5 l2 8 l-8-4 l-7 4 l2-8 l-6-5 l8-1z" fill="var(--mascot-accent)" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
      </g>}
      {stage >= 5 && <g>
        <path d="M29 22 L91 22" stroke="var(--mascot-ink)" strokeWidth="5" strokeLinecap="round" />
        <path d="M42 22 q-4-10 3-15 M60 22 q-4-10 3-15 M78 22 q-4-10 3-15" fill="none" stroke="var(--mascot-ink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
      </g>}
    </svg>
  );
}
