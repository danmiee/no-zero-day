// app-flows.jsx — Home, MethodChooser, FlowA/B/C. Load AFTER app-ui.jsx.
// Relies on window globals from app-ui.jsx.

const { useState: useStateF } = React;

// ── HOME · 오늘 (tab root) ────────────────────────────────────
function Home({ tasks, theme, onPick, onAdd, tab, onTab }) {
  const [focusOne, setFocusOne] = useStateF(false);
  const copy = {
    garden: { title: ['오늘 뭘', '돌볼까요?'], line: '작은 씨앗 하나만 돌봐도 충분해요.', empty: '오늘 정원은 쉬는 날이에요. 물만 살짝 주고 쉬어요.' },
    exploration: { title: ['어디로', '떠날까요?'], line: '지도가 복잡해도 첫 표식만 찍으면 돼요.', empty: '오늘 지도는 비어 있어요. 쉬어 가도 좋아요.' },
    cafe: { title: ['자리에', '앉아볼까요?'], line: '따뜻하게 시작할 한 잔만 고르면 돼요.', empty: '오늘 카페는 조용해요. 잠깐 쉬어도 괜찮아요.' },
  }[theme] || themeMeta('garden');
  const line = tasks.length === 0 ? copy.empty : copy.line;
  const pickRandom = () => { if (tasks.length) onPick(tasks[Math.floor(Math.random() * tasks.length)]); };
  const shown = focusOne && tasks.length ? [tasks[0]] : tasks;

  return (
    <ScreenShell pb={0}>
      <Pad>
        <div style={{ height: 14 }} />
        <Spacer h={10} />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: theme === 'exploration' ? 30 : 28, fontWeight: 700, lineHeight: 1.22, letterSpacing: '-0.032em' }}>{copy.title[0]}<br />{copy.title[1]}</div>
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
          {shown.map((x, i) => {
            return (
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
            );
          })}
          {!focusOne && (
            <div className="tap" onClick={onAdd} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: '15px 18px', borderRadius: 18, border: '1.5px dashed var(--line)',
              color: 'var(--muted)', fontSize: 15, fontWeight: 500,
            }}>
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

// ── MOOD · 기분 체크인 → 추천 ─────────────────────────────────
const ENERGY = ['낮음', '보통', '높음'];
const FEELINGS = ['막막함', '외로움', '지루함', '불안함'];
function MoodCheck({ task, onConfirm, onSkip, onBack }) {
  const meta = themeMeta();
  const [energy, setEnergy] = useStateF(null);
  const [feel, setFeel] = useStateF(null);
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
          {ENERGY.map((e) => <Chip key={e} active={energy === e} onClick={() => setEnergy(e)} style={{ flex: 1, textAlign: 'center', padding: '13px 0' }}>{e}</Chip>)}
        </div>
      </Pad>
      <Spacer h={22} />
      <Pad>
        <Eyebrow style={{ marginBottom: 10 }}>지금 기분</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FEELINGS.map((f) => <Chip key={f} active={feel === f} onClick={() => setFeel(f)} style={{ padding: '11px 16px' }}>{f}</Chip>)}
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

// ── METHOD · 시작 방법 ────────────────────────────────────────
const METHOD_LIST = [
  { id: 'a', name: '쪼개기', desc: '잘게 나눠 딱 한 걸음부터', accent: 'var(--lav)', accentInk: 'var(--lav-ink)' },
  { id: 'b', name: '같이하기', desc: '옆에서 함께 집중', accent: 'var(--mint)', accentInk: 'var(--mint-ink)' },
  { id: 'c', name: '일단 5분', desc: '딱 5분만, 부담 없이 시작', accent: 'var(--peach)', accentInk: 'var(--peach-ink)' },
];

function MethodChooser({ task, onPick, onBack, recommended }) {
  const theme = currentThemeKey();
  const meta = themeMeta(theme);
  const ordered = recommended
    ? [...METHOD_LIST].sort((a, b) => (a.id === recommended ? -1 : b.id === recommended ? 1 : 0))
    : METHOD_LIST;
  return (
    <ScreenShell onBack={onBack}>
      <Pad>
        <Eyebrow>{meta.name} · {meta.action} 방법</Eyebrow>
        <Spacer h={12} />
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.36, letterSpacing: '-0.025em' }}>
          <span style={{ color: 'var(--muted)' }}>「{task.t}」</span><br />어떻게 {meta.action}할까요?
        </div>
      </Pad>
      <Spacer h={20} />
      {recommended && (
        <Pad style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--muted)' }}>
            <Buddy size={26} mood="cheer" />
            <span>{meta.mascot} 생각엔 <b style={{ color: 'var(--ink)' }}>{(METHOD_META[recommended] || {}).name}</b>가 잘 맞을 것 같아요.</span>
          </div>
        </Pad>
      )}
      <Pad style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {ordered.map((m) => {
          const reco = m.id === recommended;
          return (
            <div key={m.id} className="tap" onClick={() => onPick(m.id)} style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 15, padding: '19px 19px',
              background: m.accent, borderRadius: 22,
              border: reco ? '2px solid ' + m.accentInk : '2px solid transparent',
              boxShadow: '0 6px 18px -8px color-mix(in oklch, ' + m.accentInk + ' 45%, transparent)',
            }}>
              {reco && <div style={{ position: 'absolute', top: -9, left: 18, background: m.accentInk, color: '#fff', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, padding: '3px 9px', borderRadius: 999 }}>{meta.mascot} 추천</div>}
              <div style={{ width: 46, height: 46, borderRadius: 15, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
                <MethodIcon id={m.id} color={m.accentInk} size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: m.accentInk }}>{m.name}</div>
                <div style={{ fontSize: 13, color: m.accentInk, opacity: 0.78, marginTop: 3 }}>{reco ? RECO_WHY[m.id] : m.desc}</div>
              </div>
              <svg width="9" height="15" viewBox="0 0 9 15" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}><path d="M1.5 1.5L7 7.5l-5.5 6" stroke={m.accentInk} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          );
        })}
      </Pad>
      <Grow />
      <Pad>
        <BigButton kind="ghost" onClick={() => onPick(recommended || METHOD_LIST[Math.floor(Math.random() * 3)].id)}>잘 모르겠어요 · {meta.mascot}가 골라줘</BigButton>
      </Pad>
    </ScreenShell>
  );
}

// ── FLOW A · 쪼개기 ───────────────────────────────────────────
// 모든 단계를 자유롭게 고를 수 있음: 아무 거나 탭 → 집중 → 완료 체크 → 목록 복귀.
const A_ACC = { accent: 'var(--lav)', accentInk: 'var(--lav-ink)' };
function FlowA({ task, onBack, onHome, onComplete }) {
  const flowCopy = {
    garden: { title: '작은 화단으로 나눴어요.', sub: '하나만 골라 돌보면 돼요.', done: '한 걸음씩 돌보니까 자라났어요.' },
    exploration: { title: '지도를 조각냈어요.', sub: '가장 가까운 표식부터 찍어요.', done: '표식을 찍다 보니 길이 열렸어요.' },
    cafe: { title: '메뉴를 작게 나눴어요.', sub: '한 잔씩 천천히 주문해요.', done: '천천히 해도 충분히 도착했어요.' },
  }[currentThemeKey()] || { title: '작은 화단으로 나눴어요.', sub: '하나만 골라 돌보면 돼요.', done: '한 걸음씩 돌보니까 자라났어요.' };
  const [step, setStep] = useStateF('split');
  const [done, setDone] = useStateF([]);      // 완료된 단계 인덱스 배열
  const [cur, setCur] = useStateF(0);         // 지금 집중 중인 단계
  const [tiny, setTiny] = useStateF(false);   // 0번 단계 더 잘게
  const [tinyLabel, setTinyLabel] = useStateF(task.tiny || '딱 10초만 쳐다보기');
  const [steps, setSteps] = useStateF(task.steps && task.steps.length ? task.steps : GENERIC_STEPS);
  const [draftLabel, setDraftLabel] = useStateF('');
  const [editingCur, setEditingCur] = useStateF(false);
  const label = (i) => (tiny && i === 0 ? tinyLabel : steps[i]);
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
              <Card key={i} onClick={d ? undefined : () => { setCur(i); setDraftLabel(label(i)); setEditingCur(false); setStep('doing'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 17px', opacity: d ? 0.6 : 1, background: d ? 'var(--bg)' : 'var(--card)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: d ? 'var(--accentInk)' : 'var(--accent)', color: d ? '#fff' : 'var(--accentInk)', fontSize: 14, fontWeight: 700 }}>
                  {d ? <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M3 8l3 3 6-7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
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
          ? <BigButton kind="primary" onClick={allDone ? () => { onComplete(steps.length); setStep('done'); } : finishEarly}>{allDone ? '다 끝냈어요!' : `여기까지 마무리 (${done.length}/${steps.length})`}</BigButton>
          : <BigButton kind="ghost" onClick={() => setTiny(true)}>{tiny ? '이미 최대한 쪼갰어요' : '첫 단계가 부담되면 · 더 잘게 쪼개줘'}</BigButton>}
      </Pad>
    </ScreenShell>
  );

  if (step === 'doing') return (
    <ScreenShell {...A_ACC} onBack={() => setStep('split')} onReset={onHome}>
      <Pad>
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: isDone(i) ? 'var(--accentInk)' : (i === cur ? 'var(--accent)' : 'var(--line)') }} />)}
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
        <Spacer h={14} />
        {editingCur ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} style={{ flex: 1, minWidth: 0, fontFamily: 'var(--ui)', fontSize: 15, color: 'var(--ink)', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '12px 13px', outline: 'none' }} />
            <Chip active={true} onClick={() => {
              if (tiny && cur === 0) setTinyLabel(draftLabel.trim() || tinyLabel);
              else {
                const next = steps.slice();
                next[cur] = draftLabel.trim() || steps[cur];
                setSteps(next);
              }
              setEditingCur(false);
            }} style={{ padding: '12px 14px' }}>저장</Chip>
          </div>
        ) : (
          <Chip onClick={() => { setDraftLabel(label(cur)); setEditingCur(true); }} style={{ display: 'inline-flex', padding: '10px 14px', fontSize: 13.5 }}>이 단계만 바꾸기</Chip>
        )}
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
        <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.025em' }}>{allDone ? `${task.t}, 끝까지 해냈어요!` : `${done.length}단계나 해냈어요!`}</div>
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

// ── FLOW B · 같이하기 ─────────────────────────────────────────
const B_ACC = { accent: 'var(--mint)', accentInk: 'var(--mint-ink)' };
const B_DURS = ['10분', '25분', '45분'];
const B_MIN = [10, 25, 45];
function FlowB({ task, onBack, onHome, onComplete }) {
  const flowCopy = {
    garden: { ask: '같이 물 주듯 시작해볼까요?', sub: '혼자 하기 싫은 일도 함께 돌보면 쉬워져요.', session: '정원 같이 돌보기' },
    exploration: { ask: '같이 탐험을 시작할까요?', sub: '혼자 가기 애매한 길은 나란히 걸으면 돼요.', session: '동행 탐험 세션' },
    cafe: { ask: '같은 테이블에 앉아볼까요?', sub: '조용히 옆자리를 지켜줄게요.', session: '카페 집중 자리' },
  }[currentThemeKey()] || { ask: '같이 물 주듯 시작해볼까요?', sub: '혼자 하기 싫은 일도 함께 돌보면 쉬워져요.', session: '정원 같이 돌보기' };
  const [step, setStep] = useStateF('propose');
  const [dur, setDur] = useStateF(1);
  const [together] = useStateF(() => 1180 + Math.floor(Math.random() * 160));
  const [sound, setSound] = useStateF(false);
  const togetherStr = together.toLocaleString();

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
        {B_DURS.map((d, i) => <Chip key={d} active={i === dur} onClick={() => setDur(i)} style={{ flex: 1, textAlign: 'center', padding: '16px 0', fontSize: 17 }}>{d}</Chip>)}
      </Pad>
      <Spacer h={12} />
      <Pad>
        <div className="tap" onClick={() => setSound((s) => !s)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '13px 16px', boxShadow: 'var(--shadow-sm)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 7v4h2.5L9 14V4L5.5 7H3z" stroke="var(--mint-ink)" strokeWidth="1.5" strokeLinejoin="round" />{sound && <path d="M11.5 6.5a3 3 0 0 1 0 5M13.5 4.5a6 6 0 0 1 0 9" stroke="var(--mint-ink)" strokeWidth="1.5" strokeLinecap="round" />}</svg>
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

  if (step === 'focus') return <FocusTimer task={task} acc={B_ACC} minutes={B_MIN[dur]}
    onBack={() => setStep('prepare')} onHome={onHome}
    onDone={() => { onComplete(B_MIN[dur]); setStep('done'); }} />;

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

// ── FLOW C · 일단 5분 ─────────────────────────────────────────
const C_ACC = { accent: 'var(--peach)', accentInk: 'var(--peach-ink)' };
function FlowC({ task, onBack, onHome, onComplete }) {
  const progress = progressMeta(currentThemeKey());
  const flowCopy = {
    garden: { title: '일단 5분 · ', button: '5분만 돌보기', reward: ['일단 손댔더니', '새싹이 올라왔어요!'] },
    exploration: { title: '첫 발자국 · ', button: '5분만 출발하기', reward: ['첫 발자국을 찍었더니', '길이 보였어요!'] },
    cafe: { title: '첫 한 모금 · ', button: '5분만 앉아보기', reward: ['잠깐 앉았더니', '여기까지 왔어요!'] },
  }[currentThemeKey()] || { title: '일단 5분 · ', button: '5분만 돌보기', reward: ['일단 손댔더니', '새싹이 올라왔어요!'] };
  const [step, setStep] = useStateF('start');

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

  if (step === 'timer') return <FocusTimer task={task} acc={C_ACC} minutes={5} tint="var(--peach-soft)" variant="big"
    onBack={() => setStep('start')} onHome={onHome}
    onDone={(elapsed) => { onComplete(Math.max(1, elapsed)); setStep('reward'); }} />;

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

Object.assign(window, { Home, MethodChooser, FlowA, FlowB, FlowC, METHOD_LIST });
