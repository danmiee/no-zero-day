export default function Chip({ children, active, style, onClick }) {
  return (
    <div
      className="tap"
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: 'var(--radius-chip)',
        fontSize: 15,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        border: active ? '1.5px solid var(--accentInk)' : '1px solid var(--line)',
        background: active ? 'var(--accent)' : 'var(--card)',
        boxShadow: active ? 'none' : 'var(--shadow-sm)',
        color: active ? 'var(--accentInk)' : 'var(--muted)',
        fontWeight: active ? 600 : 500,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
