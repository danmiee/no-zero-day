import { useState, useRef } from 'react';
import { currentThemeKey } from '../lib/theme';
import { todayISO, addDaysISO, whenLabel, timeLabel } from '../lib/date';
import ScreenShell from '../components/ui/ScreenShell';
import { Eyebrow, Pad, Spacer } from '../components/ui/primitives';
import Chip      from '../components/ui/Chip';
import BigButton from '../components/ui/BigButton';

const GENERIC_STEPS = [
  '아무것도 안 하고 그냥 자리에 앉기',
  '필요한 것 딱 1개만 꺼내기',
  '1분만 손대보기',
  '5분만 이어가기',
  '한 단계만 더 해보기',
];

const fieldStyle = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--ui)', fontSize: 16,
  color: 'var(--ink)', background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 16, padding: '15px 16px', outline: 'none', boxShadow: 'var(--shadow-sm)',
  letterSpacing: '-0.01em', WebkitAppearance: 'none',
};

export default function AddTask({ task, onAdd, onBack }) {
  const theme   = currentThemeKey();
  const editing = !!task;

  const copy = {
    garden:      { eyebrow: editing ? '씨앗 수정'   : '씨앗 추가',   title: editing ? ['어떻게', '바꿀까요?']   : ['무엇을', '심어둘까요?'],   field: '돌볼 일',     placeholder: '예: 빨래 개기' },
    exploration: { eyebrow: editing ? '퀘스트 수정' : '퀘스트 추가', title: editing ? ['경로를', '고쳐볼까요?'] : ['어떤 길로', '떠날까요?'],  field: '퀘스트',      placeholder: '예: 빨래 개기' },
    cafe:        { eyebrow: editing ? '주문 수정'   : '주문 추가',   title: editing ? ['주문을', '고쳐볼까요?'] : ['무엇을', '주문해둘까요?'], field: '오늘의 주문', placeholder: '예: 빨래 개기' },
  }[theme] || { eyebrow: '씨앗 추가', title: ['무엇을', '심어둘까요?'], field: '돌볼 일', placeholder: '예: 빨래 개기' };

  const [title, setTitle] = useState(task ? task.t : '');
  const [date,  setDate]  = useState(task && task.dateISO ? task.dateISO : todayISO());
  const [time,  setTime]  = useState(task && task.timeValue ? task.timeValue : '');
  const [est,   setEst]   = useState(task && task.estimate ? task.estimate : null);
  const [tiny,  setTiny]  = useState(task && task.tiny ? task.tiny : '딱 10초만 쳐다보기');
  const [steps, setSteps] = useState(task && task.steps && task.steps.length ? task.steps : GENERIC_STEPS);
  const dateInputRef = useRef(null);

  const quick     = [['오늘', todayISO()], ['내일', addDaysISO(1)], ['모레', addDaysISO(2)]];
  const timeQuick = [['안 정함', ''], ['오전 9시', '09:00'], ['오후 2시', '14:00'], ['오후 6시', '18:00']];
  const estQuick  = [['5분', 5], ['15분', 15], ['30분', 30], ['1시간', 60]];

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (input.showPicker) input.showPicker();
    else input.click();
  };

  const updateStep = (idx, value) => setSteps((items) => items.map((item, i) => i === idx ? value : item));
  const removeStep = (idx) => setSteps((items) => items.length <= 1 ? items : items.filter((_, i) => i !== idx));
  const addStep    = () => setSteps((items) => [...items, '']);
  const cleanSteps = () => steps.map((s) => s.trim()).filter(Boolean);

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
            <div className="tap" onClick={openDatePicker} style={{ ...fieldStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer' }}>
              <span>{whenLabel(date)}</span>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" style={{ color: 'var(--ink)', flexShrink: 0 }}>
                <rect x="3" y="4" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 2.8v2.5M11.5 2.8v2.5M3.4 7h10.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input ref={dateInputRef} type="date" value={date} onChange={(e) => setDate(e.target.value)}
                style={{ position: 'absolute', right: 12, bottom: 8, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                tabIndex="-1" aria-hidden="true" />
            </div>
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
          <div>
            <Eyebrow style={{ marginBottom: 9 }}>쪼개기 단계</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {steps.map((stepText, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 999, background: 'var(--lav)', color: 'var(--lav-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                  <input value={stepText} onChange={(e) => updateStep(idx, e.target.value)} placeholder="작은 단계 입력"
                    style={{ ...fieldStyle, width: 'auto', minWidth: 0, padding: '12px 13px', fontSize: 14.5, flex: 1 }} />
                  <div className="tap" onClick={() => removeStep(idx)} style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </div>
                </div>
              ))}
            </div>
            <Spacer h={9} />
            <Chip onClick={addStep} style={{ display: 'inline-flex', padding: '10px 14px', fontSize: 13.5 }}>단계 추가</Chip>
            <Spacer h={14} />
            <Eyebrow style={{ marginBottom: 9 }}>첫 단계가 클 때</Eyebrow>
            <input value={tiny} onChange={(e) => setTiny(e.target.value)} placeholder="예: 딱 10초만 쳐다보기" style={fieldStyle} />
          </div>
        </Pad>
        <Spacer h={20} />
      </div>
      <Pad>
        <BigButton kind="primary" disabled={!title.trim()} onClick={() => {
          const nextSteps = cleanSteps();
          onAdd({ t: title, when: whenLabel(date), dateISO: date, time: timeLabel(time), timeValue: time, estimate: est, steps: nextSteps.length ? nextSteps : GENERIC_STEPS, tiny });
        }}>
          {title.trim() ? (editing ? '수정하기' : '추가하기') : '할 일을 입력해 주세요'}
        </BigButton>
      </Pad>
    </ScreenShell>
  );
}
