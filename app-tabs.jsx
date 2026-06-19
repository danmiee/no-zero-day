// app-tabs.jsx — FocusTimer, AddTask, Records, Profile, Prototype root.
// Load AFTER app-ui.jsx and app-flows.jsx.

const { useState: useS, useEffect: useE, useRef: useR } = React;

const fmt = (n) => String(n).padStart(2, '0');

// ── FOCUS TIMER (live countdown) ──────────────────────────────
function FocusTimer({ task, acc, minutes, tint, variant, onBack, onHome, onDone }) {
  const total = minutes * 60;
  const [left, setLeft] = useS(total);
  const [running, setRunning] = useS(true);
  useE(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((v) => (v <= 1 ? (clearInterval(id), 0) : v - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  useE(() => { if (left === 0) onDone(minutes); }, [left]);

  const elapsedMin = Math.max(0, Math.round((total - left) / 60));
  const mm = Math.floor(left / 60), ss = left % 60;
  const pct = ((total - left) / total) * 100;
  const time = fmt(mm) + ':' + fmt(ss);

  if (variant === 'big') return (
    <ScreenShell {...acc} tint={tint} onBack={onBack} onReset={onHome}>
      <Pad><Eyebrow>진행 중 · {task.t}</Eyebrow></Pad>
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
      <Pad><Eyebrow>함께 집중 중 · {task.t}</Eyebrow></Pad>
      <Grow />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 196, height: 196 }}>
          <svg width="196" height="196" viewBox="0 0 196 196" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="98" cy="98" r="90" fill="none" stroke="var(--accent)" strokeWidth="8" />
            <circle cx="98" cy="98" r="90" fill="none" stroke="var(--accentInk)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 90} strokeDashoffset={2 * Math.PI * 90 * (1 - pct / 100)}
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

// ── ADD TASK (제목 + 날짜 + 시간) ─────────────────────────────
const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + fmt(d.getMonth() + 1) + '-' + fmt(d.getDate()); };
const addDaysISO = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + fmt(d.getMonth() + 1) + '-' + fmt(d.getDate()); };
function whenLabel(iso) {
  if (!iso) return '날짜 없음';
  if (iso === todayISO()) return '오늘';
  if (iso === addDaysISO(1)) return '내일';
  if (iso === addDaysISO(2)) return '모레';
  const [, m, d] = iso.split('-');
  return parseInt(m) + '월 ' + parseInt(d) + '일';
}
function timeLabel(t) {
  if (!t) return null;
  let [h, m] = t.split(':').map(Number);
  const ap = h < 12 ? '오전' : '오후';
  h = h % 12; if (h === 0) h = 12;
  return ap + ' ' + h + ':' + fmt(m);
}

const fieldStyle = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--ui)', fontSize: 16,
  color: 'var(--ink)', background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 16, padding: '15px 16px', outline: 'none', boxShadow: 'var(--shadow-sm)',
  letterSpacing: '-0.01em', WebkitAppearance: 'none',
};

function AddTask({ onAdd, onBack }) {
  const [title, setTitle] = useS('');
  const [date, setDate] = useS(todayISO());
  const [time, setTime] = useS('');
  const [est, setEst] = useS(null);
  const quick = [['오늘', todayISO()], ['내일', addDaysISO(1)], ['모레', addDaysISO(2)]];
  const timeQuick = [['안 정함', ''], ['오전 9시', '09:00'], ['오후 2시', '14:00'], ['오후 6시', '18:00']];
  const estQuick = [['5분', 5], ['15분', 15], ['30분', 30], ['1시간', 60]];

  return (
    <ScreenShell onBack={onBack}>
      <Pad>
        <Eyebrow>할 일 추가</Eyebrow>
        <Spacer h={12} />
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.03em' }}>무엇을<br />미루고 있나요?</div>
      </Pad>
      <Spacer h={22} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Pad style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <Eyebrow style={{ marginBottom: 9 }}>할 일</Eyebrow>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 빨래 개기" style={fieldStyle} />
          </div>

          <div>
            <Eyebrow style={{ marginBottom: 9 }}>언제 할까요</Eyebrow>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {quick.map(([label, iso]) => <Chip key={label} active={date === iso} onClick={() => setDate(iso)} style={{ flex: 1, textAlign: 'center', padding: '11px 0' }}>{label}</Chip>)}
            </div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={fieldStyle} />
          </div>

          <div>
            <Eyebrow style={{ marginBottom: 9 }}>시간 (선택)</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {timeQuick.map(([label, val]) => <Chip key={label} active={time === val} onClick={() => setTime(val)} style={{ padding: '10px 14px' }}>{label}</Chip>)}
            </div>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={fieldStyle} />
          </div>

          <div>
            <Eyebrow style={{ marginBottom: 9 }}>얼마나 걸릴 것 같아요? (선택)</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {estQuick.map(([label, val]) => <Chip key={label} active={est === val} onClick={() => setEst(est === val ? null : val)} style={{ padding: '10px 16px' }}>{label}</Chip>)}
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

// ── 기록 (records) ────────────────────────────────────────────
function Records({ history, streak, tab, onTab }) {
  const totalMin = history.reduce((a, b) => a + b.minutes, 0);
  const week = history.length; // 데모: 전체를 이번 주로
  const byMethod = { a: 0, b: 0, c: 0 };
  history.forEach((h) => { byMethod[h.method] = (byMethod[h.method] || 0) + 1; });
  const topMethod = Object.keys(byMethod).sort((a, b) => byMethod[b] - byMethod[a])[0];
  const topName = (METHOD_META[topMethod] || {}).name;
  return (
    <ScreenShell pb={0}>
      <Pad>
        <Eyebrow>기록</Eyebrow>
        <Spacer h={10} />
        <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.03em' }}>시작한 순간들</div>
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
                <Eyebrow style={{ color: 'var(--mint-ink)' }}>이번 주 돌아보기</Eyebrow>
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
          {history.length === 0 && <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, padding: '30px 0' }}>아직 기록이 없어요. 딱 한 걸음만 시작해볼까요?</div>}
          {history.map((h) => {
            const m = METHOD_META[h.method] || METHOD_META.a;
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

// ── 나 (profile) ──────────────────────────────────────────────
function Profile({ state, onReset, onTheme, tab, onTab }) {
  const settings = [
    ['집중 알림', '하루 1번, 부드럽게'],
    ['마스코트', '콩이'],
  ];
  const themes = [['simple', '심플'], ['cute', '귀여움'], ['calm', '차분함']];
  return (
    <ScreenShell pb={0}>
      <Pad>
        <Eyebrow>나</Eyebrow>
      </Pad>
      <Spacer h={14} />
      <Pad style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Plant seeds={state.seeds} size={104} />
        <Spacer h={6} />
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{state.name}님의 {PLANT_STAGES[plantStage(state.seeds)]}</div>
        <Spacer h={4} />
        <div style={{ fontSize: 13.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>시작할 때마다 씨앗이 자라요. 작게, 꾸준히.</div>
      </Pad>
      <Spacer h={20} />
      <Pad style={{ display: 'flex', gap: 10 }}>
        {[[state.streak, '연속 시작', '일'], [state.seeds, '모은 씨앗', '개'], [state.history.length, '총 시작', '회']].map(([n, l, u], i) => (
          <Card key={i} style={{ flex: 1, textAlign: 'center', padding: '16px 6px' }}>
            <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--lav-ink)' }}>{n}<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>{u}</span></div>
            <Eyebrow style={{ marginTop: 5, fontSize: 10 }}>{l}</Eyebrow>
          </Card>
        ))}
      </Pad>
      <Spacer h={20} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Pad><Eyebrow>테마</Eyebrow></Pad>
        <Spacer h={10} />
        <Pad style={{ display: 'flex', gap: 8 }}>
          {themes.map(([k, l]) => (
            <Chip key={k} active={(state.theme || 'simple') === k} onClick={() => onTheme(k)} style={{ flex: 1, textAlign: 'center', padding: '13px 0' }}>{l}</Chip>
          ))}
        </Pad>
        <Spacer h={22} />
        <Pad><Eyebrow>설정</Eyebrow></Pad>
        <Spacer h={10} />
        <Pad>
          <Card style={{ padding: '4px 18px' }}>
            {settings.map(([k, v], i) => (
              <div key={k} className="tap" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                <div style={{ flex: 1, fontSize: 15.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{k}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{v}</div>
                <Chevron />
              </div>
            ))}
          </Card>
          <Spacer h={12} />
          <div className="tap" onClick={onReset} style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', padding: '12px 0' }}>데이터 초기화</div>
        </Pad>
      </div>
      <TabBar active={tab} onTab={onTab} />
    </ScreenShell>
  );
}

// ── ROOT NAVIGATOR ────────────────────────────────────────────
function Prototype() {
  const store = useStore();
  const { state } = store;
  const [nav, setNav] = useS({ tab: 'home', screen: 'tab', task: null, method: null });

  const goTab = (tab) => setNav({ tab, screen: 'tab', task: null, method: null });
  const goHome = () => setNav({ tab: 'home', screen: 'tab', task: null, method: null });

  useE(() => { document.documentElement.dataset.theme = state.theme || 'simple'; }, [state.theme]);

  if (nav.screen === 'tab') {
    if (nav.tab === 'records') return <Records history={state.history} streak={state.streak} tab="records" onTab={goTab} />;
    if (nav.tab === 'me') return <Profile state={state} onReset={store.reset} onTheme={store.setTheme} tab="me" onTab={goTab} />;
    return <Home tasks={state.tasks} theme={state.theme || 'simple'} tab="home" onTab={goTab}
      onPick={(task) => setNav({ ...nav, screen: 'mood', task, mood: null })}
      onAdd={() => setNav({ ...nav, screen: 'add' })}
      onRemove={store.removeTask} />;
  }

  if (nav.screen === 'add')
    return <AddTask onBack={goHome} onAdd={(data) => { store.addTask(data); goHome(); }} />;

  if (nav.screen === 'mood')
    return <MoodCheck task={nav.task} onBack={goHome}
      onSkip={() => setNav({ ...nav, screen: 'method', mood: null })}
      onConfirm={(mood) => { store.setMood(mood); setNav({ ...nav, screen: 'method', mood }); }} />;

  if (nav.screen === 'method')
    return <MethodChooser task={nav.task} onBack={goHome} recommended={nav.mood ? recommendMethod(nav.mood) : null}
      onPick={(method) => setNav({ ...nav, screen: 'flow', method })} />;

  const Flow = { a: FlowA, b: FlowB, c: FlowC }[nav.method];
  const label = (METHOD_META[nav.method] || {}).name;
  return <Flow task={nav.task}
    onBack={() => setNav({ ...nav, screen: 'method' })}
    onHome={goHome}
    onComplete={(minutes) => store.completeSession(nav.task.t, nav.method, label, minutes, nav.task.estimate)} />;
}

Object.assign(window, { FocusTimer, AddTask, Records, Profile, Prototype });
