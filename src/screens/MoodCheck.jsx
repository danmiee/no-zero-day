import { useState } from 'react';
import { themeMeta } from '../lib/theme';
import ScreenShell   from '../components/ui/ScreenShell';
import { Eyebrow, Pad, Spacer, Grow } from '../components/ui/primitives';
import Chip          from '../components/ui/Chip';
import BigButton     from '../components/ui/BigButton';
import Buddy         from '../components/ui/Buddy';

const ENERGY   = ['낮음', '보통', '높음'];
const FEELINGS = ['막막함', '외로움', '지루함', '불안함'];

export default function MoodCheck({ task, onConfirm, onSkip, onBack }) {
  const meta = themeMeta();
  const [energy, setEnergy] = useState(null);
  const [feel,   setFeel]   = useState(null);

  return (
    <ScreenShell onBack={onBack}>
      <Pad>
        <Eyebrow>「{task.t}」 시작 전</Eyebrow>
        <Spacer h={12} />
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.03em' }}>지금 마음이<br />어때요?</div>
        <Spacer h={7} />
        <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>딱 맞는 시작법을 {meta.mascot}가 골라줄게요.</div>
      </Pad>
      <Spacer h={26} />
      <Pad>
        <Eyebrow style={{ marginBottom: 10 }}>지금 에너지</Eyebrow>
        <div style={{ display: 'flex', gap: 8 }}>
          {ENERGY.map((e) => (
            <Chip key={e} active={energy === e} onClick={() => setEnergy(e)} style={{ flex: 1, textAlign: 'center', padding: '13px 0' }}>{e}</Chip>
          ))}
        </div>
      </Pad>
      <Spacer h={22} />
      <Pad>
        <Eyebrow style={{ marginBottom: 10 }}>지금 기분</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FEELINGS.map((f) => (
            <Chip key={f} active={feel === f} onClick={() => setFeel(f)} style={{ padding: '11px 16px' }}>{f}</Chip>
          ))}
        </div>
      </Pad>
      <Grow />
      <Pad>
        <BigButton kind="primary" disabled={!energy && !feel} onClick={() => onConfirm({ energy, feel })}>{meta.mascot} 추천 받기</BigButton>
        <Spacer h={10} />
        <BigButton kind="ghost" onClick={onSkip}>괜찮아요, 바로 고를게요</BigButton>
      </Pad>
    </ScreenShell>
  );
}
