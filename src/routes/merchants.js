const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { pool } = require('../lib/db');
const { requireAdmin } = require('../middleware/auth');

// ── MULTER SETUP ──
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
    if (/image\/(jpeg|jpg|png|webp)/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Images only (jpg, png, webp)'));
    }
  }
});

// ── GET ALL MERCHANTS ──
// FIX: allow ALL merchants if no active filter passed
router.get('/', async (req, res) => {
  try {
    const { category, active } = req.query;

    let where = [];
    let params = [];
    let i = 1;

    // Only filter by active if explicitly provided
    if (active !== undefined) {
      where.push(`active = $${i}`);
      params.push(active === 'true');
      i++;
    }

    if (category) {
      where.push(`category = $${i}`);
      params.push(category);
      i++;
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const { rows } = await pool.query(
      `SELECT * FROM merchants ${whereClause} ORDER BY name ASC`,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error('GET merchants error:', err);
    res.status(500).json({ error: 'Failed to fetch merchants' });
  }
});

// ── GET SINGLE MERCHANT ──
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM merchants WHERE id = $1',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('GET merchant error:', err);
    res.status(500).json({ error: 'Failed to fetch merchant' });
  }
});

// ── CREATE MERCHANT ──
router.post(
  '/',
  requireAdmin,
  (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      upload.single('image')(req, res, next);
    } else {
      next();
    }
  },
  async (req, res) => {
    try {
      console.log('CREATE merchant body:', req.body);
      console.log('CREATE merchant file:', req.file);

      const { name, category, location, address, hours, website } = req.body;

      if (!name || !category) {
        return res.status(400).json({ error: 'Name and category required' });
      }

      const image_url = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      const { rows } = await pool.query(
        `INSERT INTO merchants 
          (name, category, location, address, hours, image_url, website)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [name, category, location, address, hours, image_url, website]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      console.error('CREATE merchant error:', err);
      res.status(500).json({ error: 'Failed to create merchant' });
    }
  }
);

// ── UPDATE MERCHANT ──
router.patch(
  '/:id',
  requireAdmin,
  (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      upload.single('image')(req, res, next);
    } else {
      next();
    }
  },
  async (req, res) => {
    try {
      const {
        name,
        category,
        location,
        address,
        hours,
        website,
        active
      } = req.body;

      const image_url = req.file
        ? `/uploads/${req.file.filename}`
        : undefined;

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
         WHERE id = $9
         RETURNING *`,
        [
          name,
          category,
          location,
          address,
          hours,
          image_url,
          website,
          active !== undefined
            ? active === 'true' || active === true
            : undefined,
          req.params.id
        ]
      );

      if (!rows.length) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      console.error('UPDATE merchant error:', err);
      res.status(500).json({ error: 'Failed to update merchant' });
    }
  }
);

// ── DELETE MERCHANT ──
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM merchants WHERE id = $1', [
      req.params.id
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE merchant error:', err);
    res.status(500).json({ error: 'Failed to delete merchant' });
  }
});

module.exports = router;
