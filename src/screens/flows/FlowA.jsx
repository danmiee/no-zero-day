import { useState } from 'react';
import { currentThemeKey } from '../../lib/theme';
import ScreenShell from '../../components/ui/ScreenShell';
import { Eyebrow, Pad, Spacer, Grow, Chevron, Check } from '../../components/ui/primitives';
import Card      from '../../components/ui/Card';
import BigButton from '../../components/ui/BigButton';

const A_ACC = { accent: 'var(--lav)', accentInk: 'var(--lav-ink)' };

export default function FlowA({ task, onBack, onHome, onComplete }) {
  const flowCopy = {
    garden:      { title: '작은 화단으로 나눴어요.', sub: '하나만 골라 돌보면 돼요.',       done: '한 걸음씩 돌보니까 자라났어요.' },
    exploration: { title: '지도를 조각냈어요.',       sub: '가장 가까운 표식부터 찍어요.',   done: '표식을 찍다 보니 길이 열렸어요.' },
    cafe:        { title: '메뉴를 작게 나눴어요.',    sub: '한 잔씩 천천히 주문해요.',       done: '천천히 해도 충분히 도착했어요.' },
  }[currentThemeKey()] || { title: '작은 화단으로 나눴어요.', sub: '하나만 골라 돌보면 돼요.', done: '한 걸음씩 돌보니까 자라났어요.' };

  const [step, setStep] = useState('split');
  const [done, setDone] = useState([]);
  const [cur,  setCur]  = useState(0);
  const [tiny, setTiny] = useState(false);

  const steps  = task.steps;
  const label  = (i) => (tiny && i === 0 ? task.tiny : steps[i]);
  const isDone = (i) => done.indexOf(i) !== -1;
  const allDone = done.length >= steps.length;

  const completeCur = () => {
    const next = isDone(cur) ? done : [...done, cur];
    setDone(next);
    if (next.length >= steps.length) { onComplete(steps.length); setStep('done'); }
    else setStep('split');
  };
  const finishEarly = () => { onComplete(Math.max(1, done.length)); setStep('done'); };

  if (step === 'split') return (
    <ScreenShell {...A_ACC} onBack={onBack} onReset={onHome}>
      <Pad>
        <Eyebrow>{task.t}</Eyebrow>
        <Spacer h={10} />
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.025em' }}>{flowCopy.title}<br />{flowCopy.sub}</div>
        <Spacer h={7} />
        <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>꼭 순서대로 안 해도 돼요. 제일 쉬운 것부터.</div>
      </Pad>
      <Spacer h={18} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Pad style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
          {steps.map((s, i) => {
            const d = isDone(i);
            return (
              <Card key={i} onClick={d ? undefined : () => { setCur(i); setStep('doing'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 17px', opacity: d ? 0.6 : 1, background: d ? 'var(--bg)' : 'var(--card)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: d ? 'var(--accentInk)' : 'var(--accent)', color: d ? '#fff' : 'var(--accentInk)', fontSize: 14, fontWeight: 700 }}>
                  {d
                    ? <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M3 8l3 3 6-7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', textDecoration: d ? 'line-through' : 'none', color: d ? 'var(--muted)' : 'var(--ink)' }}>{label(i)}</div>
                {!d && <Chevron />}
              </Card>
            );
          })}
        </Pad>
      </div>
      <Pad>
        {done.length > 0
          ? <BigButton kind="primary" onClick={allDone ? () => { onComplete(steps.length); setStep('done'); } : finishEarly}>
              {allDone ? '다 끝냈어요!' : `여기까지 마무리 (${done.length}/${steps.length})`}
            </BigButton>
          : <BigButton kind="ghost" onClick={() => setTiny(true)}>
              {tiny ? '이미 최대한 쪼갰어요' : '첫 단계가 부담되면 · 더 잘게 쪼개줘'}
            </BigButton>}
      </Pad>
    </ScreenShell>
  );

  if (step === 'doing') return (
    <ScreenShell {...A_ACC} onBack={() => setStep('split')} onReset={onHome}>
      <Pad>
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: isDone(i) ? 'var(--accentInk)' : (i === cur ? 'var(--accent)' : 'var(--line)') }} />
          ))}
        </div>
        <Spacer h={6} />
        <Eyebrow>{done.length} / {steps.length} 완료 · 지금 {cur + 1}번</Eyebrow>
      </Pad>
      <Grow />
      <Pad style={{ textAlign: 'center' }}>
        <Eyebrow style={{ marginBottom: 14 }}>지금 할 것 — 딱 이것만</Eyebrow>
        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.34, letterSpacing: '-0.03em' }}>{label(cur)}</div>
        <Spacer h={16} />
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>다른 건 생각하지 않아도 돼요.</div>
      </Pad>
      <Grow />
      <Pad>
        <BigButton kind="primary" onClick={completeCur} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, whiteSpace: 'nowrap' }}>
          <Check done={true} /> 했어요!
        </BigButton>
        <Spacer h={10} />
        <BigButton kind="ghost" onClick={() => setStep('split')}>잠깐, 목록으로</BigButton>
      </Pad>
    </ScreenShell>
  );

  return (
    <ScreenShell {...A_ACC} onReset={onHome}>
      <Grow />
      <Pad style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 92, height: 92, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 42 42" fill="none"><path d="M9 22l8 8 16-18" stroke="var(--accentInk)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <Spacer h={20} />
        <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.025em' }}>
          {allDone ? `${task.t}, 끝까지 해냈어요!` : `${done.length}단계나 해냈어요!`}
        </div>
        <Spacer h={10} />
        <div style={{ fontSize: 15, color: 'var(--muted)' }}>{flowCopy.done}</div>
      </Pad>
      <Grow />
      <Pad style={{ display: 'flex', gap: 10 }}>
        <BigButton kind="ghost" style={{ flex: 1 }} onClick={onHome}>홈으로</BigButton>
        <BigButton kind="primary" style={{ flex: 1 }} onClick={() => { setDone([]); setCur(0); setTiny(false); setStep('split'); }}>다시 하기</BigButton>
      </Pad>
    </ScreenShell>
  );
}
