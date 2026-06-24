require('dotenv').config();

const express = require('express');
const corsMiddleware = require('./middleware/cors');
const tasksRouter   = require('./routes/tasks');
const historyRouter = require('./routes/history');
const profileRouter = require('./routes/profile');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/tasks',   tasksRouter);
app.use('/api/history', historyRouter);
app.use('/api/profile', profileRouter);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `경로를 찾을 수 없습니다: ${req.method} ${req.path}` });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
  console.log(`[server] NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  console.log(`[server] CLIENT_ORIGIN=${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
});
