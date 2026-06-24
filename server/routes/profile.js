const { Router } = require('express');
const { store } = require('../data/mock');

const router = Router();

const VALID_THEMES = ['garden', 'exploration', 'cafe'];

// GET /api/profile
router.get('/', (req, res) => {
  res.json({
    ...store.profile,
    taskCount: store.tasks.length,
    historyCount: store.history.length,
  });
});

// PUT /api/profile/theme
router.put('/theme', (req, res) => {
  const { theme } = req.body;

  if (!VALID_THEMES.includes(theme)) {
    return res.status(400).json({ error: `theme은 ${VALID_THEMES.join('/')} 중 하나여야 합니다.` });
  }

  store.profile.theme = theme;
  res.json({ theme: store.profile.theme });
});

// PUT /api/profile/name
router.put('/name', (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: '이름은 필수입니다.' });
  }

  store.profile.name = name.trim();
  res.json({ name: store.profile.name });
});

// POST /api/profile/reset — restore seed data
router.post('/reset', (req, res) => {
  const { store: mockStore, uid, whenLabel, isoToday, GENERIC_STEPS } = require('../data/mock');

  const today = isoToday();

  mockStore.tasks = [
    {
      id: uid(), t: '방 정리하기',
      when: whenLabel(today), dateISO: today, time: null, timeValue: '',
      note: '3일째 미루는 중', estimate: null,
      tiny: '바닥의 옷 1개만 줍기',
      steps: ['바닥의 옷 3개만 줍기', '쓰레기 한 줌 버리기', '책상 위 컵 치우기', '이불 펴기', '창문 열기'],
    },
    {
      id: uid(), t: '이메일 답장 보내기',
      when: whenLabel(today), dateISO: today, time: '오후 2:00', timeValue: '14:00',
      note: '2일째 미루는 중', estimate: null,
      tiny: '받은편지함만 열어보기',
      steps: ['받은편지함 열기', '답장할 메일 1개만 고르기', '인사말 한 줄 쓰기', '핵심 한 문장 쓰기', '보내기 누르기'],
    },
    {
      id: uid(), t: '보고서 초안 쓰기',
      when: whenLabel(today), dateISO: today, time: '오후 6:00', timeValue: '18:00',
      note: '오늘까지', estimate: null,
      tiny: '빈 문서만 열기',
      steps: ['빈 문서 열기', '제목만 적기', '목차 3줄 쓰기', '첫 문단 아무거나 쓰기', '한 단락 더 쓰기'],
    },
  ];
  mockStore.history = [
    { id: uid(), title: '설거지',         method: 'b', methodLabel: '같이하기', date: '어제',   minutes: 25, estimate: null },
    { id: uid(), title: '운동복 갈아입기', method: 'c', methodLabel: '일단 5분', date: '어제',   minutes: 23, estimate: null },
    { id: uid(), title: '책상 정리',       method: 'a', methodLabel: '쪼개기',   date: '2일 전', minutes: 8,  estimate: null },
  ];
  mockStore.profile = { name: '나', theme: 'garden', streak: 3, seeds: 5 };

  res.json({ ok: true });
});

module.exports = router;
