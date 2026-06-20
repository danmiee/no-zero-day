import { useState } from 'react';
import { currentThemeKey } from '../lib/theme';
import { todayISO, addDaysISO, whenLabel, timeLabel } from '../lib/date';
import ScreenShell from '../components/ui/ScreenShell';
import { Eyebrow, Pad, Spacer } from '../components/ui/primitives';
import Chip      from '../components/ui/Chip';
import BigButton from '../components/ui/BigButton';

const fieldStyle = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--ui)', fontSize: 16,
  color: 'var(--ink)', background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 16, padding: '15px 16px', outline: 'none', boxShadow: 'var(--shadow-sm)',
  letterSpacing: '-0.01em', WebkitAppearance: 'none',
};

export default function AddTask({ onAdd, onBack }) {
  const theme = currentThemeKey();
  const copy = {
    garden:      { eyebrow: '씨앗 추가',   title: ['무엇을', '심어둘까요?'],     field: '돌볼 일',     placeholder: '예: 빨래 개기' },
    exploration: { eyebrow: '퀘스트 추가', title: ['어떤 길로', '떠날까요?'],    field: '퀘스트',      placeholder: '예: 빨래 개기' },
    cafe:        { eyebrow: '주문 추가',   title: ['무엇을', '주문해둘까요?'],   field: '오늘의 주문', placeholder: '예: 빨래 개기' },
  }[theme] || { eyebrow: '씨앗 추가', title: ['무엇을', '심어둘까요?'], field: '돌볼 일', placeholder: '예: 빨래 개기' };

  const [title, setTitle] = useState('');
  const [date,  setDate]  = useState(todayISO());
  const [time,  setTime]  = useState('');
  const [est,   setEst]   = useState(null);

  const quick     = [['오늘', todayISO()], ['내일', addDaysISO(1)], ['모레', addDaysISO(2)]];
  const timeQuick = [['안 정함', ''], ['오전 9시', '09:00'], ['오후 2시', '14:00'], ['오후 6시', '18:00']];
  const estQuick  = [['5분', 5], ['15분', 15], ['30분', 30], ['1시간', 60]];

  return (
    <ScreenShell onBack={onBack}>
      <Pad>
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <Spacer h={12} />
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.03em' }}>{copy.title[0]}<br />{copy.title[1]}</div>
      </Pad>
      <Spacer h={22} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Pad style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <Eyebrow style={{ marginBottom: 9 }}>{copy.field}</Eyebrow>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={copy.placeholder} style={fieldStyle} />
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 9 }}>언제 할까요</Eyebrow>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {quick.map(([lbl, iso]) => (
                <Chip key={lbl} active={date === iso} onClick={() => setDate(iso)} style={{ flex: 1, textAlign: 'center', padding: '11px 0' }}>{lbl}</Chip>
              ))}
            </div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 9 }}>시간 (선택)</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {timeQuick.map(([lbl, val]) => (
                <Chip key={lbl} active={time === val} onClick={() => setTime(val)} style={{ padding: '10px 14px' }}>{lbl}</Chip>
              ))}
            </div>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={fieldStyle} />
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 9 }}>얼마나 걸릴 것 같아요? (선택)</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {estQuick.map(([lbl, val]) => (
                <Chip key={lbl} active={est === val} onClick={() => setEst(est === val ? null : val)} style={{ padding: '10px 16px' }}>{lbl}</Chip>
              ))}
            </div>
            <Spacer h={8} />
            <div style={{ fontSize: 12.5, color: 'var(--faint)' }}>나중에 실제 걸린 시간과 비교해서 보여드려요.</div>
          </div>
        </Pad>
        <Spacer h={20} />
      </div>
      <Pad>
        <BigButton kind="primary" disabled={!title.trim()} onClick={() => onAdd({ t: title, when: whenLabel(date), time: timeLabel(time), estimate: est })}>
          {title.trim() ? '추가하기' : '할 일을 입력해 주세요'}
        </BigButton>
      </Pad>
    </ScreenShell>
  );
}
