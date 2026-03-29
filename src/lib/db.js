const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      -- MEMBERS
      CREATE TABLE IF NOT EXISTS members (
        id          SERIAL PRIMARY KEY,
        email       TEXT UNIQUE NOT NULL,
        name        TEXT,
        code        TEXT UNIQUE NOT NULL,
        plan        TEXT NOT NULL DEFAULT 'annual',  -- annual | seasonal
        status      TEXT NOT NULL DEFAULT 'active',  -- active | expired | cancelled
        stripe_id   TEXT,
        ref         TEXT,                            -- fundraiser ref slug
        starts_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at  TIMESTAMPTZ NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- MERCHANTS
      CREATE TABLE IF NOT EXISTS merchants (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        category    TEXT NOT NULL,  -- dining | spa | recreation | brewery | attraction | shopping
        location    TEXT,
        address     TEXT,
        hours       TEXT,
        image_url   TEXT,
        website     TEXT,
        active      BOOLEAN NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- DEALS
      CREATE TABLE IF NOT EXISTS deals (
        id            SERIAL PRIMARY KEY,
        merchant_id   INT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
        offer_text    TEXT NOT NULL,
        value_text    TEXT,
        terms         TEXT,
        badge         TEXT,           -- Popular | New | null
        starts_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at    TIMESTAMPTZ,
        active        BOOLEAN NOT NULL DEFAULT true,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- REDEMPTIONS
      CREATE TABLE IF NOT EXISTS redemptions (
        id          SERIAL PRIMARY KEY,
        member_id   INT NOT NULL REFERENCES members(id),
        deal_id     INT NOT NULL REFERENCES deals(id),
        redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        note        TEXT
      );

      -- ORGS
      CREATE TABLE IF NOT EXISTS orgs (
        id              SERIAL PRIMARY KEY,
        name            TEXT NOT NULL,
        slug            TEXT UNIQUE NOT NULL,
        contact_name    TEXT,
        contact_email   TEXT,
        contact_phone   TEXT,
        org_type        TEXT,
        city            TEXT,
        payout_method   TEXT DEFAULT 'check',
        status          TEXT DEFAULT 'active',
        notes           TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- SELLERS
      CREATE TABLE IF NOT EXISTS sellers (
        id            SERIAL PRIMARY KEY,
        org_id        INT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        first_name    TEXT NOT NULL,
        last_name     TEXT NOT NULL,
        email         TEXT,
        ref_slug      TEXT UNIQUE NOT NULL,
        annual_sales  INT NOT NULL DEFAULT 0,
        seasonal_sales INT NOT NULL DEFAULT 0,
        status        TEXT DEFAULT 'active',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- PAYOUTS
      CREATE TABLE IF NOT EXISTS payouts (
        id          SERIAL PRIMARY KEY,
        org_id      INT NOT NULL REFERENCES orgs(id),
        period      TEXT NOT NULL,   -- e.g. "April 2026"
        amount      NUMERIC(10,2) NOT NULL,
        method      TEXT,
        status      TEXT DEFAULT 'pending',  -- pending | paid
        paid_at     TIMESTAMPTZ,
        notes       TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- INDEXES
      CREATE INDEX IF NOT EXISTS idx_members_code    ON members(code);
      CREATE INDEX IF NOT EXISTS idx_members_email   ON members(email);
      CREATE INDEX IF NOT EXISTS idx_members_ref     ON members(ref);
      CREATE INDEX IF NOT EXISTS idx_deals_merchant  ON deals(merchant_id);
      CREATE INDEX IF NOT EXISTS idx_redemptions_member ON redemptions(member_id);
      CREATE INDEX IF NOT EXISTS idx_sellers_ref     ON sellers(ref_slug);
      CREATE INDEX IF NOT EXISTS idx_sellers_org     ON sellers(org_id);
    `);
    console.log('✅ Database schema ready');
  } finally {
    client.release();
  }
}

module.exports = { pool, initDb };
