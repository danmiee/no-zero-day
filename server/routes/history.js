const { Router } = require('express');
const { store, uid } = require('../data/mock');

const router = Router();

// GET /api/history
router.get('/', (req, res) => {
  res.json(store.history);
});

// POST /api/history  — record a completed session
router.post('/', (req, res) => {
  const { title, method, methodLabel, minutes, estimate } = req.body;

  if (!title || !method || minutes == null) {
    return res.status(400).json({ error: 'title, method, minutes는 필수입니다.' });
  }

  const VALID_METHODS = ['a', 'b', 'c'];
  if (!VALID_METHODS.includes(method)) {
    return res.status(400).json({ error: `method는 ${VALID_METHODS.join('/')} 중 하나여야 합니다.` });
  }

  const entry = {
    id: uid(),
    title,
    method,
    methodLabel: methodLabel || method,
    date: '방금',
    minutes: Number(minutes),
    estimate: estimate != null ? Number(estimate) : null,
  };

  store.history.unshift(entry);
  store.profile.seeds += 1;

  res.status(201).json({ entry, seeds: store.profile.seeds });
});

// DELETE /api/history/:id
router.delete('/:id', (req, res) => {
  const before = store.history.length;
  store.history = store.history.filter((h) => h.id !== req.params.id);

  if (store.history.length === before) {
    return res.status(404).json({ error: '해당 기록을 찾을 수 없습니다.' });
  }

  res.json({ deleted: req.params.id });
});

module.exports = router;
