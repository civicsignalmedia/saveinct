require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ── STRIPE WEBHOOK (raw body needed — before json parser) ──
const stripeRouter = require('./routes/stripe');
app.use('/webhook', express.raw({ type: 'application/json' }), stripeRouter);

// ── ROUTES ──
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/members',     require('./routes/members'));
app.use('/api/merchants',   require('./routes/merchants'));
app.use('/api/deals',       require('./routes/deals'));
app.use('/api/redemptions', require('./routes/redemptions'));
app.use('/api/orgs',        require('./routes/orgs'));
app.use('/api/sellers',     require('./routes/sellers'));

// ── HEALTH ──
app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

// ── START ──
initDb().then(() => {
  app.listen(PORT, () => console.log(`SaveInCT API running on port ${PORT}`));
}).catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});
