const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { requireAdmin } = require('../middleware/auth');

// GET sellers for an org (admin)
router.get('/', requireAdmin, async (req, res) => {
  const { org_id } = req.query;
  let where = org_id ? 'WHERE org_id = $1' : '';
  let params = org_id ? [org_id] : [];

  const { rows } = await pool.query(`
    SELECT s.*, (s.annual_sales * 20 + s.seasonal_sales * 8) AS org_earnings,
           o.name AS org_name
    FROM sellers s JOIN orgs o ON o.id = s.org_id
    ${where}
    ORDER BY (s.annual_sales + s.seasonal_sales) DESC
  `, params);
  res.json(rows);
});

// POST add seller to org (admin)
router.post('/', requireAdmin, async (req, res) => {
  const { org_id, first_name, last_name, email } = req.body;
  if (!org_id || !first_name || !last_name) return res.status(400).json({ error: 'org_id, first_name, last_name required' });

  // Get org slug to build ref
  const { rows: orgs } = await pool.query('SELECT slug FROM orgs WHERE id = $1', [org_id]);
  if (!orgs.length) return res.status(404).json({ error: 'Org not found' });

  const ref_slug = `${orgs[0].slug}-${first_name.toLowerCase()}-${last_name.toLowerCase()}`;

  try {
    const { rows } = await pool.query(
      `INSERT INTO sellers (org_id, first_name, last_name, email, ref_slug)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [org_id, first_name, last_name, email, ref_slug]
    );
    res.status(201).json({
      ...rows[0],
      link: `https://saveinct.com/?ref=${ref_slug}`
    });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Seller link already exists' });
    throw err;
  }
});

// POST bulk add sellers (admin — paste roster)
router.post('/bulk', requireAdmin, async (req, res) => {
  const { org_id, sellers } = req.body;
  if (!org_id || !sellers?.length) return res.status(400).json({ error: 'org_id and sellers array required' });

  const { rows: orgs } = await pool.query('SELECT slug FROM orgs WHERE id = $1', [org_id]);
  if (!orgs.length) return res.status(404).json({ error: 'Org not found' });
  const orgSlug = orgs[0].slug;

  const results = [];
  for (const s of sellers) {
    const ref_slug = `${orgSlug}-${s.first_name.toLowerCase()}-${s.last_name.toLowerCase()}`;
    try {
      const { rows } = await pool.query(
        `INSERT INTO sellers (org_id, first_name, last_name, email, ref_slug)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (ref_slug) DO NOTHING RETURNING *`,
        [org_id, s.first_name, s.last_name, s.email || null, ref_slug]
      );
      if (rows.length) results.push({ ...rows[0], link: `https://saveinct.com/?ref=${ref_slug}` });
    } catch (err) {
      console.error('Bulk seller error:', err.message);
    }
  }
  res.status(201).json({ created: results.length, sellers: results });
});

// PATCH update seller (admin)
router.patch('/:id', requireAdmin, async (req, res) => {
  const { annual_sales, seasonal_sales, status } = req.body;
  const { rows } = await pool.query(
    `UPDATE sellers SET
      annual_sales   = COALESCE($1, annual_sales),
      seasonal_sales = COALESCE($2, seasonal_sales),
      status         = COALESCE($3, status)
     WHERE id = $4 RETURNING *`,
    [annual_sales, seasonal_sales, status, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE seller (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM sellers WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
