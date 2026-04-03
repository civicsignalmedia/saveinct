<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>My Deals — SaveInCT</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --ink: #12120F;
  --forest: #1E3A0F;
  --forest-mid: #2D5016;
  --sage: #4A6741;
  --sage-light: #7A9E6E;
  --gold: #C4922A;
  --gold-light: #E8B84B;
  --gold-pale: #F5E6C0;
  --cream: #F7F2E8;
  --cream-dark: #EDE6D6;
  --white: #FFFFFF;
  --gray: #8A8678;
  --gray-light: #DDD8CC;
  --rust: #A63D2F;
  --green-confirm: #1A7A3C;
  --lgreen: #E8F5E9;
}
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html { scroll-behavior:smooth; }
body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--ink); min-height:100vh; }

/* ── LOGIN ── */
.login-screen {
  min-height:100vh; display:flex; align-items:center;
  justify-content:center; padding:24px;
  background:var(--forest);
  position:relative; overflow:hidden;
}
.login-screen::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at 50% 0%, rgba(196,146,42,0.15) 0%, transparent 60%);
}
.login-card {
  background:var(--cream); border-radius:20px;
  padding:40px 36px; width:100%; max-width:400px;
  position:relative; z-index:1;
  box-shadow:0 24px 80px rgba(0,0,0,0.4);
}
.login-logo {
  font-family:'Cormorant Garamond',serif;
  font-size:28px; font-weight:700;
  color:var(--forest); margin-bottom:6px;
  text-align:center;
}
.login-logo span { color:var(--gold); }
.login-tagline { font-size:13px; color:var(--gray); text-align:center; margin-bottom:32px; }
.login-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:var(--ink); margin-bottom:6px; }
.login-sub { font-size:13px; color:var(--gray); margin-bottom:24px; line-height:1.5; }
.form-group { margin-bottom:16px; }
.form-label { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--gray); display:block; margin-bottom:6px; }
.form-input {
  width:100%; padding:13px 16px;
  background:white; border:1.5px solid var(--gray-light);
  border-radius:10px; color:var(--ink); font-size:15px;
  font-family:'Outfit',sans-serif; transition:border-color 0.2s;
}
.form-input:focus { outline:none; border-color:var(--forest); }
.form-input::placeholder { color:var(--gray); font-size:14px; }
.form-hint { font-size:11px; color:var(--gray); margin-top:5px; line-height:1.4; }
.login-btn {
  width:100%; padding:15px; margin-top:8px;
  background:var(--forest); color:white;
  border:none; border-radius:10px;
  font-size:15px; font-weight:700; font-family:'Outfit',sans-serif;
  cursor:pointer; transition:all 0.2s;
}
.login-btn:hover { background:var(--sage); }
.login-btn:disabled { opacity:0.5; cursor:not-allowed; }
.login-error {
  background:#FEF2F2; border:1px solid #FCA5A5;
  border-radius:8px; padding:10px 14px;
  font-size:13px; color:var(--rust);
  margin-top:12px; display:none;
}

/* ── HEADER ── */
header {
  background:var(--forest); position:sticky; top:0; z-index:100;
  box-shadow:0 2px 12px rgba(0,0,0,0.2);
}
.header-inner {
  max-width:900px; margin:0 auto; padding:0 20px;
  height:60px; display:flex; align-items:center; justify-content:space-between;
}
.header-logo { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:white; }
.header-logo span { color:var(--gold-light); }
.header-right { display:flex; align-items:center; gap:12px; }
.header-code {
  background:var(--gold); color:var(--forest);
  font-size:12px; font-weight:700; letter-spacing:1px;
  padding:6px 14px; border-radius:20px;
  font-family:'Outfit',sans-serif;
}
.header-logout {
  background:none; border:1px solid rgba(255,255,255,0.2);
  color:rgba(255,255,255,0.6); font-size:12px;
  padding:6px 12px; border-radius:20px; cursor:pointer;
  font-family:'Outfit',sans-serif; transition:all 0.2s;
}
.header-logout:hover { border-color:rgba(255,255,255,0.5); color:white; }

/* ── WELCOME BAR ── */
.welcome-bar {
  background:linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 60%, var(--sage) 100%);
  padding:20px; position:relative; overflow:hidden;
}
.welcome-bar::before {
  content:''; position:absolute; right:-40px; top:-40px;
  width:200px; height:200px; border-radius:50%;
  background:rgba(196,146,42,0.1); pointer-events:none;
}
.welcome-inner { max-width:900px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; position:relative; z-index:1; }
.welcome-left h2 { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:white; margin-bottom:2px; }
.welcome-left h2 em { font-style:italic; color:var(--gold-light); }
.welcome-left p { font-size:12px; color:rgba(255,255,255,0.5); }
.welcome-stats { display:flex; gap:24px; }
.w-stat { text-align:center; }
.w-stat-num { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:700; color:var(--gold-light); line-height:1; }
.w-stat-label { font-size:10px; color:rgba(255,255,255,0.4); margin-top:2px; letter-spacing:0.5px; }

/* ── MAIN ── */
.main { max-width:900px; margin:0 auto; padding:24px 20px; }

/* ── FILTER BAR ── */
.filter-scroll { overflow-x:auto; margin-bottom:20px; padding-bottom:4px; -webkit-overflow-scrolling:touch; }
.filter-bar { display:flex; gap:8px; width:max-content; }
.filter-btn {
  display:flex; align-items:center; gap:6px;
  padding:8px 16px; border-radius:30px; border:1.5px solid var(--gray-light);
  background:white; color:var(--gray); font-size:13px; font-weight:500;
  font-family:'Outfit',sans-serif; cursor:pointer; transition:all 0.18s;
  white-space:nowrap;
}
.filter-btn:hover { border-color:var(--sage); color:var(--sage); }
.filter-btn.active { background:var(--forest); border-color:var(--forest); color:white; }

/* ── DEALS GRID ── */
.deals-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
@media(max-width:700px) { .deals-grid { grid-template-columns:repeat(2,1fr); gap:12px; } }
@media(max-width:440px) { .deals-grid { grid-template-columns:1fr; } }

.deal-card {
  background:white; border-radius:14px; overflow:hidden;
  border:1px solid var(--gray-light); cursor:pointer;
  transition:all 0.2s cubic-bezier(0.34,1.3,0.64,1);
}
.deal-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.1); border-color:transparent; }
.deal-card:active { transform:scale(0.98); }

.deal-img {
  height:140px; display:flex; align-items:center;
  justify-content:center; font-size:52px; position:relative;
  overflow:hidden;
}
.deal-img img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
.deal-img .emoji-fallback { position:relative; z-index:1; }
.deal-img.dining { background:linear-gradient(135deg,#2C1A0E,#5C3317); }
.deal-img.spa { background:linear-gradient(135deg,#0D2B2B,#1A5F5A); }
.deal-img.recreation { background:linear-gradient(135deg,#0F2040,#1A3A6B); }
.deal-img.brewery { background:linear-gradient(135deg,#2A1A00,#5C3C00); }
.deal-img.attraction { background:linear-gradient(135deg,#2D0A0A,#6B1515); }
.deal-img.shopping { background:linear-gradient(135deg,#1A0A2E,#3D1A6B); }

.deal-badge {
  position:absolute; top:10px; left:10px; z-index:2;
  background:var(--gold); color:var(--forest);
  font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px;
  text-transform:uppercase; letter-spacing:0.5px;
}
.deal-badge.new { background:var(--rust); color:white; }
.deal-badge.popular { background:var(--forest); color:var(--gold-light); }

.deal-body { padding:14px; }
.deal-cat { font-size:9px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--sage); margin-bottom:4px; }
.deal-name { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:700; color:var(--ink); line-height:1.2; margin-bottom:3px; }
.deal-loc { font-size:11px; color:var(--gray); margin-bottom:8px; }
.deal-offer {
  background:var(--cream); border-left:2px solid var(--gold);
  padding:7px 10px; border-radius:0 6px 6px 0;
  font-size:12px; font-weight:600; color:var(--forest); line-height:1.3;
}

/* ── COUPON MODAL ── */
.modal-overlay {
  display:none; position:fixed; inset:0; z-index:200;
  background:rgba(10,10,8,0.85); backdrop-filter:blur(6px);
  align-items:flex-end; justify-content:center; padding:0;
}
.modal-overlay.open { display:flex; }
@media(min-width:600px) { .modal-overlay { align-items:center; padding:20px; } }

.modal {
  background:white; width:100%; max-width:480px;
  border-radius:24px 24px 0 0; max-height:92vh; overflow-y:auto;
  animation:slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1);
  position:relative;
}
@media(min-width:600px) { .modal { border-radius:24px; animation:popIn 0.3s cubic-bezier(0.34,1.3,0.64,1); } }

@keyframes slideUp {
  from { transform:translateY(100%); }
  to { transform:translateY(0); }
}
@keyframes popIn {
  from { transform:scale(0.9); opacity:0; }
  to { transform:scale(1); opacity:1; }
}

.modal-drag { width:40px; height:4px; background:var(--gray-light); border-radius:2px; margin:12px auto 0; }
@media(min-width:600px) { .modal-drag { display:none; } }

.modal-hero {
  height:180px; display:flex; align-items:center; justify-content:center;
  font-size:72px; position:relative; overflow:hidden;
}
.modal-hero img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
.modal-hero .emoji { position:relative; z-index:1; }
.modal-close {
  position:absolute; top:12px; right:12px; z-index:10;
  width:34px; height:34px; border-radius:50%;
  background:rgba(0,0,0,0.4); border:none; color:white;
  font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;
}

.modal-body { padding:24px; }
.modal-cat { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--sage); margin-bottom:4px; }
.modal-name { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:700; color:var(--ink); margin-bottom:2px; line-height:1.1; }
.modal-loc { font-size:13px; color:var(--gray); margin-bottom:18px; }

.offer-block {
  background:linear-gradient(135deg, var(--forest) 0%, var(--sage) 100%);
  border-radius:14px; padding:20px; margin-bottom:16px; text-align:center;
}
.offer-label { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-bottom:6px; }
.offer-text { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:700; color:white; margin-bottom:14px; line-height:1.2; }
.code-box {
  background:rgba(255,255,255,0.12); border:2px dashed rgba(255,255,255,0.3);
  border-radius:10px; padding:12px 16px;
  display:flex; align-items:center; justify-content:space-between; gap:10px;
}
.member-code { font-family:'Outfit',sans-serif; font-size:22px; font-weight:700; color:var(--gold-light); letter-spacing:3px; }
.copy-code-btn {
  background:var(--gold); color:var(--forest);
  border:none; border-radius:7px; padding:7px 14px;
  font-size:11px; font-weight:700; font-family:'Outfit',sans-serif;
  cursor:pointer; transition:all 0.2s; white-space:nowrap;
}
.copy-code-btn.copied { background:#4CAF50; color:white; }

.modal-details { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
.detail-item { background:var(--cream); border-radius:8px; padding:12px; }
.detail-label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:var(--gray); margin-bottom:3px; }
.detail-value { font-size:13px; font-weight:600; color:var(--ink); }

.redeem-btn {
  width:100%; padding:16px;
  background:var(--forest); color:white;
  border:none; border-radius:12px;
  font-size:16px; font-weight:700; font-family:'Outfit',sans-serif;
  cursor:pointer; transition:all 0.2s;
  display:flex; align-items:center; justify-content:center; gap:8px;
}
.redeem-btn:hover { background:var(--sage); transform:translateY(-1px); }
.redeem-btn:active { transform:scale(0.98); }
.redeem-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
.redeem-btn.already-used { background:var(--gray); cursor:not-allowed; }

.terms-text { font-size:11px; color:var(--gray); text-align:center; margin-top:10px; line-height:1.5; }

/* ── CONFIRM SCREEN ── */
.confirm-screen {
  display:none; position:fixed; inset:0; z-index:300;
  background:var(--green-confirm);
  flex-direction:column; align-items:center; justify-content:center;
  text-align:center; padding:40px 24px;
}
.confirm-screen.open { display:flex; }
.confirm-icon { font-size:80px; margin-bottom:20px; animation:bounceIn 0.5s cubic-bezier(0.34,1.6,0.64,1); }
@keyframes bounceIn { from { transform:scale(0); } to { transform:scale(1); } }
.confirm-title { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:700; color:white; margin-bottom:8px; }
.confirm-deal { font-size:18px; color:rgba(255,255,255,0.8); margin-bottom:6px; line-height:1.4; }
.confirm-merchant { font-size:14px; color:rgba(255,255,255,0.55); margin-bottom:32px; }
.confirm-code-box {
  background:rgba(255,255,255,0.12); border:2px solid rgba(255,255,255,0.25);
  border-radius:16px; padding:20px 32px; margin-bottom:32px;
}
.confirm-code-label { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.4); margin-bottom:8px; }
.confirm-code { font-family:'Outfit',sans-serif; font-size:36px; font-weight:700; color:var(--gold-light); letter-spacing:6px; }
.confirm-member { font-size:13px; color:rgba(255,255,255,0.35); margin-top:6px; }
.confirm-time { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:32px; }
.confirm-done-btn {
  background:white; color:var(--green-confirm);
  border:none; border-radius:12px; padding:14px 40px;
  font-size:15px; font-weight:700; font-family:'Outfit',sans-serif;
  cursor:pointer; transition:all 0.2s;
}
.confirm-done-btn:hover { background:var(--cream); }

/* ── LOADING / EMPTY ── */
.loading-state { text-align:center; padding:60px 20px; color:var(--gray); }
.loading-spinner { font-size:32px; animation:spin 1s linear infinite; display:block; margin-bottom:12px; }
@keyframes spin { to { transform:rotate(360deg); } }
.empty-state { text-align:center; padding:60px 20px; }
.empty-state-emoji { font-size:40px; margin-bottom:12px; }
.empty-state h3 { font-family:'Cormorant Garamond',serif; font-size:22px; color:var(--ink); margin-bottom:6px; }
.empty-state p { font-size:14px; color:var(--gray); }

/* ── EXPIRED BANNER ── */
.expired-banner {
  background:#FEF2F2; border:1px solid #FCA5A5;
  border-radius:10px; padding:14px 18px; margin-bottom:20px;
  font-size:13px; color:var(--rust); text-align:center;
}
</style>
</head>
<body>

<!-- LOGIN SCREEN -->
<div id="login-screen">
  <div class="login-screen">
    <div class="login-card">
      <div class="login-logo">Save<span>In</span>CT</div>
      <div class="login-tagline">Connecticut's Savings Membership</div>
      <div class="login-title">Access Your Deals</div>
      <div class="login-sub">Enter the email you used to purchase and your member code from your welcome email.</div>
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" class="form-input" id="login-email" placeholder="you@email.com" autocomplete="email">
      </div>
      <div class="form-group">
        <label class="form-label">Member Code</label>
        <input type="text" class="form-input" id="login-code" placeholder="SAV-XXXX-XXXX" autocomplete="off" style="font-family:'Outfit',sans-serif;letter-spacing:2px;font-size:16px;">
        <div class="form-hint">Found in your SaveInCT welcome email</div>
      </div>
      <button class="login-btn" id="login-btn">Access My Deals →</button>
      <div class="login-error" id="login-error"></div>
    </div>
  </div>
</div>

<!-- MEMBER APP -->
<div id="member-app" style="display:none;">
  <header>
    <div class="header-inner">
      <div class="header-logo">Save<span>In</span>CT</div>
      <div class="header-right">
        <div class="header-code" id="header-code">—</div>
        <button class="header-logout" id="logout-btn">Sign Out</button>
      </div>
    </div>
  </header>

  <div class="welcome-bar">
    <div class="welcome-inner">
      <div class="welcome-left">
        <h2>Hey, <em id="member-first-name">there</em>!</h2>
        <p id="member-plan-label">Annual Pass · Active</p>
      </div>
      <div class="welcome-stats">
        <div class="w-stat">
          <div class="w-stat-num" id="stat-used">0</div>
          <div class="w-stat-label">Used</div>
        </div>
        <div class="w-stat">
          <div class="w-stat-num" id="stat-deals">0</div>
          <div class="w-stat-label">Deals</div>
        </div>
        <div class="w-stat">
          <div class="w-stat-num" id="stat-days">—</div>
          <div class="w-stat-label">Days Left</div>
        </div>
      </div>
    </div>
  </div>

  <div class="main">
    <div id="expired-banner" class="expired-banner" style="display:none;">
      ⚠️ Your membership has expired. <a href="/" style="color:var(--rust);font-weight:700;">Renew here →</a>
    </div>

    <div class="filter-scroll">
      <div class="filter-bar" id="filter-bar">
        <button class="filter-btn active" data-cat="all">All Deals</button>
        <button class="filter-btn" data-cat="dining">🍽️ Dining</button>
        <button class="filter-btn" data-cat="spa">🧖 Spa & Wellness</button>
        <button class="filter-btn" data-cat="recreation">⛳ Recreation</button>
        <button class="filter-btn" data-cat="brewery">🍺 Breweries</button>
        <button class="filter-btn" data-cat="attraction">🎡 Attractions</button>
        <button class="filter-btn" data-cat="shopping">🛍️ Shopping</button>
      </div>
    </div>

    <div id="deals-container">
      <div class="loading-state">
        <span class="loading-spinner">🌿</span>
        Loading your deals...
      </div>
    </div>
  </div>
</div>

<!-- DEAL MODAL -->
<div class="modal-overlay" id="deal-modal">
  <div class="modal">
    <div class="modal-drag"></div>
    <div class="modal-hero" id="modal-hero">
      <button class="modal-close" id="modal-close">×</button>
      <span class="emoji" id="modal-emoji"></span>
    </div>
    <div class="modal-body">
      <div class="modal-cat" id="modal-cat"></div>
      <div class="modal-name" id="modal-name"></div>
      <div class="modal-loc" id="modal-loc"></div>
      <div class="offer-block">
        <div class="offer-label">Your Deal</div>
        <div class="offer-text" id="modal-offer"></div>
        <div class="code-box">
          <div class="member-code" id="modal-code"></div>
          <button class="copy-code-btn" id="copy-code-btn">Copy</button>
        </div>
      </div>
      <div class="modal-details">
        <div class="detail-item">
          <div class="detail-label">Value</div>
          <div class="detail-value" id="modal-value">—</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Valid Through</div>
          <div class="detail-value" id="modal-expiry">—</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Address</div>
          <div class="detail-value" id="modal-address" style="font-size:12px;">—</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Hours</div>
          <div class="detail-value" id="modal-hours" style="font-size:12px;">—</div>
        </div>
      </div>
      <button class="redeem-btn" id="redeem-btn">
        <span>✅</span> Redeem This Deal
      </button>
      <div class="terms-text" id="modal-terms"></div>
    </div>
  </div>
</div>

<!-- CONFIRMATION SCREEN -->
<div class="confirm-screen" id="confirm-screen">
  <div class="confirm-icon">✅</div>
  <div class="confirm-title">Deal Redeemed!</div>
  <div class="confirm-deal" id="confirm-deal"></div>
  <div class="confirm-merchant" id="confirm-merchant"></div>
  <div class="confirm-code-box">
    <div class="confirm-code-label">Member Code</div>
    <div class="confirm-code" id="confirm-code"></div>
    <div class="confirm-member" id="confirm-member"></div>
  </div>
  <div class="confirm-time" id="confirm-time"></div>
  <button class="confirm-done-btn" id="confirm-done-btn">Done</button>
</div>

<script>
const API = 'https://saveinct-production.up.railway.app';
let TOKEN = localStorage.getItem('sict_member_token') || '';
let MEMBER = JSON.parse(localStorage.getItem('sict_member') || 'null');
let allDeals = [];
let activeCat = 'all';
let activeModal = null;

const CAT_EMOJI = { dining:'🍽️', spa:'🧖', recreation:'⛳', brewery:'🍺', attraction:'🎡', shopping:'🛍️' };
const CAT_LABEL = { dining:'Dining', spa:'Spa & Wellness', recreation:'Recreation', brewery:'Breweries', attraction:'Attractions', shopping:'Shopping' };

// ── API ──
async function api(method, path, body) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : {})
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── AUTO LOGIN FROM URL ──
// Supports ?code=SAV-XXXX-XXXX in URL for deep links from email
function checkUrlCode() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (code) {
    document.getElementById('login-code').value = code.toUpperCase();
    // Focus email field for quick entry
    document.getElementById('login-email').focus();
  }
}

// ── LOGIN ──
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const code = document.getElementById('login-code').value.trim().toUpperCase();
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  if (!email || !code) {
    errEl.textContent = 'Please enter both your email and member code.';
    errEl.style.display = 'block'; return;
  }

  btn.disabled = true; btn.textContent = 'Checking...';
  errEl.style.display = 'none';

  try {
    // Auth with code first
    const auth = await api('POST', '/api/auth/member', { code });

    // Verify email matches if member has one on file
    if (auth.member.email && email &&
        auth.member.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      throw new Error(`Email doesn't match. The email on file for this code is different — check your SaveInCT welcome email.`);
    }

    TOKEN = auth.token;
    MEMBER = auth.member;
    localStorage.setItem('sict_member_token', TOKEN);
    localStorage.setItem('sict_member', JSON.stringify(MEMBER));

    showApp();
  } catch(e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Access My Deals →';
  }
}

document.getElementById('login-btn').addEventListener('click', doLogin);
document.getElementById('login-email').addEventListener('keydown', e => { if(e.key === 'Enter') doLogin(); });
document.getElementById('login-code').addEventListener('keydown', e => { if(e.key === 'Enter') doLogin(); });

// Format code input as user types
document.getElementById('login-code').addEventListener('input', function() {
  let v = this.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  if (v.length > 3 && v.startsWith('SAV')) {
    v = 'SAV-' + v.slice(3).replace(/-/g,'');
  }
  if (v.length > 7) v = v.slice(0,7) + '-' + v.slice(7,11);
  this.value = v.slice(0,12);
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('sict_member_token');
  localStorage.removeItem('sict_member');
  TOKEN = ''; MEMBER = null;
  document.getElementById('member-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'block';
});

// ── SHOW APP ──
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('member-app').style.display = 'block';

  // Header
  document.getElementById('header-code').textContent = MEMBER.code;

  // Welcome
  const firstName = MEMBER.name ? MEMBER.name.split(' ')[0] : 'there';
  document.getElementById('member-first-name').textContent = firstName;

  const expiry = new Date(MEMBER.expires_at);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((expiry - now) / (1000*60*60*24)));
  document.getElementById('stat-days').textContent = daysLeft;
  document.getElementById('member-plan-label').textContent =
    `${MEMBER.plan.charAt(0).toUpperCase() + MEMBER.plan.slice(1)} Pass · ${daysLeft > 0 ? 'Active' : 'Expired'}`;

  if (daysLeft === 0) {
    document.getElementById('expired-banner').style.display = 'block';
  }

  // Stats
  document.getElementById('stat-used').textContent = MEMBER.redemption_count || 0;

  loadDeals();
}

// ── LOAD DEALS ──
async function loadDeals() {
  try {
    const deals = await api('GET', '/api/deals');
    allDeals = deals;
    document.getElementById('stat-deals').textContent = deals.length;
    renderDeals(activeCat);
  } catch(e) {
    document.getElementById('deals-container').innerHTML =
      `<div class="empty-state"><div class="empty-state-emoji">😕</div><h3>Couldn't load deals</h3><p>${e.message}</p></div>`;
  }
}

function renderDeals(cat) {
  const filtered = cat === 'all' ? allDeals : allDeals.filter(d => d.merchant_category === cat);
  const container = document.getElementById('deals-container');

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-emoji">🔍</div><h3>No deals in this category yet</h3><p>Check back soon — we add new merchants every month.</p></div>`;
    return;
  }

  container.innerHTML = `<div class="deals-grid">${filtered.map(deal => {
    const cat = deal.merchant_category;
    const emoji = CAT_EMOJI[cat] || '🏪';
    const imgHtml = deal.merchant_image
      ? `<img src="${API}${deal.merchant_image}" alt="${deal.merchant_name}" loading="lazy"><span class="emoji-fallback" style="display:none">${emoji}</span>`
      : `<span class="emoji-fallback">${emoji}</span>`;
    const badgeHtml = deal.badge
      ? `<div class="deal-badge ${deal.badge.toLowerCase()}">${deal.badge}</div>`
      : '';
    return `
      <div class="deal-card" onclick="openDeal(${deal.id})">
        <div class="deal-img ${cat}">${imgHtml}${badgeHtml}</div>
        <div class="deal-body">
          <div class="deal-cat">${CAT_LABEL[cat] || cat}</div>
          <div class="deal-name">${deal.merchant_name}</div>
          <div class="deal-loc">📍 ${deal.merchant_location || ''}</div>
          <div class="deal-offer">${deal.offer_text}</div>
        </div>
      </div>`;
  }).join('')}</div>`;
}

// ── FILTERS ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeCat = this.dataset.cat;
    renderDeals(activeCat);
  });
});

// ── OPEN DEAL MODAL ──
function openDeal(dealId) {
  const deal = allDeals.find(d => d.id === dealId);
  if (!deal) return;
  activeModal = deal;

  const cat = deal.merchant_category;
  const emoji = CAT_EMOJI[cat] || '🏪';

  // Hero
  const hero = document.getElementById('modal-hero');
  hero.className = `modal-hero ${cat}`;
  if (deal.merchant_image) {
    hero.innerHTML = `
      <button class="modal-close" id="modal-close">×</button>
      <img src="${API}${deal.merchant_image}" alt="${deal.merchant_name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">
      <span class="emoji" style="display:none">${emoji}</span>`;
  } else {
    hero.innerHTML = `
      <button class="modal-close" id="modal-close">×</button>
      <span class="emoji">${emoji}</span>`;
  }
  document.getElementById('modal-close').addEventListener('click', closeModal);

  document.getElementById('modal-cat').textContent = CAT_LABEL[cat] || cat;
  document.getElementById('modal-name').textContent = deal.merchant_name;
  document.getElementById('modal-loc').textContent = '📍 ' + (deal.merchant_location || '');
  document.getElementById('modal-offer').textContent = deal.offer_text;
  document.getElementById('modal-code').textContent = MEMBER.code;
  document.getElementById('modal-value').textContent = deal.value_text || '—';
  document.getElementById('modal-expiry').textContent = deal.expires_at ? new Date(deal.expires_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : 'No expiry';
  document.getElementById('modal-address').textContent = deal.merchant_address || '—';
  document.getElementById('modal-hours').textContent = deal.merchant_hours || '—';
  document.getElementById('modal-terms').textContent = deal.terms ? `📋 ${deal.terms}` : 'One use per visit. Valid with active SaveInCT membership.';

  const redeemBtn = document.getElementById('redeem-btn');
  redeemBtn.disabled = false;
  redeemBtn.className = 'redeem-btn';
  redeemBtn.innerHTML = '<span>✅</span> Redeem This Deal';

  document.getElementById('deal-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('deal-modal').classList.remove('open');
  document.body.style.overflow = '';
  activeModal = null;
}

document.getElementById('deal-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('deal-modal')) closeModal();
});

// ── COPY CODE ──
document.getElementById('copy-code-btn').addEventListener('click', function() {
  navigator.clipboard.writeText(MEMBER.code).then(() => {
    this.textContent = '✓ Copied';
    this.classList.add('copied');
    setTimeout(() => { this.textContent = 'Copy'; this.classList.remove('copied'); }, 2000);
  });
});

// ── REDEEM ──
document.getElementById('redeem-btn').addEventListener('click', async function() {
  if (!activeModal || !MEMBER) return;

  this.disabled = true;
  this.innerHTML = '<span>⏳</span> Redeeming...';

  try {
    await api('POST', '/api/redemptions/redeem', {
      member_code: MEMBER.code,
      deal_id: activeModal.id
    });

    // Show confirmation screen
    closeModal();
    showConfirm(activeModal);

    // Update used count
    const usedEl = document.getElementById('stat-used');
    usedEl.textContent = parseInt(usedEl.textContent || 0) + 1;

  } catch(e) {
    if (e.message.includes('24 hours')) {
      this.className = 'redeem-btn already-used';
      this.innerHTML = '⏰ Already used today — come back tomorrow';
    } else {
      this.disabled = false;
      this.innerHTML = '<span>✅</span> Redeem This Deal';
      alert('Error: ' + e.message);
    }
  }
});

// ── CONFIRM SCREEN ──
function showConfirm(deal) {
  document.getElementById('confirm-deal').textContent = deal.offer_text;
  document.getElementById('confirm-merchant').textContent = deal.merchant_name + ' · ' + (deal.merchant_location || '');
  document.getElementById('confirm-code').textContent = MEMBER.code;
  document.getElementById('confirm-member').textContent = MEMBER.name || MEMBER.email;
  document.getElementById('confirm-time').textContent =
    'Redeemed at ' + new Date().toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', hour12:true}) +
    ' on ' + new Date().toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'});
  document.getElementById('confirm-screen').classList.add('open');
}

document.getElementById('confirm-done-btn').addEventListener('click', () => {
  document.getElementById('confirm-screen').classList.remove('open');
});

// ── INIT ──
checkUrlCode();

// Auto-login if session exists
if (TOKEN && MEMBER) {
  // Verify token still valid by fetching member data
  fetch(`${API}/api/members/portal/${MEMBER.code}`)
    .then(r => r.json())
    .then(data => {
      if (data.id) {
        MEMBER = { ...MEMBER, ...data };
        localStorage.setItem('sict_member', JSON.stringify(MEMBER));
        showApp();
      } else {
        document.getElementById('login-screen').style.display = 'block';
      }
    })
    .catch(() => {
      // Offline or error — show app anyway with cached data
      showApp();
    });
} else {
  document.getElementById('login-screen').style.display = 'block';
}
</script>
</body>
</html>
