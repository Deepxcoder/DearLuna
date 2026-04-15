#!/usr/bin/env node
import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT = '587',
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE = 'false',
  EMAIL_FROM,
  EMAIL_TO,
  EMAIL_SUBJECT,
  EMAIL_BODY,
} = process.env;

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
};

const to = getArg('to', EMAIL_TO);
const subject = getArg('subject', EMAIL_SUBJECT || 'DearLuna Reminder');
const text = getArg('text', EMAIL_BODY || 'Time to check in with your Daily Glow.');

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM || !to) {
  console.error('Missing required config. Set SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM and --to (or EMAIL_TO).');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const html = `
  <div style="font-family:Arial,sans-serif;padding:16px;background:#f7f7ff;border-radius:10px;color:#241b2f;">
    <h2 style="margin:0 0 8px;">DearLuna Notification</h2>
    <p style="margin:0 0 12px;">${text}</p>
    <small style="opacity:.7;">Sent ${new Date().toISOString()}</small>
  </div>
`;

try {
  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
  console.log(`Email sent: ${info.messageId}`);
} catch (error) {
  console.error('Failed to send email notification:', error.message);
  process.exit(1);
}
