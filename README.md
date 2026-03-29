# SaveInCT API

Node.js + PostgreSQL backend for the SaveInCT member portal, admin panel, and fundraiser system.

## Stack
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Database**: PostgreSQL (Railway)
- **Auth**: JWT
- **Payments**: Stripe webhooks
- **Email**: Resend
- **Image uploads**: Multer (local disk, upgrade to S3 later)

## API Routes

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Admin login → JWT |
| POST | `/api/auth/member` | — | Member login by code → JWT |

### Members
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/members` | Admin | List all members |
| GET | `/api/members/:id` | Admin | Get member |
| GET | `/api/members/portal/:code` | — | Member portal data |
| POST | `/api/members` | Admin | Create member manually |
| PATCH | `/api/members/:id` | Admin | Update member |
| DELETE | `/api/members/:id` | Admin | Delete member |

### Merchants
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/merchants` | — | List merchants |
| POST | `/api/merchants` | Admin | Create merchant (multipart w/ image) |
| PATCH | `/api/merchants/:id` | Admin | Update merchant |
| DELETE | `/api/merchants/:id` | Admin | Delete merchant |

### Deals
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/deals` | — | List active deals (with merchant info) |
| POST | `/api/deals` | Admin | Create deal |
| PATCH | `/api/deals/:id` | Admin | Update deal |
| DELETE | `/api/deals/:id` | Admin | Delete deal |

### Redemptions
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/redemptions/redeem` | — | Merchant redeems a code |
| GET | `/api/redemptions` | Admin | List redemptions |
| GET | `/api/redemptions/stats` | Admin | Dashboard stats |

### Orgs & Sellers
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/orgs` | Admin | List orgs with totals |
| POST | `/api/orgs` | — | Create org (fundraiser signup form) |
| GET | `/api/sellers` | Admin | List sellers |
| POST | `/api/sellers` | Admin | Add seller |
| POST | `/api/sellers/bulk` | Admin | Bulk add sellers |

### Stripe Webhook
`POST /webhook` — Stripe sends payment events here. Creates member automatically on purchase.

## Railway Setup

### Environment Variables (set in Railway dashboard)
```
DATABASE_URL          = (auto-set by Railway Postgres)
STRIPE_SECRET_KEY     = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_... (from Stripe webhook settings)
JWT_SECRET            = (40+ random characters)
ADMIN_EMAIL           = robmcraven@gmail.com
ADMIN_PASSWORD        = your-password
RESEND_API_KEY        = re_...
SITE_URL              = https://saveinct.com
```

### Stripe Webhook Setup
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-railway-url.railway.app/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook signing secret → paste into `STRIPE_WEBHOOK_SECRET`
