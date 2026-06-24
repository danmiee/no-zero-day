const { Router } = require('express');
const { store, uid, whenLabel, GENERIC_STEPS } = require('../data/mock');

const router = Router();

// GET /api/tasks
router.get('/', (req, res) => {
  res.json(store.tasks);
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { t, when, dateISO, time, timeValue, estimate, tiny, steps } = req.body;

  if (!t || !t.trim()) {
    return res.status(400).json({ error: '할 일 제목은 필수입니다.' });
  }

  const task = {
    id: uid(),
    t: t.trim(),
    when: when || (dateISO ? whenLabel(dateISO) : '날짜 없음'),
    dateISO: dateISO || null,
    time: time || null,
    timeValue: timeValue || '',
    note: null,
    estimate: estimate || null,
    tiny: tiny || '딱 10초만 쳐다보기',
    steps: Array.isArray(steps) && steps.length ? steps : GENERIC_STEPS,
  };

  store.tasks.unshift(task);
  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const idx = store.tasks.findIndex((t) => t.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: '해당 할 일을 찾을 수 없습니다.' });
  }

  const patch = req.body;
  const updated = {
    ...store.tasks[idx],
    ...patch,
    id: store.tasks[idx].id, // id는 변경 불가
    t: (patch.t || store.tasks[idx].t).trim(),
    note: null,
  };

  store.tasks[idx] = updated;
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const before = store.tasks.length;
  store.tasks = store.tasks.filter((t) => t.id !== req.params.id);

  if (store.tasks.length === before) {
    return res.status(404).json({ error: '해당 할 일을 찾을 수 없습니다.' });
  }

  res.json({ deleted: req.params.id });
});

module.exports = router;
