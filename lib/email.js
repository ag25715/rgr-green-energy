import nodemailer from 'nodemailer';

let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  _transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return _transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    return { sent: false, reason: 'SMTP not configured', to, subject };
  }
  const from = process.env.SMTP_FROM || 'no-reply@rgrgreenenergy.com';
  try {
    const info = await t.sendMail({ from, to, subject, html, text });
    return { sent: true, messageId: info.messageId, to, subject };
  } catch (e) {
    return { sent: false, reason: e.message, to, subject };
  }
}

function esc(s = '') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export function buildLeadEmail(lead, brandName = 'RGR Green Energy') {
  const rows = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Location', lead.location],
    ['Customer Type', lead.customerType],
    ['Source', lead.source],
    ['Message', lead.message],
    ['Received', new Date(lead.createdAt).toLocaleString('en-IN')],
  ].filter(([, v]) => v);
  let calcBlock = '';
  if (lead.payload?.result) {
    const r = lead.payload.result;
    calcBlock = `<h3 style="margin:24px 0 8px;font-family:Inter,sans-serif;color:#0A1A2F">Calculator Result</h3><table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif;font-size:13px"><tr><td style="padding:6px 0;color:#556">Recommended Capacity</td><td style="padding:6px 0;text-align:right;font-weight:600">${r.recommendedKWp} kWp</td></tr><tr><td style="padding:6px 0;color:#556">Annual Savings</td><td style="padding:6px 0;text-align:right;font-weight:600">₹${(r.annualSavings||0).toLocaleString('en-IN')}</td></tr><tr><td style="padding:6px 0;color:#556">Lifetime Savings</td><td style="padding:6px 0;text-align:right;font-weight:600">₹${(r.lifetimeSavings||0).toLocaleString('en-IN')}</td></tr><tr><td style="padding:6px 0;color:#556">Subsidy</td><td style="padding:6px 0;text-align:right;font-weight:600">₹${(r.subsidy||0).toLocaleString('en-IN')}</td></tr><tr><td style="padding:6px 0;color:#556">Payback</td><td style="padding:6px 0;text-align:right;font-weight:600">${r.paybackYears||'—'} yrs</td></tr></table>`;
  }
  const html = `<!doctype html><html><body style="margin:0;background:#f4f6fa;padding:24px;font-family:Inter,Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(10,26,47,.08)">
      <div style="background:linear-gradient(135deg,#0A1A2F 0%,#182a49 100%);padding:24px 32px;color:#fff">
        <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#34d399;font-weight:600">New Lead • ${esc(lead.source)}</div>
        <div style="font-size:22px;font-weight:700;margin-top:6px">${esc(lead.name || 'Unnamed enquiry')}</div>
      </div>
      <div style="padding:24px 32px;color:#0A1A2F">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows.map(([k, v]) => `<tr><td style="padding:8px 0;color:#556;width:38%">${esc(k)}</td><td style="padding:8px 0;font-weight:600">${esc(v)}</td></tr>`).join('')}
        </table>
        ${calcBlock}
        <div style="margin-top:24px;padding:16px;background:#ecfdf5;border-radius:12px;color:#065f46;font-size:13px">Follow up within 24 hours to maximise conversion probability.</div>
      </div>
      <div style="padding:16px 32px;background:#f7f9fc;color:#8b95a7;font-size:11px;text-align:center">${esc(brandName)} — automated notification</div>
    </div></body></html>`;
  const text = `New lead (${lead.source})\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${lead.payload?.result ? `Recommended: ${lead.payload.result.recommendedKWp} kWp\nAnnual Savings: ₹${lead.payload.result.annualSavings}` : ''}`;
  return { html, text };
}
