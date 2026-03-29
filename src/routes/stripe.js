const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const { pool } = require('../lib/db');
const { generateMemberCode, getExpiry, sendWelcomeEmail } = require('../lib/helpers');

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const session = event.data.object;

    // Extract metadata
    const email = session.customer_details?.email || session.receipt_email || '';
    const name  = session.customer_details?.name || '';
    const ref   = session.client_reference_id || null;
    const amount = session.amount_total; // in cents

    // Determine plan from amount
    let plan = 'annual';
    if (amount <= 1999) plan = 'seasonal';
    else if (amount >= 6999) plan = 'gift';

    if (!email) {
      console.log('No email in webhook, skipping member creation');
      return res.json({ received: true });
    }

    try {
      const code = generateMemberCode();
      const expires_at = getExpiry(plan);

      // Upsert member (handle duplicate purchases gracefully)
      const { rows } = await pool.query(`
        INSERT INTO members (email, name, code, plan, stripe_id, ref, expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO UPDATE SET
          plan = EXCLUDED.plan,
          expires_at = GREATEST(members.expires_at, EXCLUDED.expires_at),
          status = 'active'
        RETURNING *
      `, [email, name, code, plan, session.id, ref, expires_at]);

      const member = rows[0];

      // Update seller attribution if ref present
      if (ref) {
        const refParts = ref.split('-');
        // Try to match seller by ref_slug
        await pool.query(`
          UPDATE sellers SET
            annual_sales = annual_sales + CASE WHEN $1 = 'annual' OR $1 = 'gift' THEN 1 ELSE 0 END,
            seasonal_sales = seasonal_sales + CASE WHEN $1 = 'seasonal' THEN 1 ELSE 0 END
          WHERE ref_slug = $2
        `, [plan, ref]);
      }

      // Send welcome email
      await sendWelcomeEmail(member);

      console.log(`✅ Member created/updated: ${email} — ${plan} — code: ${member.code}`);
    } catch (err) {
      console.error('Member creation error:', err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
