import { useState } from 'react';
import { themeMeta }  from '../lib/theme';
import ScreenShell   from '../components/ui/ScreenShell';
import TabBar        from '../components/ui/TabBar';
import Card          from '../components/ui/Card';
import Chip          from '../components/ui/Chip';
import Buddy         from '../components/ui/Buddy';
import { Eyebrow, Pad, Spacer, Chevron } from '../components/ui/primitives';

export default function Home({ tasks, theme, onPick, onAdd, tab, onTab }) {
  const [focusOne, setFocusOne] = useState(false);

  const copy = {
    garden:      { title: ['오늘 뭘', '돌볼까요?'],   line: '작은 씨앗 하나만 돌봐도 충분해요.',     empty: '오늘 정원은 쉬는 날이에요. 물만 살짝 주고 쉬어요.' },
    exploration: { title: ['어디로', '떠날까요?'],     line: '지도가 복잡해도 첫 표식만 찍으면 돼요.', empty: '오늘 지도는 비어 있어요. 쉬어 가도 좋아요.' },
    cafe:        { title: ['자리에', '앉아볼까요?'],   line: '따뜻하게 시작할 한 잔만 고르면 돼요.',   empty: '오늘 카페는 조용해요. 잠깐 쉬어도 괜찮아요.' },
  }[theme] || themeMeta('garden');

  const line       = tasks.length === 0 ? copy.empty : copy.line;
  const pickRandom = () => { if (tasks.length) onPick(tasks[Math.floor(Math.random() * tasks.length)]); };
  const shown      = focusOne && tasks.length ? [tasks[0]] : tasks;

  return (
    <ScreenShell pb={0}>
      <Pad>
        <div style={{ height: 14 }} />
        <Spacer h={10} />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: theme === 'exploration' ? 30 : 28, fontWeight: 700, lineHeight: 1.22, letterSpacing: '-0.032em' }}>
            {copy.title[0]}<br />{copy.title[1]}
          </div>
          <Buddy size={56} mood={theme === 'cafe' ? 'sleepy' : theme === 'exploration' ? 'cheer' : 'gentle'} />
        </div>
        <Spacer h={12} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '11px 14px', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: 'var(--lav-ink)', flexShrink: 0 }}>{themeMeta(theme).mascot}</span>
          <span style={{ fontSize: 13.5, color: 'var(--ink)' }}>{line}</span>
        </div>
      </Pad>
      <Spacer h={16} />
      <Pad style={{ display: 'flex', gap: 8 }}>
        <Chip active={focusOne} onClick={() => setFocusOne((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', fontSize: 13.5 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.6" /><circle cx="7" cy="7" r="1.6" fill="currentColor" /></svg>
          오늘 딱 하나
        </Chip>
        <Chip onClick={pickRandom} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', fontSize: 13.5 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="5" cy="5" r="1.1" fill="currentColor" /><circle cx="9" cy="9" r="1.1" fill="currentColor" /><circle cx="9" cy="5" r="1.1" fill="currentColor" /><circle cx="5" cy="9" r="1.1" fill="currentColor" /></svg>
          못 고르겠어요 · 골라줘
        </Chip>
      </Pad>
      <Spacer h={14} />
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Pad style={{ display: 'flex', flexDirection: 'column', gap: 11, paddingBottom: 10 }}>
          {focusOne && tasks.length > 0 && (
            <div style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', marginBottom: 2 }}>나머지는 잠깐 숨겼어요. 이거 하나만.</div>
          )}
          {shown.map((x) => (
            <Card key={x.id} onClick={() => onPick(x)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '17px 18px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              boxShadow: theme === 'cafe' ? 'none' : undefined,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16.5, fontWeight: 600, letterSpacing: '-0.015em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.t}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{x.when}</span>
                  {x.time && <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--faint)' }} />}
                  {x.time && <span>{x.time}</span>}
                </div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--line)', overflow: 'hidden' }}>
                    <div style={{ width: '0%', height: '100%', background: 'var(--lav-ink)' }} />
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--faint)', whiteSpace: 'nowrap' }}>시작 전 · {(x.steps || []).length || 1}단계</span>
                </div>
              </div>
              <Chevron />
            </Card>
          ))}
          {!focusOne && (
            <div className="tap" onClick={onAdd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '15px 18px', borderRadius: 18, border: '1.5px dashed var(--line)', color: 'var(--muted)', fontSize: 15, fontWeight: 500 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <span style={{ whiteSpace: 'nowrap' }}>할 일 추가하기</span>
            </div>
          )}
        </Pad>
      </div>
      <TabBar active={tab} onTab={onTab} />
    </ScreenShell>
  );
}
