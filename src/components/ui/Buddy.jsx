import { currentThemeKey } from '../../lib/theme';

export default function Buddy({ size = 96, mood = 'smile', pop }) {
  const theme = currentThemeKey();
  const ink = 'var(--mascot-ink)';
  const st = { fill: 'none', stroke: ink, strokeWidth: 4.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const dot = (cx) => <circle cx={cx} cy="43" r="4.2" fill={ink} />;

  let eyes, mouth, extra = null;
  if (mood === 'cheer') {
    eyes  = <g {...st}><path d="M30 45 Q35 39 40 45" /><path d="M60 45 Q65 39 70 45" /></g>;
    mouth = <path d="M35 55 Q50 70 65 55" {...st} />;
    extra = <g {...st} strokeWidth="3.4"><path d="M20 30l3 3M80 30l-3 3M50 16v4" /></g>;
  } else if (mood === 'gentle') {
    eyes  = <g {...st}><path d="M31 44 Q35 41 39 44" /><path d="M61 44 Q65 41 69 44" /></g>;
    mouth = <path d="M42 58 Q50 63 58 58" {...st} />;
  } else if (mood === 'sleepy') {
    eyes  = <g {...st}><path d="M31 43 H39" /><path d="M61 43 H69" /></g>;
    mouth = <circle cx="50" cy="60" r="3.4" {...st} />;
  } else if (mood === 'wink') {
    eyes  = <g><path d="M31 43 H39" {...st} />{dot(65)}</g>;
    mouth = <path d="M38 56 Q50 65 62 56" {...st} />;
  } else {
    eyes  = <g>{dot(35)}{dot(65)}</g>;
    mouth = <path d="M38 56 Q50 66 62 56" {...st} />;
  }

  const accessory = theme === 'exploration'
    ? <g>
        <path d="M25 31 Q50 15 75 31 L70 38 Q50 31 30 38 Z" fill="var(--mascot-accent)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M40 24 L50 14 L60 24" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 70 Q35 78 48 72" fill="none" stroke="var(--mascot-accent)" strokeWidth="5" strokeLinecap="round" />
      </g>
    : theme === 'cafe'
      ? <g>
          <path d="M28 23 H70 V31 Q49 38 28 31 Z" fill="var(--mascot-accent)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          <path d="M68 45 h8 q5 0 5 6 q0 7-8 7 h-5" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M38 18 q-4-6 1-10M52 18 q-4-6 1-10M66 18 q-4-6 1-10" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
        </g>
      : <g>
          <path d="M50 22 C43 10 32 16 36 29 C43 29 48 26 50 22 Z" fill="var(--mint)" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M51 22 C58 9 70 16 65 29 C58 29 53 26 51 22 Z" fill="var(--mint)" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 22 V32" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        </g>;

  return (
    <div style={{
      width: size, height: size,
      borderRadius: theme === 'cafe' ? '32% 32% 40% 40%' : '46% 54% 52% 48%',
      background: 'var(--mascot)',
      position: 'relative', flexShrink: 0,
      boxShadow: 'inset 0 -6px 14px rgba(0,0,0,0.05), var(--shadow-sm)',
      animation: pop ? 'buddyPop .6s cubic-bezier(.34,1.56,.64,1) both' : 'none',
    }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        {accessory}{eyes}{mouth}{extra}
      </svg>
    </div>
  );
}
