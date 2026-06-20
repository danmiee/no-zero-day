import { useState } from 'react';
import { currentThemeKey } from '../../lib/theme';
import { progressMeta } from '../../lib/progress';
import FocusTimer from '../../components/FocusTimer';
import ScreenShell from '../../components/ui/ScreenShell';
import { Eyebrow, Pad, Spacer, Grow } from '../../components/ui/primitives';
import Card      from '../../components/ui/Card';
import BigButton from '../../components/ui/BigButton';

const C_ACC = { accent: 'var(--peach)', accentInk: 'var(--peach-ink)' };

export default function FlowC({ task, onBack, onHome, onComplete }) {
  const theme    = currentThemeKey();
  const progress = progressMeta(theme);
  const flowCopy = {
    garden:      { title: '일단 5분 · ',     button: '5분만 돌보기',     reward: ['일단 손댔더니', '새싹이 올라왔어요!'] },
    exploration: { title: '첫 발자국 · ',    button: '5분만 출발하기',   reward: ['첫 발자국을 찍었더니', '길이 보였어요!'] },
    cafe:        { title: '첫 한 모금 · ',   button: '5분만 앉아보기',   reward: ['잠깐 앉았더니', '여기까지 왔어요!'] },
  }[theme] || { title: '일단 5분 · ', button: '5분만 돌보기', reward: ['일단 손댔더니', '새싹이 올라왔어요!'] };

  const [step, setStep] = useState('start');

  if (step === 'start') return (
    <ScreenShell {...C_ACC} onBack={onBack} onReset={onHome}>
      <Pad><Eyebrow>{flowCopy.title}{task.t}</Eyebrow></Pad>
      <Grow />
      <Pad style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, color: 'var(--muted)' }}>지금 할 건 딱 하나</div>
        <Spacer h={12} />
        <div style={{ fontSize: 31, fontWeight: 700, lineHeight: 1.28, letterSpacing: '-0.032em' }}>{task.t}</div>
        <Spacer h={10} />
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>시작이 제일 어렵다는 거, 알아요.</div>
      </Pad>
      <Grow />
      <Pad>
        <BigButton kind="primary" onClick={() => setStep('timer')} style={{ padding: '24px 20px', fontSize: 22, borderRadius: 22 }}>{flowCopy.button}</BigButton>
        <Spacer h={12} />
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>5분 뒤에 그만둬도 완전 괜찮아요.</div>
      </Pad>
    </ScreenShell>
  );

  if (step === 'timer') return (
    <FocusTimer task={task} acc={C_ACC} minutes={5} tint="var(--peach-soft)" variant="big"
      onBack={() => setStep('start')} onHome={onHome}
      onDone={(elapsed) => { onComplete(Math.max(1, elapsed)); setStep('reward'); }} />
  );

  return (
    <ScreenShell {...C_ACC} onReset={onHome}>
      <Grow />
      <Pad style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none"><path d="M9 22l8 8 16-18" stroke="var(--accentInk)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <Spacer h={22} />
        <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.025em' }}>{flowCopy.reward[0]}<br />{flowCopy.reward[1]}</div>
        <Spacer h={12} />
        <div style={{ fontSize: 15, color: 'var(--muted)' }}>시작의 힘이에요. 멋져요.</div>
      </Pad>
      <Spacer h={24} />
      <Pad style={{ display: 'flex', gap: 10 }}>
        <Card style={{ flex: 1, textAlign: 'center', padding: '18px 8px' }}>
          <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accentInk)' }}>+1</div>
          <Eyebrow style={{ marginTop: 5 }}>연속 시작</Eyebrow>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center', padding: '18px 8px' }}>
          <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accentInk)' }}>+1</div>
          <Eyebrow style={{ marginTop: 5 }}>{progress.unitLabel}</Eyebrow>
        </Card>
      </Pad>
      <Grow />
      <Pad style={{ display: 'flex', gap: 10 }}>
        <BigButton kind="ghost" style={{ flex: 1 }} onClick={onHome}>홈으로</BigButton>
        <BigButton kind="primary" style={{ flex: 1 }} onClick={() => setStep('start')}>한 번 더!</BigButton>
      </Pad>
    </ScreenShell>
  );
}
