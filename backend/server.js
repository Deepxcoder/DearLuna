import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { getRandomAffirmation } from './utils/affirmations.js';

// Models
import User from './models/User.js';
import DailyLog from './models/DailyLog.js';
import Journal from './models/Journal.js';
import SystemConfig from './models/SystemConfig.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const buildDefaultProfile = (displayName = '') => ({
  name: displayName?.split(' ')[0] || 'Luna User',
  lastPeriodDate: new Date().toISOString(),
  hasSetPeriodDate: false,
  membership: 'Free Member',
  avatarId: null,
  pet: { level: 1, xp: 0, happiness: 100 },
  settings: { cycleLength: 28, periodLength: 5, waterTarget: 2000 },
  stats: { totalJournalEntries: 0, currentStreak: 0, entries30Days: 0, entriesYear: 0 },
  history: [],
  customHabits: []
});

const buildDefaultDailyLog = (date) => ({
  userId: '',
  date,
  mood: '',
  energy: '',
  symptoms: [],
  severity: 50,
  reflection: '',
  rituals: { water: 0, meditation: false, exercise: false },
  habits: { skincare: false, journaling: false, reading: false, sleep: false },
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dearluna';

console.log('🔌 Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('\x1b[32m%s\x1b[0m', '🌙 SUCCESS: Connected to MongoDB (dearluna)');
  })
  .catch((err) => {
    console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: Failed to connect to MongoDB!');
    console.error('   Make sure your local MongoDB server is running (mongod).');
    console.error('   Error Details:', err.message);
  });

// --- EMAIL NOTIFICATION LOGIC ---

const THEME_PALETTES = {
  Sakura: {
    bg: '#FFF5F8', cardBg: '#ffffff', header: 'linear-gradient(135deg, #FFD1DC 0%, #E0BBE4 100%)',
    primary: '#FFD1DC', accent: '#FFD1DC', text: '#4A3525', subtext: '#7A593E',
    border: '#FFE4E9', barBg: '#FFF1F4', quoteBg: '#FFF9FA'
  },
  Midnight: {
    bg: '#0F172A', cardBg: '#1E293B', header: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
    primary: '#818CF8', accent: '#6366F1', text: '#F8FAFC', subtext: '#94A3B8',
    border: '#334155', barBg: '#0F172A', quoteBg: '#1E1B4B',
    stars: true
  },
  Ocean: {
    bg: '#F0F8FA', cardBg: '#ffffff', header: 'linear-gradient(135deg, #82C0CC 0%, #4CC9F0 100%)',
    primary: '#4CC9F0', accent: '#82C0CC', text: '#1A3A40', subtext: '#3D5A61',
    border: '#E0F2F1', barBg: '#E0FBFC', quoteBg: '#F0F8FA'
  },
  Forest: {
    bg: '#F2F4EF', cardBg: '#ffffff', header: 'linear-gradient(135deg, #A3B18A 0%, #344E41 100%)',
    primary: '#588157', accent: '#A3B18A', text: '#344E41', subtext: '#588157',
    border: '#E9EDC9', barBg: '#F2F4EF', quoteBg: '#F2F4EF'
  }
};

const getTransporter = async () => {
  // Try to get from Database first
  let config = await SystemConfig.findOne({ type: 'smtp' });
  
  let host, port, user, pass, secure;

  if (config && config.settings) {
    ({ host, port, user, pass, secure } = config.settings);
    console.log(`📡 DB Config read attempt: Host=${host || 'EMPTY'}, User=${user || 'EMPTY'}`);
  } else {
    // Fallback to environment variables
    ({ SMTP_HOST: host, SMTP_PORT: port = 587, SMTP_USER: user, SMTP_PASS: pass, SMTP_SECURE: secure = 'false' } = process.env);
    console.log('📡 No DB config found, falling back to ENV variables.');
  }
  
  if (!host || !user || !pass) {
    console.warn('\x1b[31m%s\x1b[0m', '❌ CRITICAL: SMTP settings found but some fields are BLANK.');
    console.log(`   Host: ${host ? 'OK' : 'MISSING'}`);
    console.log(`   User: ${user ? 'OK' : 'MISSING'}`);
    console.log(`   Pass: ${pass ? 'OK' : 'MISSING'}`);
    return null;
  }

  // Sanitize: Trim whitespace and remove spaces from App Passwords if present
  const cleanHost = String(host).trim();
  const cleanUser = String(user).trim();
  const cleanPass = String(pass).trim().replace(/\s+/g, '');
  const isSecure = String(secure).toLowerCase() === 'true';

  console.log(`🔌 Initializing SMTP Transporter: ${cleanHost}:${port} (Secure: ${isSecure}, User: ${cleanUser})`);

  return nodemailer.createTransport({
    host: cleanHost,
    port: Number(port),
    secure: isSecure,
    auth: { user: cleanUser, pass: cleanPass },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
};

const generateEmailTemplate = (user, dailyLog, affirmation) => {
  const name = user.name || 'Luna User';
  const themeName = user.settings?.theme || 'Sakura';
  const theme = THEME_PALETTES[themeName] || THEME_PALETTES.Sakura;
  
  const rituals = dailyLog?.rituals || { water: 0, meditation: false, exercise: false };
  const waterTarget = user.settings?.waterTarget || 2000;
  const waterProgress = Math.min(100, Math.round((rituals.water / waterTarget) * 100));

  const starStyle = theme.stars ? `
    background-image: 
      radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.4), transparent),
      radial-gradient(1px 1px at 40% 25%, rgba(255,255,255,0.4), transparent),
      radial-gradient(1px 1px at 70% 35%, rgba(255,255,255,0.4), transparent),
      radial-gradient(1px 1px at 90% 85%, rgba(255,255,255,0.4), transparent);
  ` : '';

  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${theme.bg}; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${theme.cardBg}; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid ${theme.border};">
        <!-- Header -->
        <div style="background: ${theme.header}; padding: 40px; text-align: center; position: relative; ${starStyle}">
          <h1 style="color: ${theme.stars ? '#ffffff' : '#4A3525'}; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🌙 DearLuna</h1>
          <p style="color: ${theme.stars ? '#ffffff' : '#4A3525'}; opacity: 0.8; margin: 10px 0 0; font-weight: 500;">Your Daily Radiance Check-in</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
          <h2 style="color: ${theme.text}; margin: 0 0 15px; font-size: 24px;">Hi ${name},</h2>
          <div style="background-color: ${theme.quoteBg}; border-left: 4px solid ${theme.primary}; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <p style="color: ${theme.text}; font-style: italic; margin: 0; font-size: 18px; line-height: 1.6;">"${affirmation}"</p>
          </div>

          <!-- Rituals -->
          <h3 style="color: ${theme.subtext}; text-transform: uppercase; font-size: 13px; letter-spacing: 1.5px; margin-bottom: 20px;">Today's Progress</h3>
          
          <div style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: ${theme.text}; font-weight: 600;">💧 Hydration</span>
              <span style="color: ${theme.subtext}; font-size: 13px;">${rituals.water}ml / ${waterTarget}ml</span>
            </div>
            <div style="width: 100%; height: 12px; background-color: ${theme.barBg}; border-radius: 6px; overflow: hidden;">
              <div style="width: ${waterProgress}%; height: 100%; background-color: ${theme.primary}; border-radius: 6px;"></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
            <div style="background-color: ${rituals.meditation ? (theme.stars ? '#1e293b' : '#f8fafc') : theme.quoteBg}; border: 1px solid ${theme.border}; padding: 15px; border-radius: 20px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">🧘</div>
              <div style="color: ${theme.text}; font-size: 13px; font-weight: 600;">Meditation</div>
              <div style="color: ${theme.subtext}; font-size: 11px;">${rituals.meditation ? 'Completed!' : 'Not yet logged'}</div>
            </div>
            <div style="background-color: ${rituals.exercise ? (theme.stars ? '#1e293b' : '#f8fafc') : theme.quoteBg}; border: 1px solid ${theme.border}; padding: 15px; border-radius: 20px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">🏃</div>
              <div style="color: ${theme.text}; font-size: 13px; font-weight: 600;">Excercise</div>
              <div style="color: ${theme.subtext}; font-size: 11px;">${rituals.exercise ? 'Completed!' : 'Not yet logged'}</div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="http://localhost:5173" style="display: inline-block; background: ${theme.header}; color: ${theme.stars ? '#ffffff' : '#4A3525'}; text-decoration: none; padding: 18px 40px; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              Go to Dashboard
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: ${theme.stars ? '#0F172A' : '#FBFBFF'}; padding: 30px; text-align: center; border-top: 1px solid ${theme.border};">
          <p style="color: ${theme.subtext}; font-size: 12px; margin: 0;">Sent with love from DearLuna</p>
          <p style="color: ${theme.subtext}; opacity: 0.6; font-size: 11px; margin: 10px 0 0;">You received this because you're a member of the DearLuna community.</p>
        </div>
      </div>
    </div>
  `;
};

// --- USER ROUTES ---

// Bootstrap user + date-specific log in one roundtrip
app.post('/api/users/:uid/bootstrap', async (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName = '', email = '', date } = req.body;
    const todayDate = date || new Date().toISOString().slice(0, 10);

    let user = await User.findOne({ uid });
    let isNewUser = false;
    
    if (!user) {
      isNewUser = true;
      const isAdminEmail = email.toLowerCase().startsWith('deepxkotval@gmail');
      const role = isAdminEmail ? 'admin' : 'user';
      
      console.log(`🆕 Creating new user: ${email} -> Role: ${role}`);
      
      user = await User.create({ 
        uid, 
        email,
        role,
        ...buildDefaultProfile(displayName) 
      });
    } else {
      // Sync email if provided and different
      if (email && user.email !== email) {
        user.email = email;
        await user.save();
      }
      
      // Auto-promote if admin email matches (Flexible check)
      const isAdminEmail = email.toLowerCase().startsWith('deepxkotval@gmail');
      if (isAdminEmail && user.role !== 'admin') {
        console.log(`👑 Promoting user to Admin: ${email}`);
        user.role = 'admin';
        await user.save();
      }

      console.log(`📡 Bootstrap for ${email}: Role=${user.role}`);

      if (typeof user.hasSetPeriodDate === 'undefined') {
        user.hasSetPeriodDate = Boolean(user.lastPeriodDate);
        await user.save();
      }
    }

    const baseLog = buildDefaultDailyLog(todayDate);
    const dailyLog = await DailyLog.findOneAndUpdate(
      { userId: uid, date: todayDate },
      { $setOnInsert: { ...baseLog, userId: uid } },
      { new: true, upsert: true }
    );

    res.json({ isNewUser, user, dailyLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete account (destroys profile and all logs)
app.delete('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    console.log(`🗑️ PERMANENT DELETION REQUESTED: UID=${uid}`);
    
    const userResult = await User.findOneAndDelete({ uid });
    if (!userResult) {
      return res.status(404).json({ error: 'User not found' });
    }

    const logResult = await DailyLog.deleteMany({ userId: uid });
    
    console.log(`✅ Deletion Complete: User purged, ${logResult.deletedCount} logs removed.`);
    res.json({ success: true, message: 'Account and data permanently deleted.' });
  } catch (error) {
    console.error('❌ Deletion failed:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    let user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN ROUTES ---

const isAdmin = async (req, res, next) => {
  const { adminuid } = req.headers; // Simplification for local demo
  if (!adminuid) return res.status(401).json({ message: 'Unauthorized' });
  const user = await User.findOne({ uid: adminuid });
  if (user && user.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notify/habit', async (req, res) => {
  try {
    const { uid, habitName } = req.body;
    const user = await User.findOne({ uid });
    if (!user || (!user.email && !process.env.SMTP_USER)) {
      return res.status(400).json({ success: false, message: 'Recipient email not found for this user.' });
    }

    const recipient = user.email || process.env.SMTP_USER;
    const transporter = await getTransporter();
    if (!transporter) throw new Error('SMTP not configured');

    const theme = themes[user.settings?.theme] || themes.Sakura;
    
    await transporter.sendMail({
      from: `"DearLuna" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: `✨ Time for your ritual: ${habitName}`,
      html: buildThemedEmail({
        name: user.name,
        theme,
        rituals: { [habitName.toLowerCase()]: true }
      })
    });

    console.log(`✉️ Habit notification sent to ${recipient} for ${habitName}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = { ...req.body };
    
    // SECURITY: Never allow 'role' or 'uid' to be patched directly
    delete updateData.role;
    delete updateData.uid;

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- DAILY LOG ROUTES ---

// Get log for a specific date (YYYY-MM-DD)
app.get('/api/logs/:uid/:date', async (req, res) => {
  try {
    const { uid, date } = req.params;
    const baseLog = buildDefaultDailyLog(date);
    const log = await DailyLog.findOneAndUpdate(
      { userId: uid, date },
      { $setOnInsert: { ...baseLog, userId: uid } },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/Update log for a specific date
app.post('/api/logs/:uid/:date', async (req, res) => {
  try {
    const { uid, date } = req.params;
    const log = await DailyLog.findOneAndUpdate(
      { userId: uid, date },
      { ...req.body, userId: uid, date },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get logs for a range of dates
app.get('/api/logs/:uid/range/:start/:end', async (req, res) => {
  try {
    const { uid, start, end } = req.params;
    const logs = await DailyLog.find({ 
      userId: uid, 
      date: { $gte: start, $lte: end } 
    }).sort({ date: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- JOURNAL ROUTES ---

app.get('/api/journal/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const entries = await Journal.find({ userId: uid }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/journal/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const entry = new Journal({ ...req.body, userId: uid });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- NOTIFICATION ROUTES ---

app.post('/api/notify/daily/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const todayDate = new Date().toISOString().slice(0, 10);
    const dailyLog = await DailyLog.findOne({ userId: uid, date: todayDate });
    
    // Fallback log if none exists for today
    const currentLog = dailyLog || buildDefaultDailyLog(todayDate);

    const transporter = await getTransporter();
    if (!transporter) {
      return res.status(503).json({ message: 'SMTP service not configured in backend' });
    }

    const { recipientEmail } = req.body;
    
    const config = await SystemConfig.findOne({ type: 'smtp' });
    const { EMAIL_FROM, EMAIL_TO } = process.env;

    const senderEmail = config?.settings?.senderEmail || EMAIL_FROM || '"DearLuna" <no-reply@dearluna.app>';
    
    // Priority: 1. Body Override, 2. Manual ENV, 3. User profile email, 4. Fallback to SMTP sender
    const targetEmail = recipientEmail || EMAIL_TO || user.email || config?.settings?.user; 

    console.log('🔍 DEARLUNA DEBUG: Recipient Search');
    console.log(`   - Body Override: ${recipientEmail || 'none'}`);
    console.log(`   - User Profile:  ${user.email || 'empty'}`);
    console.log(`   - SMTP Config:  ${config?.settings?.user || 'empty'}`);
    console.log(`   - Final Target: ${targetEmail || 'NULL'}`);

    if (!targetEmail) {
      console.error('❌ NO RECIPIENT FOUND - Aborting Send');
      return res.status(400).json({ message: 'No recipient email found. Please provide one in the test box or your profile.' });
    }

    const affirmation = getRandomAffirmation(user.name);
    const htmlBody = generateEmailTemplate(user, currentLog, affirmation);

    console.log(`📧 Attempting to send trial email to: ${targetEmail}...`);

    const info = await transporter.sendMail({
      from: senderEmail,
      to: targetEmail,
      subject: `🌙 Morning Glow: A message for you, ${user.name || 'Luna'}!`,
      text: `Hi ${user.name}, here is your daily affirmation: ${affirmation}. Time to track your rituals!`,
      html: htmlBody,
    });

    console.log('✅ Email sent successfully! MessageID:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ NOTIFICATION ERROR:');
    console.error('   Details:', error.message);
    if (error.code === 'EAUTH') {
      console.error('   Tip: Check your Username and App Password. Ensure 2FA is on for Gmail.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('   Tip: Check your SMTP Host and Port. For Port 587, Secure Connection should be OFF.');
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CONFIG ROUTES ---

app.get('/api/config/smtp', async (req, res) => {
  try {
    let config = await SystemConfig.findOne({ type: 'smtp' });
    if (!config) {
      // Return env defaults if no DB config exists yet
      return res.json({
        host: process.env.SMTP_HOST || '',
        port: process.env.SMTP_PORT || 587,
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS ? '********' : '', // Mask password
        secure: process.env.SMTP_SECURE === 'true',
        senderEmail: process.env.EMAIL_FROM || 'no-reply@dearluna.app'
      });
    }
    const masked = { ...config.settings, pass: '********' };
    res.json(masked);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config/smtp', async (req, res) => {
  try {
    const { host, port, user, pass, secure, senderEmail } = req.body;
    console.log(`📂 SAVING SMTP CONFIG: Host=${host}, User=${user}, Port=${port}`);
    
    // Create an update object using dot notation to preserve other fields (like password)
    const updateFields = {
      'settings.host': String(host).trim(),
      'settings.port': Number(port),
      'settings.user': String(user).trim(),
      'settings.secure': String(secure).toLowerCase() === 'true',
      'settings.senderEmail': String(senderEmail).trim(),
      'type': 'smtp'
    };

    // Only update password if a new one is provided (not stars)
    if (pass && pass !== '********') {
      const cleanPass = String(pass).trim().replace(/\s+/g, '');
      updateFields['settings.pass'] = cleanPass;
      console.log('   🔑 Password update detected and sanitized.');
    }

    const config = await SystemConfig.findOneAndUpdate(
      { type: 'smtp' },
      { $set: updateFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log('✅ SMTP Config merged and saved successfully.');
    res.json({ success: true, message: 'SMTP Configuration saved to MongoDB' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/config/smtp/verify', async (req, res) => {
  try {
    const { host, port, user, pass, secure } = req.body;
    
    console.log(`🔌 VERIFYING SMTP: ${host}:${port} (User: ${user})`);
    
    const cleanPass = String(pass).trim().replace(/\s+/g, '');
    
    // For verify, we use a very short timeout
    const testTransporter = nodemailer.createTransport({
      host: String(host).trim(),
      port: Number(port),
      secure: String(secure).toLowerCase() === 'true',
      auth: { user: String(user).trim(), pass: cleanPass },
      connectionTimeout: 5000, // 5 seconds
      greetingTimeout: 5000
    });

    await testTransporter.verify();
    console.log('✅ SMTP VERIFICATION SUCCESS!');
    res.json({ success: true, message: 'SMTP login successful!' });
  } catch (error) {
    let userMsg = error.message;
    console.error('\x1b[31m%s\x1b[0m', '❌ SMTP VERIFICATION FAILED:');
    
    if (error.code === 'EAUTH') {
      userMsg = 'Invalid Login! Make sure you are using a 16-character App Password, not your regular Gmail password. 🔑';
      console.log('   👉 Suggestion: Check Gmail App Password & 2FA.');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      userMsg = 'Connection Timeout! Try toggling the "Use Secure Connection" box or changing the Port. 🌐';
      console.log('   👉 Suggestion: Toggle "Secure" checkbox or check your firewall.');
    } else if (error.message.includes('STARTTLS')) {
      userMsg = 'Port Conflict! Try UNCHECKING the "Use Secure Connection" box. 💡';
      console.log('   👉 Suggestion: STARTTLS requires Secure to be FALSE.');
    }

    console.error('   Error Code:', error.code || 'UNKNOWN');
    console.error('   Details:', error.message);
    res.status(500).json({ success: false, message: userMsg });
  }
});

app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
  console.log('\x1b[36m%s\x1b[0m', `🚀 Dear Luna Backend running at http://localhost:${PORT}`);
  
  // LOG ACTIVE ROUTES FOR DEBUGGING
  console.log('\x1b[32m%s\x1b[0m', '✅ ACTIVE API ROUTES:');
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      const methods = Object.keys(r.route.methods).join(',').toUpperCase();
      console.log(`   [${methods}] ${r.route.path}`);
    }
  });
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------------------');
});
