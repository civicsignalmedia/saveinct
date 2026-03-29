const { Resend } = require('resend');

// Lazy init — don't crash if key not set yet
let _resend = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

function generateMemberCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SAV-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code; // e.g. SAV-K7MN-X2PQ
}

function getExpiry(plan) {
  const d = new Date();
  if (plan === 'seasonal') d.setMonth(d.getMonth() + 3);
  else if (plan === 'gift') d.setFullYear(d.getFullYear() + 1);
  else d.setFullYear(d.getFullYear() + 1); // annual default
  return d;
}

async function sendWelcomeEmail(member) {
  const resend = getResend();
  if (!resend) return console.log('No Resend key — skipping welcome email');

  const planLabel = member.plan === 'seasonal' ? 'Seasonal Pass (3 months)' : 'Annual Pass (12 months)';
  const portalUrl = `${process.env.SITE_URL || 'https://saveinct.com'}/member/${member.code}`;

  await resend.emails.send({
    from: 'SaveInCT <hello@saveinct.com>',
    to: member.email,
    subject: `Welcome to SaveInCT — here's your deals portal 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:sans-serif;background:#F7F2E8;margin:0;padding:40px 20px;">
        <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="background:#1E3A0F;padding:36px 40px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:white;">Save<span style="color:#E8B84B;">In</span>CT</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.55);margin-top:6px;">Connecticut's Savings Membership</div>
          </div>
          <div style="padding:36px 40px;">
            <h2 style="font-family:Georgia,serif;font-size:26px;color:#12120F;margin:0 0 12px;">You're in, ${member.name?.split(' ')[0] || 'friend'}! 🎉</h2>
            <p style="color:#8A8678;font-size:15px;line-height:1.6;margin:0 0 28px;">Your <strong style="color:#12120F;">${planLabel}</strong> is active. Here's your member code — keep it handy, this is how you unlock deals at the door.</p>

            <div style="background:#1E3A0F;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:8px;">Your Member Code</div>
              <div style="font-size:32px;font-weight:700;color:#E8B84B;letter-spacing:4px;font-family:monospace;">${member.code}</div>
            </div>

            <a href="${portalUrl}" style="display:block;text-align:center;background:#C4922A;color:#12120F;font-weight:700;font-size:16px;padding:16px;border-radius:10px;text-decoration:none;margin-bottom:20px;">Browse My Deals →</a>

            <p style="color:#8A8678;font-size:13px;line-height:1.6;margin:0;">At any merchant, just show your code or pull up your deals portal. The merchant enters your code and the deal is applied — takes about 10 seconds.</p>
          </div>
          <div style="background:#F7F2E8;padding:20px 40px;text-align:center;">
            <p style="font-size:12px;color:#8A8678;margin:0;">Questions? <a href="mailto:hello@saveinct.com" style="color:#C4922A;">hello@saveinct.com</a> · <a href="https://saveinct.com" style="color:#C4922A;">saveinct.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  });
}

module.exports = { generateMemberCode, getExpiry, sendWelcomeEmail };
