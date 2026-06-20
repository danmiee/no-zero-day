const TAB_ICONS = {
  홈:   (a) => <path d="M4 9.5L11 4l7 5.5V18a1 1 0 0 1-1 1h-3v-5H8v5H5a1 1 0 0 1-1-1V9.5z" fill={a ? 'var(--lav-ink)' : 'none'} stroke={a ? 'var(--lav-ink)' : 'var(--faint)'} strokeWidth="1.6" strokeLinejoin="round" />,
  기록: (a) => <g stroke={a ? 'var(--lav-ink)' : 'var(--faint)'} strokeWidth="1.6" strokeLinecap="round"><path d="M6 5h10M6 11h10M6 17h6" /></g>,
  마이: (a) => <g fill="none" stroke={a ? 'var(--lav-ink)' : 'var(--faint)'} strokeWidth="1.6"><circle cx="11" cy="8" r="3.2" /><path d="M5 18c0-3.3 2.7-5 6-5s6 1.7 6 5" strokeLinecap="round" /></g>,
};

export default function TabBar({ active, onTab }) {
  const items = [['홈', 'home'], ['기록', 'records'], ['마이', 'me']];
  return (
    <div style={{
      display: 'flex', gap: 8,
      padding: '14px 24px',
      paddingBottom: 'max(8px, var(--safe-bottom))',
      borderTop: '1px solid var(--line)',
      background: 'var(--bg)',
      boxShadow: '0 -7px 20px -12px rgba(30,28,40,0.16)',
      position: 'sticky', bottom: 0, zIndex: 5, flexShrink: 0,
    }}>
      {items.map(([label, key]) => {
        const a = active === key;
        return (
          <div key={key} className="tap" onClick={() => onTab(key)} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <svg width="22" height="22" viewBox="0 0 22 23">{TAB_ICONS[label](a)}</svg>
            <span style={{ fontSize: 11, fontWeight: a ? 600 : 500, whiteSpace: 'nowrap', color: a ? 'var(--ink)' : 'var(--faint)' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
