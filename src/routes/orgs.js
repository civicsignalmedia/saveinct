const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { requireAdmin } = require('../middleware/auth');

// GET all orgs (admin)
router.get('/', requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.*,
      COUNT(s.id) AS seller_count,
      COALESCE(SUM(s.annual_sales), 0) AS total_annual_sales,
      COALESCE(SUM(s.seasonal_sales), 0) AS total_seasonal_sales,
      COALESCE(SUM(s.annual_sales * 20 + s.seasonal_sales * 8), 0) AS total_earnings
    FROM orgs o
    LEFT JOIN sellers s ON s.org_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  res.json(rows);
});

// GET single org with sellers
router.get('/:id', requireAdmin, async (req, res) => {
  const { rows: org } = await pool.query('SELECT * FROM orgs WHERE id = $1', [req.params.id]);
  if (!org.length) return res.status(404).json({ error: 'Not found' });

  const { rows: sellers } = await pool.query(
    `SELECT *, (annual_sales * 20 + seasonal_sales * 8) AS earnings
     FROM sellers WHERE org_id = $1 ORDER BY (annual_sales + seasonal_sales) DESC`,
    [req.params.id]
  );
  res.json({ ...org[0], sellers });
});

// POST create org (admin or public signup via fundraiser form)
router.post('/', async (req, res) => {
  const { name, slug, contact_name, contact_email, contact_phone, org_type, city, notes } = req.body;
  if (!name || !contact_email) return res.status(400).json({ error: 'Name and contact email required' });

  // Auto-generate slug if not provided
  const autoSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  try {
    const { rows } = await pool.query(
      `INSERT INTO orgs (name, slug, contact_name, contact_email, contact_phone, org_type, city, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, autoSlug, contact_name, contact_email, contact_phone, org_type, city, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Org slug already exists' });
    throw err;
  }
});

// PATCH update org (admin)
router.patch('/:id', requireAdmin, async (req, res) => {
  const { name, contact_name, contact_email, contact_phone, status, payout_method, notes } = req.body;
  const { rows } = await pool.query(
    `UPDATE orgs SET
      name           = COALESCE($1, name),
      contact_name   = COALESCE($2, contact_name),
      contact_email  = COALESCE($3, contact_email),
      contact_phone  = COALESCE($4, contact_phone),
      status         = COALESCE($5, status),
      payout_method  = COALESCE($6, payout_method),
      notes          = COALESCE($7, notes)
     WHERE id = $8 RETURNING *`,
    [name, contact_name, contact_email, contact_phone, status, payout_method, notes, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE org (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM orgs WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
