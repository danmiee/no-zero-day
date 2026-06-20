import { currentThemeKey, themeMeta } from '../lib/theme';
import { METHOD_META } from '../lib/method';
import ScreenShell from '../components/ui/ScreenShell';
import TabBar      from '../components/ui/TabBar';
import Card        from '../components/ui/Card';
import Buddy       from '../components/ui/Buddy';
import MethodIcon  from '../components/ui/MethodIcon';
import { Eyebrow, Pad, Spacer } from '../components/ui/primitives';

export default function Records({ history, streak, tab, onTab }) {
  const theme = currentThemeKey();
  const meta  = themeMeta(theme);
  const copy  = {
    garden:      { title: '자라난 순간들',  week: '이번 주 정원 기록' },
    exploration: { title: '지나온 경로들',  week: '이번 주 탐험 지도' },
    cafe:        { title: '머문 시간들',    week: '이번 주 카페 노트' },
  }[theme] || { title: '자라난 순간들', week: '이번 주 정원 기록' };

  const totalMin = history.reduce((a, b) => a + b.minutes, 0);
  const week     = history.length;
  const byMethod = { a: 0, b: 0, c: 0 };
  history.forEach((h) => { byMethod[h.method] = (byMethod[h.method] || 0) + 1; });
  const topMethod = Object.keys(byMethod).sort((a, b) => byMethod[b] - byMethod[a])[0];
  const topName   = (METHOD_META[topMethod] || {}).name;

  return (
    <ScreenShell pb={0}>
      <Pad>
        <Eyebrow>{meta.name} 기록</Eyebrow>
        <Spacer h={10} />
        <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.03em' }}>{copy.title}</div>
        <Spacer h={16} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Card style={{ flex: 1, textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.02em' }}>{history.length}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)' }}>회</span></div>
            <Eyebrow style={{ marginTop: 5 }}>시작</Eyebrow>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.02em' }}>{totalMin}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)' }}>분</span></div>
            <Eyebrow style={{ marginTop: 5 }}>집중</Eyebrow>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--lav-ink)' }}>{streak}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)' }}>일</span></div>
            <Eyebrow style={{ marginTop: 5 }}>연속</Eyebrow>
          </Card>
        </div>
      </Pad>
      <Spacer h={18} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {history.length > 0 && (
          <Pad>
            <Card style={{ padding: '17px 18px', background: 'var(--mint-soft)', border: '1px solid var(--mint)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                <Buddy size={30} mood="wink" />
                <Eyebrow style={{ color: 'var(--mint-ink)' }}>{copy.week}</Eyebrow>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
                이번 주 <b>{week}번</b> 시작했고 <b>{totalMin}분</b> 집중했어요. 제일 자주 기댄 방법은 <b style={{ color: 'var(--mint-ink)' }}>{topName}</b>였네요. 충분히 잘하고 있어요.
              </div>
            </Card>
          </Pad>
        )}
        <Spacer h={18} />
        <Pad><Eyebrow>최근</Eyebrow></Pad>
        <Spacer h={10} />
        <Pad style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12 }}>
          {history.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, padding: '30px 0' }}>아직 기록이 없어요. 딱 한 걸음만 시작해볼까요?</div>
          )}
          {history.map((h) => {
            const m    = METHOD_META[h.method] || METHOD_META.a;
            const over = h.estimate ? h.minutes - h.estimate : null;
            return (
              <Card key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 17px' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MethodIcon id={h.method} color={m.accentInk} size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>
                    {h.methodLabel} · {h.date}
                    {h.estimate != null && <span> · 예상 {h.estimate}분</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: m.accentInk }}>{h.minutes}분</div>
                  {over != null && <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 2 }}>{over > 0 ? '+' + over : over === 0 ? '딱맞음' : over}{over !== 0 ? '분' : ''}</div>}
                </div>
              </Card>
            );
          })}
        </Pad>
      </div>
      <TabBar active={tab} onTab={onTab} />
    </ScreenShell>
  );
}
