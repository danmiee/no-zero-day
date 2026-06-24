import { useState } from 'react';
import { currentThemeKey } from '../../lib/theme';
import FocusTimer from '../../components/FocusTimer';
import ScreenShell from '../../components/ui/ScreenShell';
import { Eyebrow, Pad, Spacer, Grow } from '../../components/ui/primitives';
import Card      from '../../components/ui/Card';
import Chip      from '../../components/ui/Chip';
import BigButton from '../../components/ui/BigButton';
import Buddy     from '../../components/ui/Buddy';

const B_ACC  = { accent: 'var(--mint)', accentInk: 'var(--mint-ink)' };
const B_DURS = ['10분', '25분', '45분'];
const B_MIN  = [10, 25, 45];

export default function FlowB({ task, onBack, onHome, onComplete }) {
  const flowCopy = {
    garden:      { ask: '같이 물 주듯 시작해볼까요?',   sub: '혼자 하기 싫은 일도 함께 돌보면 쉬워져요.', session: '정원 같이 돌보기' },
    exploration: { ask: '같이 탐험을 시작할까요?',       sub: '혼자 가기 애매한 길은 나란히 걸으면 돼요.',  session: '동행 탐험 세션' },
    cafe:        { ask: '같은 테이블에 앉아볼까요?',     sub: '조용히 옆자리를 지켜줄게요.',               session: '카페 집중 자리' },
  }[currentThemeKey()] || { ask: '같이 물 주듯 시작해볼까요?', sub: '혼자 하기 싫은 일도 함께 돌보면 쉬워져요.', session: '정원 같이 돌보기' };

  const [step,  setStep]  = useState('propose');
  const [dur,   setDur]   = useState(1);
  const [sound, setSound] = useState(false);
  const [together]        = useState(() => 1180 + Math.floor(Math.random() * 160));
  const togetherStr       = together.toLocaleString();

  if (step === 'propose') return (
    <ScreenShell {...B_ACC} onBack={onBack} onReset={onHome}>
      <Grow />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Buddy size={104} mood="gentle" />
        <Spacer h={22} />
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20, borderBottomLeftRadius: 6, padding: '16px 20px', fontSize: 18, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.015em', boxShadow: 'var(--shadow-sm)' }}>{flowCopy.ask}</div>
        <Spacer h={16} />
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>{flowCopy.sub}</div>
        <Spacer h={10} />
        <Card style={{ width: '100%', boxSizing: 'border-box', padding: '14px 18px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accentInk)' }} />
          <div style={{ fontSize: 15 }}>오늘 할 일 · <b>{task.t}</b></div>
        </Card>
        <Spacer h={12} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--muted)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--mint-ink)', animation: 'livePulse 1.6s ease-in-out infinite' }} />
          지금 {togetherStr}명이 같이 집중하고 있어요
        </div>
      </Pad>
      <Grow />
      <Pad>
        <BigButton kind="primary" onClick={() => setStep('prepare')}>응, 같이 하자</BigButton>
        <Spacer h={10} />
        <BigButton kind="ghost" onClick={() => setStep('later')}>조금 이따가</BigButton>
      </Pad>
    </ScreenShell>
  );

  if (step === 'later') return (
    <ScreenShell {...B_ACC} onBack={() => setStep('propose')} onReset={onHome}>
      <Grow />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Buddy size={80} />
        <Spacer h={20} />
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.42, letterSpacing: '-0.02em' }}>알겠어요. 30분 뒤에<br />다시 살짝 물어볼게요.</div>
        <Spacer h={10} />
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>재촉하지 않을게요. 준비되면 불러요.</div>
      </Pad>
      <Grow />
      <Pad><BigButton kind="primary" onClick={() => setStep('propose')}>그냥 지금 할래</BigButton></Pad>
    </ScreenShell>
  );

  if (step === 'prepare') return (
    <ScreenShell {...B_ACC} onBack={() => setStep('propose')} onReset={onHome}>
      <Pad>
        <Eyebrow>{flowCopy.session}</Eyebrow>
        <Spacer h={10} />
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.025em' }}>얼마나 같이<br />있을까요?</div>
      </Pad>
      <Spacer h={22} />
      <Pad style={{ display: 'flex', gap: 10 }}>
        {B_DURS.map((d, i) => (
          <Chip key={d} active={i === dur} onClick={() => setDur(i)} style={{ flex: 1, textAlign: 'center', padding: '16px 0', fontSize: 17 }}>{d}</Chip>
        ))}
      </Pad>
      <Spacer h={12} />
      <Pad>
        <div className="tap" onClick={() => setSound((s) => !s)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '13px 16px', boxShadow: 'var(--shadow-sm)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 7v4h2.5L9 14V4L5.5 7H3z" stroke="var(--mint-ink)" strokeWidth="1.5" strokeLinejoin="round" />
            {sound && <path d="M11.5 6.5a3 3 0 0 1 0 5M13.5 4.5a6 6 0 0 1 0 9" stroke="var(--mint-ink)" strokeWidth="1.5" strokeLinecap="round" />}
          </svg>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>백색소음 <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>· 카페 소리</span></div>
          <div style={{ width: 42, height: 25, borderRadius: 999, background: sound ? 'var(--accentInk)' : 'var(--line)', position: 'relative', flexShrink: 0, transition: 'background .2s' }}>
            <div style={{ position: 'absolute', top: 3, left: sound ? 20 : 3, width: 19, height: 19, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transition: 'left .2s' }} />
          </div>
        </div>
      </Pad>
      <Grow />
      <Pad style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--card)', margin: '0 24px', border: '1px solid var(--line)', borderRadius: 22, padding: 16, boxSizing: 'border-box', boxShadow: 'var(--shadow-sm)' }}>
        <Buddy size={56} />
        <div style={{ fontSize: 15, lineHeight: 1.45 }}>내가 옆에서 <b>똑같이 {B_DURS[dur]}</b> 집중하고 있을게요. 멈추고 싶으면 말만 해요.</div>
      </Pad>
      <Grow />
      <Pad><BigButton kind="primary" onClick={() => setStep('focus')}>같이 시작하기</BigButton></Pad>
    </ScreenShell>
  );

  if (step === 'focus') return (
    <FocusTimer task={task} acc={B_ACC} minutes={B_MIN[dur]}
      onBack={() => setStep('prepare')} onHome={onHome}
      onDone={() => { onComplete(B_MIN[dur]); setStep('done'); }} />
  );

  return (
    <ScreenShell {...B_ACC} onReset={onHome}>
      <Grow />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Buddy size={104} mood="cheer" pop />
        <Spacer h={22} />
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.025em' }}>같이 해냈어요!<br />덕분에 나도 뿌듯해요.</div>
        <Spacer h={12} />
        <div style={{ fontSize: 15, color: 'var(--muted)' }}>혼자였으면 더 힘들었을 거예요.</div>
      </Pad>
      <Grow />
      <Pad style={{ display: 'flex', gap: 10 }}>
        <BigButton kind="ghost" style={{ flex: 1 }} onClick={onHome}>홈으로</BigButton>
        <BigButton kind="primary" style={{ flex: 1 }} onClick={() => setStep('prepare')}>한 판 더</BigButton>
      </Pad>
    </ScreenShell>
  );
}
