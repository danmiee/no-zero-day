import { currentThemeKey, themeMeta } from '../lib/theme';
import { METHOD_META, METHOD_LIST, RECO_WHY } from '../lib/method';
import ScreenShell from '../components/ui/ScreenShell';
import { Eyebrow, Pad, Spacer, Grow } from '../components/ui/primitives';
import BigButton   from '../components/ui/BigButton';
import Buddy       from '../components/ui/Buddy';
import MethodIcon  from '../components/ui/MethodIcon';

export default function MethodChooser({ task, onPick, onBack, recommended }) {
  const theme   = currentThemeKey();
  const meta    = themeMeta(theme);
  const ordered = recommended
    ? [...METHOD_LIST].sort((a, b) => (a.id === recommended ? -1 : b.id === recommended ? 1 : 0))
    : METHOD_LIST;

  return (
    <ScreenShell onBack={onBack}>
      <Pad>
        <Eyebrow>{meta.name} · {meta.action} 방법</Eyebrow>
        <Spacer h={12} />
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.36, letterSpacing: '-0.025em' }}>
          <span style={{ color: 'var(--muted)' }}>「{task.t}」</span><br />어떻게 {meta.action}할까요?
        </div>
      </Pad>
      <Spacer h={20} />
      {recommended && (
        <Pad style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--muted)' }}>
            <Buddy size={26} mood="cheer" />
            <span>{meta.mascot} 생각엔 <b style={{ color: 'var(--ink)' }}>{(METHOD_META[recommended] || {}).name}</b>가 잘 맞을 것 같아요.</span>
          </div>
        </Pad>
      )}
      <Pad style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {ordered.map((m) => {
          const reco = m.id === recommended;
          return (
            <div key={m.id} className="tap" onClick={() => onPick(m.id)} style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 15, padding: '19px 19px',
              background: m.accent, borderRadius: 22,
              border: reco ? '2px solid ' + m.accentInk : '2px solid transparent',
              boxShadow: '0 6px 18px -8px color-mix(in oklch, ' + m.accentInk + ' 45%, transparent)',
            }}>
              {reco && (
                <div style={{ position: 'absolute', top: -9, left: 18, background: m.accentInk, color: '#fff', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, padding: '3px 9px', borderRadius: 999 }}>{meta.mascot} 추천</div>
              )}
              <div style={{ width: 46, height: 46, borderRadius: 15, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
                <MethodIcon id={m.id} color={m.accentInk} size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: m.accentInk }}>{m.name}</div>
                <div style={{ fontSize: 13, color: m.accentInk, opacity: 0.78, marginTop: 3 }}>{reco ? RECO_WHY[m.id] : m.desc}</div>
              </div>
              <svg width="9" height="15" viewBox="0 0 9 15" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}>
                <path d="M1.5 1.5L7 7.5l-5.5 6" stroke={m.accentInk} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          );
        })}
      </Pad>
      <Grow />
      <Pad>
        <BigButton kind="ghost" onClick={() => onPick(recommended || METHOD_LIST[Math.floor(Math.random() * 3)].id)}>
          잘 모르겠어요 · {meta.mascot}가 골라줘
        </BigButton>
      </Pad>
    </ScreenShell>
  );
}
