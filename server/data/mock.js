// In-memory mock store — resets on server restart
// Shape mirrors the frontend's gcn_store_v3 localStorage schema

const fmt = (n) => String(n).padStart(2, '0');
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function isoToday(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.getFullYear() + '-' + fmt(d.getMonth() + 1) + '-' + fmt(d.getDate());
}

function whenLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const day = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${String(y).slice(2)}.${fmt(m)}.${fmt(d)}.(${day})`;
}

let _uid = Date.now();
const uid = () => 'id' + (_uid++);

const today = isoToday();

const GENERIC_STEPS = [
  '아무것도 안 하고 그냥 자리에 앉기',
  '필요한 것 딱 1개만 꺼내기',
  '1분만 손대보기',
  '5분만 이어가기',
  '한 단계만 더 해보기',
];

// Mutable in-memory state
const store = {
  tasks: [
    {
      id: 't1', t: '방 정리하기',
      when: whenLabel(today), dateISO: today, time: null, timeValue: '',
      note: '3일째 미루는 중', estimate: null,
      tiny: '바닥의 옷 1개만 줍기',
      steps: ['바닥의 옷 3개만 줍기', '쓰레기 한 줌 버리기', '책상 위 컵 치우기', '이불 펴기', '창문 열기'],
    },
    {
      id: 't2', t: '이메일 답장 보내기',
      when: whenLabel(today), dateISO: today, time: '오후 2:00', timeValue: '14:00',
      note: '2일째 미루는 중', estimate: null,
      tiny: '받은편지함만 열어보기',
      steps: ['받은편지함 열기', '답장할 메일 1개만 고르기', '인사말 한 줄 쓰기', '핵심 한 문장 쓰기', '보내기 누르기'],
    },
    {
      id: 't3', t: '보고서 초안 쓰기',
      when: whenLabel(today), dateISO: today, time: '오후 6:00', timeValue: '18:00',
      note: '오늘까지', estimate: null,
      tiny: '빈 문서만 열기',
      steps: ['빈 문서 열기', '제목만 적기', '목차 3줄 쓰기', '첫 문단 아무거나 쓰기', '한 단락 더 쓰기'],
    },
  ],

  history: [
    { id: 'h1', title: '설거지',         method: 'b', methodLabel: '같이하기', date: '어제',   minutes: 25, estimate: null },
    { id: 'h2', title: '운동복 갈아입기', method: 'c', methodLabel: '일단 5분', date: '어제',   minutes: 23, estimate: null },
    { id: 'h3', title: '책상 정리',       method: 'a', methodLabel: '쪼개기',   date: '2일 전', minutes: 8,  estimate: null },
  ],

  profile: {
    name: '나',
    theme: 'garden',
    streak: 3,
    seeds: 5,
  },
};

module.exports = { store, uid, whenLabel, isoToday, GENERIC_STEPS };
