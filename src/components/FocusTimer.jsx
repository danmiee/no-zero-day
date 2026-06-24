import { useState, useEffect } from 'react';
import { themeMeta }           from '../lib/theme';
import { fmt }                 from '../lib/date';
import ScreenShell             from './ui/ScreenShell';
import { Eyebrow, Pad, Grow, Spacer } from './ui/primitives';
import BigButton               from './ui/BigButton';
import Buddy                   from './ui/Buddy';

export default function FocusTimer({ task, acc, minutes, tint, variant, onBack, onHome, onDone }) {
  const meta  = themeMeta();
  const total = minutes * 60;
  const [left, setLeft]       = useState(total);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((v) => (v <= 1 ? (clearInterval(id), 0) : v - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => { if (left === 0) onDone(minutes); }, [left]);

  const elapsedMin = Math.max(0, Math.round((total - left) / 60));
  const mm   = Math.floor(left / 60);
  const ss   = left % 60;
  const pct  = ((total - left) / total) * 100;
  const time = fmt(mm) + ':' + fmt(ss);

  if (variant === 'big') return (
    <ScreenShell {...acc} tint={tint} onBack={onBack} onReset={onHome}>
      <Pad><Eyebrow>{meta.name} 진행 중 · {task.t}</Eyebrow></Pad>
      <Grow />
      <Pad style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 74, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', lineHeight: 1 }}>{time}</div>
        <Spacer h={20} />
        <div style={{ height: 6, borderRadius: 999, background: 'var(--line)', overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: 'var(--accentInk)', transition: 'width 1s linear' }} />
        </div>
        <Spacer h={20} />
        <div style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.5 }}>지금 멈춰도 괜찮아요.<br />시작했다는 게 제일 중요하니까요.</div>
      </Pad>
      <Grow />
      <Pad><BigButton kind="ghost" onClick={() => onDone(elapsedMin)}>여기까지 — 그만두기</BigButton></Pad>
    </ScreenShell>
  );

  return (
    <ScreenShell {...acc} tint={tint} onBack={onBack} onReset={onHome}>
      <Pad><Eyebrow>{meta.name} 함께 집중 중 · {task.t}</Eyebrow></Pad>
      <Grow />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 196, height: 196 }}>
          <svg width="196" height="196" viewBox="0 0 196 196" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="98" cy="98" r="90" fill="none" stroke="var(--accent)" strokeWidth="8" />
            <circle cx="98" cy="98" r="90" fill="none" stroke="var(--accentInk)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (1 - pct / 100)}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{time}</div>
            <Eyebrow style={{ marginTop: 4 }}>{running ? '남은 시간' : '잠깐 멈춤'}</Eyebrow>
          </div>
        </div>
        <Spacer h={24} />
        <Buddy size={64} />
        <Spacer h={12} />
        <div style={{ fontSize: 16, lineHeight: 1.45, maxWidth: 260 }}>잘하고 있어요. 멈추고 싶으면 멈춰도 괜찮아요.</div>
      </Pad>
      <Grow />
      <Pad style={{ display: 'flex', gap: 10 }}>
        <BigButton kind="ghost" style={{ flex: 1 }} onClick={() => setRunning((r) => !r)}>{running ? '잠깐 멈춤' : '다시 시작'}</BigButton>
        <BigButton kind="primary" style={{ flex: 1 }} onClick={() => onDone(elapsedMin)}>다 했어요</BigButton>
      </Pad>
    </ScreenShell>
  );
}
