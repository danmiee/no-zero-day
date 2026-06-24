export default function ScreenShell({ accent, accentInk, tint, onBack, onReset, pb, children }) {
  const safeTop = 'var(--safe-top)';
  const topPad = (onBack || onReset) ? `calc(${safeTop} + 52px)` : `calc(${safeTop} + 20px)`;
  const botPad = pb != null ? pb : 24;

  return (
    <div style={{
      height: '100dvh',
      boxSizing: 'border-box',
      paddingTop: topPad,
      paddingBottom: botPad,
      display: 'flex',
      flexDirection: 'column',
      background: tint || 'var(--screen-bg)',
      '--accent': accent || 'var(--lav)',
      '--accentInk': accentInk || 'var(--lav-ink)',
      fontFamily: 'var(--ui)',
      letterSpacing: '-0.011em',
      color: 'var(--ink)',
      animation: 'wfslide .3s cubic-bezier(.22,.61,.36,1) both',
    }}>
      {(onBack || onReset) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px 10px' }}>
          {onBack
            ? <div className="tap" onClick={onBack} style={{ width: 38, height: 38, borderRadius: 999, border: '1px solid var(--line)', background: 'var(--card)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                  <path d="M7.5 1.5L2 7.5l5.5 6" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            : <div style={{ width: 38 }} />}
          {onReset
            ? <div className="tap" onClick={onReset} style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 0.5, color: 'var(--faint)', padding: '8px 6px' }}>↺ 처음으로</div>
            : <div style={{ width: 38 }} />}
        </div>
      )}
      {children}
    </div>
  );
}
