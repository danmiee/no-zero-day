const cors = require('cors');

// CORS_ORIGIN accepts a comma-separated list of allowed origins.
// Example: CORS_ORIGIN=http://localhost:5173,https://danmiee.github.io
function parseOrigins(raw) {
  if (!raw) return [];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

const allowedOrigins = [
  ...parseOrigins(process.env.CORS_ORIGIN),
  'http://localhost:5173',  // Vite dev
  'http://localhost:4173',  // Vite preview
  'https://danmiee.github.io',
];

// Deduplicate
const originSet = [...new Set(allowedOrigins)];

module.exports = cors({
  origin(origin, callback) {
    // Allow non-browser requests (curl, Postman) and listed origins
    if (!origin || originSet.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
