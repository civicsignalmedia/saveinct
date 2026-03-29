const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { pool } = require('../lib/db');
const { requireAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `merchant-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpeg|jpg|png|webp)/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Images only (jpg, png, webp)'));
  }
});

// GET all merchants (public — for deals panel)
router.get('/', async (req, res) => {
  const { category, active = 'true' } = req.query;
  let where = ['active = $1'];
  let params = [active === 'true'];
  let i = 2;

  if (category) { where.push(`category = $${i}`); params.push(category); i++; }

  const { rows } = await pool.query(
    `SELECT * FROM merchants WHERE ${where.join(' AND ')} ORDER BY name ASC`,
    params
  );
  res.json(rows);
});

// GET single merchant
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM merchants WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST create merchant (admin) — with optional image
router.post('/', requireAdmin, (req, res, next) => {
  // Only use multer if content-type is multipart
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    upload.single('image')(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  const { name, category, location, address, hours, website } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'Name and category required' });

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const { rows } = await pool.query(
    `INSERT INTO merchants (name, category, location, address, hours, image_url, website)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name, category, location, address, hours, image_url, website]
  );
  res.status(201).json(rows[0]);
});

// PATCH update merchant (admin)
router.patch('/:id', requireAdmin, (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    upload.single('image')(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  const { name, category, location, address, hours, website, active } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

  const { rows } = await pool.query(
    `UPDATE merchants SET
      name      = COALESCE($1, name),
      category  = COALESCE($2, category),
      location  = COALESCE($3, location),
      address   = COALESCE($4, address),
      hours     = COALESCE($5, hours),
      image_url = COALESCE($6, image_url),
      website   = COALESCE($7, website),
      active    = COALESCE($8, active)
     WHERE id = $9 RETURNING *`,
    [name, category, location, address, hours, image_url, website,
     active !== undefined ? active === 'true' || active === true : undefined, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE merchant (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM merchants WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
