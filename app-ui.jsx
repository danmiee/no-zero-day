// app-ui.jsx — shared primitives + data store. Load FIRST.
// Exports everything to window so app-flows.jsx / app-tabs.jsx can use them.

const { useState, useEffect, useRef } = React;

// ── DATA STORE ────────────────────────────────────────────────
const STORE_KEY = 'gcn_store_v3';
const THEME_KEY_MAP = { simple: 'garden', cute: 'exploration', calm: 'cafe' };
function normalizeThemeKey(theme) {
  return THEME_KEY_MAP[theme] || theme || 'garden';
}

const GENERIC_STEPS = [
  '아무것도 안 하고 그냥 자리에 앉기',
  '필요한 것 딱 1개만 꺼내기',
  '1분만 손대보기',
  '5분만 이어가기',
  '한 단계만 더 해보기',
];

const STORE_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const storeFmt = (n) => String(n).padStart(2, '0');
function storeISOAddDays(n = 0) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + storeFmt(d.getMonth() + 1) + '-' + storeFmt(d.getDate());
}
function storeWhenLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const day = STORE_WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${String(y).slice(2)}.${storeFmt(m)}.${storeFmt(d)}.(${day})`;
}

const SEED_TASKS = [
  { id: 't1', t: '방 정리하기', when: storeWhenLabel(storeISOAddDays()), dateISO: storeISOAddDays(), time: null, note: '3일째 미루는 중', tiny: '바닥의 옷 1개만 줍기',
    steps: ['바닥의 옷 3개만 줍기', '쓰레기 한 줌 버리기', '책상 위 컵 치우기', '이불 펴기', '창문 열기'] },
  { id: 't2', t: '이메일 답장 보내기', when: storeWhenLabel(storeISOAddDays()), dateISO: storeISOAddDays(), time: '오후 2:00', timeValue: '14:00', note: '2일째 미루는 중', tiny: '받은편지함만 열어보기',
    steps: ['받은편지함 열기', '답장할 메일 1개만 고르기', '인사말 한 줄 쓰기', '핵심 한 문장 쓰기', '보내기 누르기'] },
  { id: 't3', t: '보고서 초안 쓰기', when: storeWhenLabel(storeISOAddDays()), dateISO: storeISOAddDays(), time: '오후 6:00', timeValue: '18:00', note: '오늘까지', tiny: '빈 문서만 열기',
    steps: ['빈 문서 열기', '제목만 적기', '목차 3줄 쓰기', '첫 문단 아무거나 쓰기', '한 단락 더 쓰기'] },
];

const SEED_HISTORY = [
  { id: 'h1', title: '설거지', method: 'b', methodLabel: '같이하기', date: '어제', minutes: 25 },
  { id: 'h2', title: '운동복 갈아입기', method: 'c', methodLabel: '일단 5분', date: '어제', minutes: 23 },
  { id: 'h3', title: '책상 정리', method: 'a', methodLabel: '쪼개기', date: '2일 전', minutes: 8 },
];

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        theme: normalizeThemeKey(parsed.theme),
        tasks: (parsed.tasks || []).map((task) => task.dateISO
          ? { ...task, when: storeWhenLabel(task.dateISO) }
          : task),
      };
    }
  } catch (e) {}
  return { tasks: SEED_TASKS, history: SEED_HISTORY, streak: 3, seeds: 5, name: '나', theme: 'garden', mood: null };
}

let _uid = Date.now();
const uid = () => 'id' + (_uid++);

function useStore() {
  const [state, setState] = useState(loadStore);
  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  const addTask = (task) => {
    const full = {
      id: uid(), t: task.t.trim(), when: task.when, dateISO: task.dateISO || null, time: task.time, timeValue: task.timeValue || '', note: null, estimate: task.estimate || null,
      tiny: task.tiny || '딱 10초만 쳐다보기', steps: task.steps && task.steps.length ? task.steps : GENERIC_STEPS,
    };
    setState((s) => ({ ...s, tasks: [full, ...s.tasks] }));
    return full;
  };
  const updateTask = (id, patch) => setState((s) => ({
    ...s,
    tasks: s.tasks.map((task) => task.id === id
      ? { ...task, ...patch, t: (patch.t || task.t).trim(), note: null }
      : task),
  }));
  const removeTask = (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) }));
  const completeSession = (title, method, methodLabel, minutes, estimate) => {
    setState((s) => ({
      ...s,
      seeds: s.seeds + 1,
      history: [{ id: uid(), title, method, methodLabel, date: '방금', minutes, estimate: estimate || null }, ...s.history],
    }));
  };
  const reset = () => setState({ tasks: SEED_TASKS, history: SEED_HISTORY, streak: 3, seeds: 5, name: '나', theme: normalizeThemeKey(state.theme), mood: null });
  const setTheme = (theme) => setState((s) => ({ ...s, theme: normalizeThemeKey(theme) }));
  const setMood = (mood) => setState((s) => ({ ...s, mood }));

  return { state, addTask, updateTask, removeTask, completeSession, reset, setTheme, setMood };
}

// 기분·에너지 → 추천 방식
function recommendMethod(mood) {
  if (!mood) return 'c';
  if (mood.energy === '낮음') return 'c';
  if (mood.feel === '외로움') return 'b';
  if (mood.feel === '막막함' || mood.feel === '불안함') return 'a';
  if (mood.energy === '높음') return 'a';
  return 'c';
}
const RECO_WHY = {
  a: '마음이 복잡할 때, 잘게 쪼개면 가벼워져요',
  b: '혼자가 아니라는 게 제일 큰 힘이 돼요',
  c: '지금은 딱 5분이면 충분해요',
};

const METHOD_META = {
  a: { name: '쪼개기', accent: 'var(--lav)', accentInk: 'var(--lav-ink)' },
  b: { name: '같이하기', accent: 'var(--mint)', accentInk: 'var(--mint-ink)' },
  c: { name: '일단 5분', accent: 'var(--peach)', accentInk: 'var(--peach-ink)' },
};

const THEME_META = {
  garden: { name: '정원', mascot: '새싹', home: '오늘의 정원', action: '돌보기' },
  exploration: { name: '탐험', mascot: '루트', home: '오늘의 지도', action: '출발' },
  cafe: { name: '카페', mascot: '모카', home: '오늘의 자리', action: '착석' },
};
function currentThemeKey() {
  return normalizeThemeKey(document.documentElement.dataset.theme);
}
function themeMeta(key) {
  return THEME_META[normalizeThemeKey(key || currentThemeKey())] || THEME_META.garden;
}

// ── PRIMITIVES ────────────────────────────────────────────────
function ScreenShell({ accent, accentInk, tint, onBack, onReset, pb, children }) {
  return (
    <div style={{
      height: '100%', boxSizing: 'border-box',
      paddingTop: (onBack || onReset) ? 52 : 56, paddingBottom: pb != null ? pb : 24,
      display: 'flex', flexDirection: 'column',
      background: tint || 'var(--screen-bg)',
      ['--accent']: accent || 'var(--lav)',
      ['--accentInk']: accentInk || 'var(--lav-ink)',
      fontFamily: 'var(--ui)', letterSpacing: '-0.011em',
      color: 'var(--ink)', animation: 'wfslide .3s cubic-bezier(.22,.61,.36,1) both',
    }}>
      {(onBack || onReset) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px 10px' }}>
          {onBack
            ? <div className="tap" onClick={onBack} style={{ width: 38, height: 38, borderRadius: 999, border: '1px solid var(--line)', background: 'var(--card)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M7.5 1.5L2 7.5l5.5 6" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            : <div style={{ width: 38 }} />}
          {onReset
            ? <div className="tap" onClick={onReset} style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 0.5, color: 'var(--faint)', padding: '8px 6px' }}>↺ 처음으로</div>
            : <div style={{ width: 38 }} />}
        </div>
      )}
      {children}
    </div>
  );
}

function Eyebrow({ children, style }) {
  return <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--faint)', ...style }}>{children}</div>;
}
function Pad({ children, style }) { return <div style={{ padding: '0 24px', ...style }}>{children}</div>; }
function Spacer({ h }) { return <div style={{ height: h }} />; }
function Grow() { return <div style={{ flex: 1 }} />; }

function Card({ children, style, onClick }) {
  return (
    <div className={onClick ? 'tap' : undefined} onClick={onClick} style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-card)', padding: 18,
      boxShadow: 'var(--shadow-sm)', ...style,
    }}>{children}</div>
  );
}

function BigButton({ children, kind = 'primary', style, onClick, disabled }) {
  const base = { width: '100%', boxSizing: 'border-box', border: 'none', borderRadius: 'var(--radius-button)', padding: '18px 20px', fontFamily: 'inherit', fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'center' };
  const looks = {
    primary: { background: 'var(--accent)', color: 'var(--accentInk)', boxShadow: '0 4px 14px -4px color-mix(in oklch, var(--accentInk) 32%, transparent)' },
    ghost: { background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--line)', fontWeight: 500, boxShadow: 'var(--shadow-sm)' },
  };
  const off = disabled ? { opacity: 0.4, pointerEvents: 'none' } : null;
  return <div className="tap" onClick={onClick} style={{ ...base, ...looks[kind], ...off, ...style }}>{children}</div>;
}

function Chip({ children, active, style, onClick }) {
  return (
    <div className="tap" onClick={onClick} style={{
      padding: '10px 16px', borderRadius: 'var(--radius-chip)', fontSize: 15, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
      border: active ? '1.5px solid var(--accentInk)' : '1px solid var(--line)',
      background: active ? 'var(--accent)' : 'var(--card)', boxShadow: active ? 'none' : 'var(--shadow-sm)',
      color: active ? 'var(--accentInk)' : 'var(--muted)', fontWeight: active ? 600 : 500, ...style,
    }}>{children}</div>
  );
}

function Chevron() {
  return <svg width="9" height="15" viewBox="0 0 9 15" fill="none" style={{ flexShrink: 0 }}><path d="M1.5 1.5L7 7.5l-5.5 6" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Check({ done }) {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 999, flexShrink: 0, border: done ? 'none' : '2px solid var(--faint)', background: done ? 'var(--accentInk)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {done && <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 8l3 3 6-7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </div>
  );
}
function Buddy({ size = 96, mood = 'smile', pop }) {
  const theme = currentThemeKey();
  const ink = 'var(--mascot-ink)';
  const st = { fill: 'none', stroke: ink, strokeWidth: 4.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const dot = (cx) => <circle cx={cx} cy="43" r="4.2" fill={ink} />;
  let eyes, mouth, extra = null;
  if (mood === 'cheer') {
    eyes = <g {...st}><path d="M30 45 Q35 39 40 45" /><path d="M60 45 Q65 39 70 45" /></g>;
    mouth = <path d="M35 55 Q50 70 65 55" {...st} />;
    extra = <g {...st} strokeWidth="3.4"><path d="M20 30l3 3M80 30l-3 3M50 16v4" /></g>;
  } else if (mood === 'gentle') {
    eyes = <g {...st}><path d="M31 44 Q35 41 39 44" /><path d="M61 44 Q65 41 69 44" /></g>;
    mouth = <path d="M42 58 Q50 63 58 58" {...st} />;
  } else if (mood === 'sleepy') {
    eyes = <g {...st}><path d="M31 43 H39" /><path d="M61 43 H69" /></g>;
    mouth = <circle cx="50" cy="60" r="3.4" {...st} />;
  } else if (mood === 'wink') {
    eyes = <g><path d="M31 43 H39" {...st} />{dot(65)}</g>;
    mouth = <path d="M38 56 Q50 65 62 56" {...st} />;
  } else {
    eyes = <g>{dot(35)}{dot(65)}</g>;
    mouth = <path d="M38 56 Q50 66 62 56" {...st} />;
  }
  const accessory = theme === 'exploration'
    ? <g>
        <path d="M25 31 Q50 15 75 31 L70 38 Q50 31 30 38 Z" fill="var(--mascot-accent)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M40 24 L50 14 L60 24" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 70 Q35 78 48 72" fill="none" stroke="var(--mascot-accent)" strokeWidth="5" strokeLinecap="round" />
      </g>
    : theme === 'cafe'
      ? <g>
          <path d="M28 23 H70 V31 Q49 38 28 31 Z" fill="var(--mascot-accent)" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          <path d="M68 45 h8 q5 0 5 6 q0 7-8 7 h-5" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M38 18 q-4-6 1-10M52 18 q-4-6 1-10M66 18 q-4-6 1-10" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
        </g>
      : <g>
          <path d="M50 22 C43 10 32 16 36 29 C43 29 48 26 50 22 Z" fill="var(--mint)" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M51 22 C58 9 70 16 65 29 C58 29 53 26 51 22 Z" fill="var(--mint)" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 22 V32" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        </g>;
  return (
    <div style={{ width: size, height: size, borderRadius: theme === 'cafe' ? '32% 32% 40% 40%' : '46% 54% 52% 48%', background: 'var(--mascot)', position: 'relative', flexShrink: 0, boxShadow: 'inset 0 -6px 14px rgba(0,0,0,0.05), var(--shadow-sm)', animation: pop ? 'buddyPop .6s cubic-bezier(.34,1.56,.64,1) both' : 'none' }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>{accessory}{eyes}{mouth}{extra}</svg>
    </div>
  );
}

// 테마별 진행 단계 (완료 수에 따라)
const PLANT_STAGES = ['씨앗', '새싹', '잎 두 장', '큰 잎', '꽃봉오리', '활짝 핀 꽃'];
const PROGRESS_META = {
  garden: {
    unitLabel: '모은 씨앗',
    unit: '개',
    stages: PLANT_STAGES,
    line: '작은 씨앗이 오늘의 정원으로 자라고 있어요.',
  },
  exploration: {
    unitLabel: '찾은 표식',
    unit: '개',
    stages: ['빈 지도', '첫 발자국', '갈림길 표시', '경로 연결', '목적지 발견', '완성된 지도'],
    line: '표식을 찍을수록 지도가 넓어지고 있어요.',
  },
  cafe: {
    unitLabel: '받은 스탬프',
    unit: '개',
    stages: ['빈 메뉴판', '기본 메뉴', '추천 메뉴', '따뜻한 한 잔', '스페셜 메뉴', '완성된 보드'],
    line: '방문이 쌓일수록 메뉴판이 풍성해지고 있어요.',
  },
};
function plantStage(seeds) {
  return seeds <= 0 ? 0 : seeds <= 2 ? 1 : seeds <= 5 ? 2 : seeds <= 9 ? 3 : seeds <= 14 ? 4 : 5;
}
function progressMeta(theme, seeds = 0) {
  const key = normalizeThemeKey(theme);
  const meta = PROGRESS_META[key] || PROGRESS_META.garden;
  const stage = plantStage(seeds);
  return { ...meta, stage, stageName: meta.stages[stage] };
}
function Plant({ seeds = 0, size = 120 }) {
  const stage = plantStage(seeds);
  const leaf = 'var(--mint)', leafInk = 'var(--mint-ink)';
  const potA = 'var(--peach)', potB = 'var(--peach-ink)';
  const stemH = [0, 14, 30, 46, 56, 60][stage];
  const top = 96 - stemH;
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
      {/* pot */}
      <path d="M28 96 L72 96 L66 116 L34 116 Z" fill={potA} stroke={potB} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="50" cy="96" rx="22" ry="5" fill={potB} opacity="0.25" />
      {/* stem */}
      {stage >= 1 && <path d={`M50 96 L50 ${top}`} stroke={leafInk} strokeWidth="3.4" strokeLinecap="round" fill="none" />}
      {/* leaves */}
      {stage === 1 && <g><path d="M50 88 Q40 82 44 92 Q50 90 50 88" fill={leaf} stroke={leafInk} strokeWidth="1.6" /><path d="M50 84 Q60 78 56 88 Q50 86 50 84" fill={leaf} stroke={leafInk} strokeWidth="1.6" /></g>}
      {stage >= 2 && <g stroke={leafInk} strokeWidth="1.8">
        <path d={`M50 ${top + 22} Q32 ${top + 14} 40 ${top + 30} Q50 ${top + 26} 50 ${top + 22}`} fill={leaf} />
        <path d={`M50 ${top + 18} Q68 ${top + 10} 60 ${top + 26} Q50 ${top + 22} 50 ${top + 18}`} fill={leaf} />
      </g>}
      {stage >= 3 && <g stroke={leafInk} strokeWidth="1.8">
        <path d={`M50 ${top + 10} Q30 ${top + 2} 39 ${top + 18} Q50 ${top + 14} 50 ${top + 10}`} fill={leaf} />
        <path d={`M50 ${top + 6} Q70 ${top - 2} 61 ${top + 14} Q50 ${top + 10} 50 ${top + 6}`} fill={leaf} />
      </g>}
      {/* bud / flower */}
      {stage === 4 && <circle cx="50" cy={top} r="7" fill={potA} stroke={potB} strokeWidth="2" />}
      {stage >= 5 && <g>
        {[0, 72, 144, 216, 288].map((deg) => {
          const r = deg * Math.PI / 180;
          return <ellipse key={deg} cx={50 + Math.cos(r) * 9} cy={top + Math.sin(r) * 9} rx="6" ry="9" fill={potA} stroke={potB} strokeWidth="1.6" transform={`rotate(${deg} ${50 + Math.cos(r) * 9} ${top + Math.sin(r) * 9})`} />;
        })}
        <circle cx="50" cy={top} r="6" fill="var(--peach-ink)" />
      </g>}
    </svg>
  );
}

function MapProgress({ seeds = 0, size = 120 }) {
  const stage = plantStage(seeds);
  const route = 'var(--sky-ink)';
  const paper = 'var(--card)';
  const fold = 'var(--peach-soft)';
  const ink = 'var(--peach-ink)';
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <path d="M16 24 L46 14 L76 24 L104 14 L104 94 L76 106 L46 96 L16 106 Z" fill={paper} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M46 14 V96 M76 24 V106" fill="none" stroke="var(--line)" strokeWidth="2" />
      {stage >= 1 && <path d="M18 54 L46 45" fill="none" stroke={fold} strokeWidth="14" strokeLinecap="round" opacity="0.9" />}
      {stage >= 2 && <path d="M46 45 L76 56" fill="none" stroke={fold} strokeWidth="14" strokeLinecap="round" opacity="0.9" />}
      {stage >= 3 && <path d="M76 56 L102 46" fill="none" stroke={fold} strokeWidth="14" strokeLinecap="round" opacity="0.9" />}
      {stage >= 1 && <path d="M28 84 C38 72 43 68 51 67" fill="none" stroke={route} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 7" />}
      {stage >= 2 && <path d="M51 67 C62 64 64 49 75 50" fill="none" stroke={route} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 7" />}
      {stage >= 3 && <path d="M75 50 C86 51 88 35 98 30" fill="none" stroke={route} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 7" />}
      {stage >= 1 && <circle cx="28" cy="84" r="5" fill="var(--mint)" stroke="var(--mint-ink)" strokeWidth="2" />}
      {stage >= 2 && <circle cx="51" cy="67" r="4.5" fill="var(--peach)" stroke={ink} strokeWidth="2" />}
      {stage >= 3 && <circle cx="75" cy="50" r="4.5" fill="var(--lav)" stroke="var(--lav-ink)" strokeWidth="2" />}
      {stage >= 4 && <path d="M98 28 c0-8 12-8 12 0 c0 8-6 13-6 13 s-6-5-6-13z" fill="var(--mascot-accent)" stroke={route} strokeWidth="2.4" strokeLinejoin="round" />}
      {stage >= 5 && <g transform="translate(24 25)">
        <circle cx="10" cy="10" r="9" fill="var(--mint-soft)" stroke="var(--mint-ink)" strokeWidth="2" />
        <path d="M10 3 L13 10 L10 17 L7 10 Z" fill="var(--mint-ink)" />
      </g>}
    </svg>
  );
}

function CafeMenuProgress({ seeds = 0, size = 120 }) {
  const stage = plantStage(seeds);
  const board = 'var(--card)';
  const ink = 'var(--peach-ink)';
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <rect x="22" y="15" width="76" height="92" rx="10" fill={board} stroke={ink} strokeWidth="3" />
      <path d="M34 33 H86" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.78" />
      {stage >= 1 && <path d="M34 47 H68" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.72" />}
      {stage >= 1 && <g>
        <rect x="34" y="61" width="52" height="10" rx="5" fill="var(--peach-soft)" stroke="var(--peach-ink)" strokeWidth="1.8" />
        <path d="M41 66 H61" stroke="var(--peach-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>}
      {stage >= 2 && <g>
        <circle cx="79" cy="66" r="10" fill="var(--lav)" stroke="var(--lav-ink)" strokeWidth="2" />
        <path d="M74 66 h10 M79 61 v10" stroke="var(--lav-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>}
      {stage >= 3 && <g>
        <path d="M37 83 h28 q5 0 5 5 q0 5-5 5 H43 q-6 0-6-6z" fill="var(--mint-soft)" stroke="var(--mint-ink)" strokeWidth="2" />
        <path d="M70 85 h6 q4 0 4 4 q0 5-6 5 h-5" fill="none" stroke="var(--mint-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>}
      {stage >= 4 && <g>
        <path d="M79 82 l4 7 l8 1 l-6 5 l2 8 l-8-4 l-7 4 l2-8 l-6-5 l8-1z" fill="var(--mascot-accent)" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
      </g>}
      {stage >= 5 && <g>
        <path d="M29 22 L91 22" stroke="var(--mascot-ink)" strokeWidth="5" strokeLinecap="round" />
        <path d="M42 22 q-4-10 3-15 M60 22 q-4-10 3-15 M78 22 q-4-10 3-15" fill="none" stroke="var(--mascot-ink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
      </g>}
    </svg>
  );
}

function ThemeProgressVisual({ theme, seeds = 0, size = 120 }) {
  const key = normalizeThemeKey(theme);
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {key === 'exploration'
        ? <MapProgress seeds={seeds} size={size} />
        : key === 'cafe'
          ? <CafeMenuProgress seeds={seeds} size={size} />
          : <Plant seeds={seeds} size={Math.round(size * 0.84)} />}
    </div>
  );
}

const TAB_ICONS = {
  홈: (a) => <path d="M4 9.5L11 4l7 5.5V18a1 1 0 0 1-1 1h-3v-5H8v5H5a1 1 0 0 1-1-1V9.5z" fill={a ? 'var(--lav-ink)' : 'none'} stroke={a ? 'var(--lav-ink)' : 'var(--faint)'} strokeWidth="1.6" strokeLinejoin="round" />,
  기록: (a) => <g stroke={a ? 'var(--lav-ink)' : 'var(--faint)'} strokeWidth="1.6" strokeLinecap="round"><path d="M6 5h10M6 11h10M6 17h6" /></g>,
  마이: (a) => <g fill="none" stroke={a ? 'var(--lav-ink)' : 'var(--faint)'} strokeWidth="1.6"><circle cx="11" cy="8" r="3.2" /><path d="M5 18c0-3.3 2.7-5 6-5s6 1.7 6 5" strokeLinecap="round" /></g>,
};

// ── METHOD ICONS ──────────────────────────────────────────────
function MethodIcon({ id, color, size = 22 }) {
  const c = color || 'var(--accentInk)';
  const common = { fill: 'none', stroke: c, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {id === 'a' && (
        <g {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M12 4v16M4 12h16" />
        </g>
      )}
      {id === 'b' && (
        <g {...common}>
          <circle cx="8" cy="9" r="2.6" />
          <circle cx="16" cy="9" r="2.6" />
          <path d="M3.5 18.5c0-2.8 2-4.3 4.5-4.3s4.5 1.5 4.5 4.3" />
          <path d="M11.5 18.5c0-2.8 2-4.3 4.5-4.3s4.5 1.5 4.5 4.3" />
        </g>
      )}
      {id === 'c' && (
        <g {...common}>
          <circle cx="12" cy="13.5" r="7" />
          <path d="M12 6.5v-3M9.5 3.5h5M12 13.5l3.2-2.6" />
        </g>
      )}
    </svg>
  );
}

function TabBar({ active, onTab }) {
  const items = [['홈', 'home'], ['기록', 'records'], ['마이', 'me']];
  return (
    <div style={{ display: 'flex', gap: 8, padding: '14px 24px 8px', borderTop: '1px solid var(--line)', background: 'var(--bg)', boxShadow: '0 -7px 20px -12px rgba(30,28,40,0.16)', position: 'sticky', bottom: 0, zIndex: 5, flexShrink: 0 }}>
      {items.map(([label, key]) => {
        const a = active === key;
        return (
          <div key={key} className="tap" onClick={() => onTab(key)} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <svg width="22" height="22" viewBox="0 0 22 23">{TAB_ICONS[label](a)}</svg>
            <span style={{ fontSize: 11, fontWeight: a ? 600 : 500, whiteSpace: 'nowrap', color: a ? 'var(--ink)' : 'var(--faint)' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  useStore, METHOD_META, THEME_META, GENERIC_STEPS, uid, MethodIcon, recommendMethod, RECO_WHY,
  normalizeThemeKey,
  currentThemeKey, themeMeta,
  plantStage, progressMeta, PLANT_STAGES, PROGRESS_META, Plant, MapProgress, CafeMenuProgress, ThemeProgressVisual,
  ScreenShell, Eyebrow, Pad, Spacer, Grow, Card, BigButton, Chip, Chevron, Check, Buddy, TabBar,
});
