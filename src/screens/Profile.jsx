import { normalizeThemeKey, themeMeta } from '../lib/theme';
import { progressMeta } from '../lib/progress';
import ScreenShell         from '../components/ui/ScreenShell';
import TabBar              from '../components/ui/TabBar';
import Card                from '../components/ui/Card';
import Chip                from '../components/ui/Chip';
import { Eyebrow, Pad, Spacer, Chevron } from '../components/ui/primitives';
import ThemeProgressVisual from '../components/progress/ThemeProgressVisual';

export default function Profile({ state, onReset, onTheme, onEdit, onRemove, tab, onTab }) {
  const theme    = normalizeThemeKey(state.theme);
  const meta     = themeMeta(theme);
  const progress = progressMeta(theme, state.seeds);
  const themes   = [['garden', '정원'], ['exploration', '탐험'], ['cafe', '카페']];

  return (
    <ScreenShell pb={0}>
      <Pad>
        <div style={{ height: 14 }} />
      </Pad>
      <Spacer h={14} />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Card style={{ width: '100%', boxSizing: 'border-box', padding: '18px 18px 16px', background: 'var(--card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
            <ThemeProgressVisual theme={theme} seeds={state.seeds} size={92} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{state.name}님의 {meta.name} 모드</div>
              <Spacer h={7} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--line)', background: 'var(--surface)', borderRadius: 999, padding: '7px 11px' }}>
                <span style={{ fontSize: 12, color: 'var(--faint)' }}>Lv.{progress.stage + 1}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--lav-ink)' }}>{progress.stageName}</span>
              </div>
              <Spacer h={8} />
              <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.42 }}>{progress.line}</div>
            </div>
          </div>
          <Spacer h={14} />
          <div style={{ fontSize: 13.5, color: 'var(--muted)', textAlign: 'left' }}>{meta.mascot}가 오늘도 부담 없는 시작을 도와줄게요.</div>
        </Card>
      </Pad>
      <Spacer h={14} />
      <Pad style={{ display: 'flex', gap: 10 }}>
        {[[state.streak, '연속 시작', '일'], [state.seeds, progress.unitLabel, progress.unit], [state.history.length, '총 시작', '회']].map(([n, l, u], i) => (
          <Card key={i} style={{ flex: 1, textAlign: 'center', padding: '15px 6px', background: 'var(--card)' }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--lav-ink)' }}>{n}<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>{u}</span></div>
            <Eyebrow style={{ marginTop: 5, fontSize: 10 }}>{l}</Eyebrow>
          </Card>
        ))}
      </Pad>
      <Spacer h={18} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Pad><Eyebrow>테마</Eyebrow></Pad>
        <Spacer h={10} />
        <Pad style={{ display: 'flex', gap: 8 }}>
          {themes.map(([k, l]) => (
            <Chip key={k} active={normalizeThemeKey(state.theme) === k} onClick={() => onTheme(k)} style={{ flex: 1, textAlign: 'center', padding: '13px 0' }}>{l}</Chip>
          ))}
        </Pad>
        <Spacer h={22} />
        <Pad style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>목록 관리</Eyebrow>
          <span style={{ fontSize: 12.5, color: 'var(--faint)' }}>{state.tasks.length}개</span>
        </Pad>
        <Spacer h={10} />
        <Pad style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {state.tasks.length === 0 && (
            <Card style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>아직 관리할 할 일이 없어요.</Card>
          )}
          {state.tasks.map((task) => (
            <Card key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--card)' }}>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ fontSize: 15.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
                  {task.when}{task.time ? ' · ' + task.time : ''}
                </div>
              </div>
              <div className="tap" onClick={() => onEdit(task)} style={{ width: 34, height: 34, borderRadius: 999, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 10.7l.6-2.4 5.9-5.9a1.4 1.4 0 0 1 2 2L5.6 10.3 3 10.7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.5 3.4l2.1 2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </div>
              <div className="tap" onClick={() => onRemove(task.id)} style={{ width: 34, height: 34, borderRadius: 999, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </div>
            </Card>
          ))}
          <Spacer h={12} />
          <div className="tap" onClick={onReset} style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', padding: '12px 0' }}>데이터 초기화</div>
        </Pad>
      </div>
      <TabBar active={tab} onTab={onTab} />
    </ScreenShell>
  );
}
