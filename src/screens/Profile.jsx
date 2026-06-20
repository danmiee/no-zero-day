import { normalizeThemeKey, themeMeta } from '../lib/theme';
import { progressMeta } from '../lib/progress';
import ScreenShell         from '../components/ui/ScreenShell';
import TabBar              from '../components/ui/TabBar';
import Card                from '../components/ui/Card';
import Chip                from '../components/ui/Chip';
import { Eyebrow, Pad, Spacer, Chevron } from '../components/ui/primitives';
import ThemeProgressVisual from '../components/progress/ThemeProgressVisual';

export default function Profile({ state, onReset, onTheme, tab, onTab }) {
  const theme    = normalizeThemeKey(state.theme);
  const meta     = themeMeta(theme);
  const progress = progressMeta(theme, state.seeds);

  const settings = [
    ['집중 알림', '하루 1번, 부드럽게'],
    ['마스코트',  meta.mascot],
  ];
  const themes = [['garden', '정원'], ['exploration', '탐험'], ['cafe', '카페']];

  return (
    <ScreenShell pb={0}>
      <Pad>
        <Eyebrow>{meta.name}</Eyebrow>
      </Pad>
      <Spacer h={14} />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <ThemeProgressVisual theme={theme} seeds={state.seeds} size={118} />
        <Spacer h={6} />
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{state.name}님의 {meta.name} 모드</div>
        <Spacer h={8} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--line)', background: 'var(--card)', borderRadius: 999, padding: '7px 12px', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: 12, color: 'var(--faint)' }}>Lv.{progress.stage + 1}</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--lav-ink)' }}>{progress.stageName}</span>
        </div>
        <Spacer h={8} />
        <div style={{ fontSize: 13.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{progress.line}</div>
      </Pad>
      <Spacer h={20} />
      <Pad style={{ display: 'flex', gap: 10 }}>
        {[[state.streak, '연속 시작', '일'], [state.seeds, progress.unitLabel, progress.unit], [state.history.length, '총 시작', '회']].map(([n, l, u], i) => (
          <Card key={i} style={{ flex: 1, textAlign: 'center', padding: '16px 6px' }}>
            <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--lav-ink)' }}>{n}<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>{u}</span></div>
            <Eyebrow style={{ marginTop: 5, fontSize: 10 }}>{l}</Eyebrow>
          </Card>
        ))}
      </Pad>
      <Spacer h={20} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Pad><Eyebrow>테마</Eyebrow></Pad>
        <Spacer h={10} />
        <Pad style={{ display: 'flex', gap: 8 }}>
          {themes.map(([k, l]) => (
            <Chip key={k} active={normalizeThemeKey(state.theme) === k} onClick={() => onTheme(k)} style={{ flex: 1, textAlign: 'center', padding: '13px 0' }}>{l}</Chip>
          ))}
        </Pad>
        <Spacer h={22} />
        <Pad><Eyebrow>설정</Eyebrow></Pad>
        <Spacer h={10} />
        <Pad>
          <Card style={{ padding: '4px 18px' }}>
            {settings.map(([k, v], i) => (
              <div key={k} className="tap" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                <div style={{ flex: 1, fontSize: 15.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{k}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{v}</div>
                <Chevron />
              </div>
            ))}
          </Card>
          <Spacer h={12} />
          <div className="tap" onClick={onReset} style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', padding: '12px 0' }}>데이터 초기화</div>
        </Pad>
      </div>
      <TabBar active={tab} onTab={onTab} />
    </ScreenShell>
  );
}
