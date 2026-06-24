import { plantStage } from '../../lib/progress';

export default function MapProgress({ seeds = 0, size = 120 }) {
  const stage = plantStage(seeds);
  const route = 'var(--sky-ink)';
  const paper = 'var(--card)';
  const fold  = 'var(--peach-soft)';
  const ink   = 'var(--peach-ink)';

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <path d="M16 24 L46 14 L76 24 L104 14 L104 94 L76 106 L46 96 L16 106 Z" fill={paper} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M46 14 V96 M76 24 V106" fill="none" stroke="var(--line)" strokeWidth="2" />
      {stage >= 1 && <path d="M18 54 L46 45" fill="none" stroke={fold} strokeWidth="14" strokeLinecap="round" opacity="0.9" />}
      {stage >= 2 && <path d="M46 45 L76 56" fill="none" stroke={fold} strokeWidth="14" strokeLinecap="round" opacity="0.9" />}
      {stage >= 3 && <path d="M76 56 L102 46" fill="none" stroke={fold} strokeWidth="14" strokeLinecap="round" opacity="0.9" />}
      {stage >= 1 && <path d="M28 84 C38 72 43 68 51 67" fill="none" stroke={route} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 7" />}
      {stage >= 2 && <path d="M51 67 C62 64 64 49 75 50" fill="none" stroke={route} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 7" />}
      {stage >= 3 && <path d="M75 50 C86 51 88 35 98 30" fill="none" stroke={route} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 7" />}
      {stage >= 1 && <circle cx="28" cy="84" r="5" fill="var(--mint)"  stroke="var(--mint-ink)" strokeWidth="2" />}
      {stage >= 2 && <circle cx="51" cy="67" r="4.5" fill="var(--peach)" stroke={ink} strokeWidth="2" />}
      {stage >= 3 && <circle cx="75" cy="50" r="4.5" fill="var(--lav)"  stroke="var(--lav-ink)"  strokeWidth="2" />}
      {stage >= 4 && <path d="M98 28 c0-8 12-8 12 0 c0 8-6 13-6 13 s-6-5-6-13z" fill="var(--mascot-accent)" stroke={route} strokeWidth="2.4" strokeLinejoin="round" />}
      {stage >= 5 && <g transform="translate(24 25)">
        <circle cx="10" cy="10" r="9" fill="var(--mint-soft)" stroke="var(--mint-ink)" strokeWidth="2" />
        <path d="M10 3 L13 10 L10 17 L7 10 Z" fill="var(--mint-ink)" />
      </g>}
    </svg>
  );
}
