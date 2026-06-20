export function Eyebrow({ children, style }) {
  return (
    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--faint)', ...style }}>
      {children}
    </div>
  );
}

export function Pad({ children, style }) {
  return <div style={{ padding: '0 24px', ...style }}>{children}</div>;
}

export function Spacer({ h }) {
  return <div style={{ height: h }} />;
}

export function Grow() {
  return <div style={{ flex: 1 }} />;
}

export function Chevron() {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1.5 1.5L7 7.5l-5.5 6" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ done }) {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 999, flexShrink: 0, border: done ? 'none' : '2px solid var(--faint)', background: done ? 'var(--accentInk)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {done && (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M3 8l3 3 6-7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}
