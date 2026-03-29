const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { requireAdmin } = require('../middleware/auth');

// GET all active deals with merchant info (public — member portal)
router.get('/', async (req, res) => {
  const { category } = req.query;
  let where = ['d.active = true', 'd.starts_at <= NOW()', '(d.expires_at IS NULL OR d.expires_at > NOW())', 'm.active = true'];
  let params = [];
  let i = 1;

  if (category && category !== 'all') {
    where.push(`m.category = $${i}`); params.push(category); i++;
  }

  const { rows } = await pool.query(`
    SELECT
      d.*,
      m.name        AS merchant_name,
      m.category    AS merchant_category,
      m.location    AS merchant_location,
      m.address     AS merchant_address,
      m.hours       AS merchant_hours,
      m.image_url   AS merchant_image,
      m.website     AS merchant_website
    FROM deals d
    JOIN merchants m ON m.id = d.merchant_id
    WHERE ${where.join(' AND ')}
    ORDER BY d.badge NULLS LAST, m.name ASC
  `, params);

  res.json(rows);
});

// GET single deal
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT d.*, m.name AS merchant_name, m.category AS merchant_category,
           m.location AS merchant_location, m.image_url AS merchant_image,
           m.address AS merchant_address, m.hours AS merchant_hours
    FROM deals d JOIN merchants m ON m.id = d.merchant_id
    WHERE d.id = $1
  `, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST create deal (admin)
router.post('/', requireAdmin, async (req, res) => {
  const { merchant_id, offer_text, value_text, terms, badge, starts_at, expires_at } = req.body;
  if (!merchant_id || !offer_text) return res.status(400).json({ error: 'merchant_id and offer_text required' });

  const { rows } = await pool.query(
    `INSERT INTO deals (merchant_id, offer_text, value_text, terms, badge, starts_at, expires_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [merchant_id, offer_text, value_text, terms, badge, starts_at || new Date(), expires_at]
  );
  res.status(201).json(rows[0]);
});

// PATCH update deal (admin)
router.patch('/:id', requireAdmin, async (req, res) => {
  const { offer_text, value_text, terms, badge, active, expires_at } = req.body;
  const { rows } = await pool.query(
    `UPDATE deals SET
      offer_text  = COALESCE($1, offer_text),
      value_text  = COALESCE($2, value_text),
      terms       = COALESCE($3, terms),
      badge       = COALESCE($4, badge),
      active      = COALESCE($5, active),
      expires_at  = COALESCE($6, expires_at)
     WHERE id = $7 RETURNING *`,
    [offer_text, value_text, terms, badge, active, expires_at, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE deal (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM deals WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
