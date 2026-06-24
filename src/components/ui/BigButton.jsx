const base = {
  width: '100%', boxSizing: 'border-box', border: 'none',
  borderRadius: 'var(--radius-button)', padding: '18px 20px',
  fontFamily: 'inherit', fontSize: 17, fontWeight: 600,
  letterSpacing: '-0.01em', textAlign: 'center',
};
const looks = {
  primary: { background: 'var(--accent)', color: 'var(--accentInk)', boxShadow: '0 4px 14px -4px color-mix(in oklch, var(--accentInk) 32%, transparent)' },
  ghost:   { background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--line)', fontWeight: 500, boxShadow: 'var(--shadow-sm)' },
};

export default function BigButton({ children, kind = 'primary', style, onClick, disabled }) {
  const off = disabled ? { opacity: 0.4, pointerEvents: 'none' } : null;
  return (
    <div className="tap" onClick={onClick} style={{ ...base, ...looks[kind], ...off, ...style }}>
      {children}
    </div>
  );
}
