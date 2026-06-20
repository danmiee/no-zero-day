import { useState, useEffect } from 'react';
import { normalizeThemeKey } from '../lib/theme';

const STORE_KEY = 'gcn_store_v3';

const GENERIC_STEPS = [
  '아무것도 안 하고 그냥 자리에 앉기',
  '필요한 것 딱 1개만 꺼내기',
  '1분만 손대보기',
  '5분만 이어가기',
  '한 단계만 더 해보기',
];

const SEED_TASKS = [
  {
    id: 't1', t: '방 정리하기', when: '오늘', time: null,
    note: '3일째 미루는 중', tiny: '바닥의 옷 1개만 줍기',
    steps: ['바닥의 옷 3개만 줍기', '쓰레기 한 줌 버리기', '책상 위 컵 치우기', '이불 펴기', '창문 열기'],
  },
  {
    id: 't2', t: '이메일 답장 보내기', when: '오늘', time: '오후 2:00',
    note: '2일째 미루는 중', tiny: '받은편지함만 열어보기',
    steps: ['받은편지함 열기', '답장할 메일 1개만 고르기', '인사말 한 줄 쓰기', '핵심 한 문장 쓰기', '보내기 누르기'],
  },
  {
    id: 't3', t: '보고서 초안 쓰기', when: '오늘', time: '오후 6:00',
    note: '오늘까지', tiny: '빈 문서만 열기',
    steps: ['빈 문서 열기', '제목만 적기', '목차 3줄 쓰기', '첫 문단 아무거나 쓰기', '한 단락 더 쓰기'],
  },
];

const SEED_HISTORY = [
  { id: 'h1', title: '설거지',        method: 'b', methodLabel: '같이하기', date: '어제',   minutes: 25 },
  { id: 'h2', title: '운동복 갈아입기', method: 'c', methodLabel: '일단 5분', date: '어제',   minutes: 23 },
  { id: 'h3', title: '책상 정리',      method: 'a', methodLabel: '쪼개기',   date: '2일 전', minutes: 8  },
];

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...parsed, theme: normalizeThemeKey(parsed.theme) };
    }
  } catch (e) {}
  return { tasks: SEED_TASKS, history: SEED_HISTORY, streak: 3, seeds: 5, name: '나', theme: 'garden', mood: null };
}

let _uid = Date.now();
const uid = () => 'id' + (_uid++);

export function useStore() {
  const [state, setState] = useState(loadStore);

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  const addTask = (task) => {
    const full = {
      id: uid(), t: task.t.trim(), when: task.when, time: task.time,
      note: null, estimate: task.estimate || null,
      tiny: '딱 10초만 쳐다보기', steps: GENERIC_STEPS,
    };
    setState((s) => ({ ...s, tasks: [full, ...s.tasks] }));
    return full;
  };

  const removeTask = (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) }));

  const completeSession = (title, method, methodLabel, minutes, estimate) => {
    setState((s) => ({
      ...s,
      seeds: s.seeds + 1,
      history: [{ id: uid(), title, method, methodLabel, date: '방금', minutes, estimate: estimate || null }, ...s.history],
    }));
  };

  const reset = () => setState({
    tasks: SEED_TASKS, history: SEED_HISTORY, streak: 3, seeds: 5,
    name: '나', theme: normalizeThemeKey(state.theme), mood: null,
  });

  const setTheme = (theme) => setState((s) => ({ ...s, theme: normalizeThemeKey(theme) }));
  const setMood  = (mood)  => setState((s) => ({ ...s, mood }));

  return { state, addTask, removeTask, completeSession, reset, setTheme, setMood };
}
