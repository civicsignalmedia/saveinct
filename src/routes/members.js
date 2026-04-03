const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { requireAdmin, requireMember } = require('../middleware/auth');
const { generateMemberCode, getExpiry, sendWelcomeEmail } = require('../lib/helpers');

// GET all members (admin)
router.get('/', requireAdmin, async (req, res) => {
  const { search, plan, status, page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;
  let where = [];
  let params = [];
  let i = 1;

  if (search) { where.push(`(email ILIKE $${i} OR name ILIKE $${i} OR code ILIKE $${i})`); params.push(`%${search}%`); i++; }
  if (plan)   { where.push(`plan = $${i}`); params.push(plan); i++; }
  if (status) { where.push(`status = $${i}`); params.push(status); i++; }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const { rows } = await pool.query(
    `SELECT * FROM members ${whereClause} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i+1}`,
    [...params, limit, offset]
  );
  const { rows: count } = await pool.query(`SELECT COUNT(*) FROM members ${whereClause}`, params);
  res.json({ members: rows, total: parseInt(count[0].count), page: parseInt(page) });
});

// GET member portal data (by code — must be before /:id)
router.get('/portal/:code', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, code, plan, status, starts_at, expires_at FROM members WHERE UPPER(code) = UPPER($1)',
    [req.params.code]
  );
  if (!rows.length) return res.status(404).json({ error: 'Member not found' });
  const member = rows[0];
  if (member.status !== 'active') return res.status(403).json({ error: 'Membership inactive' });

  const { rows: redemptions } = await pool.query(
    'SELECT COUNT(*) FROM redemptions WHERE member_id = $1', [member.id]
  );

  res.json({ ...member, redemption_count: parseInt(redemptions[0].count) });
});

// GET single member (admin)
router.get('/:id', requireAdmin, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM members WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST create member manually (admin)
router.post('/', requireAdmin, async (req, res) => {
  const { email, name, plan = 'annual', ref } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const code = generateMemberCode();
  const expires_at = getExpiry(plan);

  try {
    const { rows } = await pool.query(
      `INSERT INTO members (email, name, code, plan, ref, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, name, code, plan, ref, expires_at]
    );
    const member = rows[0];
    await sendWelcomeEmail(member);
    res.status(201).json(member);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    throw err;
  }
});

// PATCH update member (admin)
router.patch('/:id', requireAdmin, async (req, res) => {
  const { name, email, plan, status, expires_at } = req.body;
  const { rows } = await pool.query(
    `UPDATE members SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      plan = COALESCE($3, plan),
      status = COALESCE($4, status),
      expires_at = COALESCE($5, expires_at)
     WHERE id = $6 RETURNING *`,
    [name, email, plan, status, expires_at, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE member (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM members WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;