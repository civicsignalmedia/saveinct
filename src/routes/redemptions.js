const express = require('express');
const router = express.Router();
const { pool } = require('../lib/db');
const { requireAdmin } = require('../middleware/auth');

// POST redeem a deal (merchant portal — no auth, just validates code + deal)
router.post('/redeem', async (req, res) => {
  const { member_code, deal_id } = req.body;
  if (!member_code || !deal_id) return res.status(400).json({ error: 'member_code and deal_id required' });

  // Find member
  const { rows: members } = await pool.query(
    `SELECT * FROM members WHERE UPPER(code) = UPPER($1) AND status = 'active' AND expires_at > NOW()`,
    [member_code.trim()]
  );
  if (!members.length) return res.status(404).json({ error: 'Member not found or membership expired' });
  const member = members[0];

  // Find deal
  const { rows: deals } = await pool.query(
    `SELECT d.*, m.name AS merchant_name FROM deals d
     JOIN merchants m ON m.id = d.merchant_id
     WHERE d.id = $1 AND d.active = true AND (d.expires_at IS NULL OR d.expires_at > NOW())`,
    [deal_id]
  );
  if (!deals.length) return res.status(404).json({ error: 'Deal not found or expired' });
  const deal = deals[0];

  // Check if this specific deal already redeemed today (prevent double-dip on same deal)
  const { rows: recent } = await pool.query(
    `SELECT id FROM redemptions
     WHERE member_id = $1 AND deal_id = $2 AND redeemed_at > NOW() - INTERVAL '24 hours'`,
    [member.id, deal_id]
  );
  if (recent.length) return res.status(409).json({ error: 'You already redeemed this deal in the last 24 hours — come back tomorrow!' });

  // Log redemption
  await pool.query(
    `INSERT INTO redemptions (member_id, deal_id) VALUES ($1, $2)`,
    [member.id, deal_id]
  );

  res.json({
    ok: true,
    member: { name: member.name, code: member.code, plan: member.plan },
    deal: { offer_text: deal.offer_text, merchant_name: deal.merchant_name }
  });
});

// GET redemptions (admin)
router.get('/', requireAdmin, async (req, res) => {
  const { member_id, deal_id, page = 1, limit = 100 } = req.query;
  const offset = (page - 1) * limit;
  let where = [];
  let params = [];
  let i = 1;

  if (member_id) { where.push(`r.member_id = $${i}`); params.push(member_id); i++; }
  if (deal_id)   { where.push(`r.deal_id = $${i}`); params.push(deal_id); i++; }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const { rows } = await pool.query(`
    SELECT r.*, m.name AS member_name, m.email AS member_email, m.code AS member_code,
           d.offer_text, me.name AS merchant_name
    FROM redemptions r
    JOIN members m ON m.id = r.member_id
    JOIN deals d ON d.id = r.deal_id
    JOIN merchants me ON me.id = d.merchant_id
    ${whereClause}
    ORDER BY r.redeemed_at DESC
    LIMIT $${i} OFFSET $${i+1}
  `, [...params, limit, offset]);

  res.json(rows);
});

// GET stats (admin dashboard)
router.get('/stats', requireAdmin, async (req, res) => {
  const [members, redemptions, deals, orgs] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status='active') AS active,
                COUNT(*) FILTER (WHERE plan='annual') AS annual,
                COUNT(*) FILTER (WHERE plan='seasonal') AS seasonal FROM members`),
    pool.query(`SELECT COUNT(*) AS total FROM redemptions`),
    pool.query(`SELECT COUNT(*) AS total FROM deals WHERE active=true`),
    pool.query(`SELECT COUNT(*) AS total FROM orgs`),
  ]);

  res.json({
    members: members.rows[0],
    redemptions: redemptions.rows[0],
    deals: deals.rows[0],
    orgs: orgs.rows[0],
  });
});

module.exports = router;
