const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  if (email !== process.env.ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');

  // Fallback: plaintext comparison for initial setup (set ADMIN_PASSWORD_HASH after first login)
  const plainMatch = password === process.env.ADMIN_PASSWORD;
  if (!valid && !plainMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { role: 'admin', email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, email, role: 'admin' });
});

// Member portal login by code
router.post('/member', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Member code required' });

  const { pool } = require('../lib/db');
  const { rows } = await pool.query(
    'SELECT * FROM members WHERE UPPER(code) = UPPER($1)',
    [code.trim()]
  );

  if (!rows.length) return res.status(404).json({ error: 'Member code not found' });
  const member = rows[0];

  if (member.status !== 'active') return res.status(403).json({ error: 'Membership is not active' });
  if (new Date(member.expires_at) < new Date()) return res.status(403).json({ error: 'Membership has expired' });

  const token = jwt.sign(
    { role: 'member', id: member.id, code: member.code },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({ token, member: { id: member.id, name: member.name, code: member.code, plan: member.plan, expires_at: member.expires_at } });
});

module.exports = router;
