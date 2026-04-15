import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { getRandomAffirmation } from './utils/affirmations.js';

// Models
import User from './models/User.js';
import DailyLog from './models/DailyLog.js';
import Journal from './models/Journal.js';

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
    console.log('🌙 SUCCESS: Connected to MongoDB (dearluna)');
    console.log(`📡 DB Host: ${mongoose.connection.host}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB CONNECTION ERROR:');
    console.error(err.message);
    console.log('⚠️  Make sure MongoDB is running locally (mongod) or provide a valid MONGODB_URI.');
  });

// --- EMAIL NOTIFICATION LOGIC ---

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT = 587, SMTP_USER, SMTP_PASS, SMTP_SECURE = 'false' } = process.env;
  
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('⚠️ SMTP settings missing. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
};

const generateEmailTemplate = (user, dailyLog, affirmation) => {
  const name = user.name || 'Luna User';
  const rituals = dailyLog?.rituals || { water: 0, meditation: false, exercise: false };
  const waterProgress = Math.min(100, Math.round((rituals.water / (user.settings?.waterTarget || 2000)) * 100));

  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFF5F8; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 50px rgba(255, 183, 197, 0.2); border: 1px solid #FFE4E9;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FFD1DC 0%, #E0BBE4 100%); padding: 40px; text-align: center;">
          <h1 style="color: #4A3525; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🌙 DearLuna</h1>
          <p style="color: #4A3525; opacity: 0.8; margin: 10px 0 0; font-weight: 500;">Your Daily Radiance Check-in</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
          <h2 style="color: #4A3525; margin: 0 0 15px; font-size: 24px;">Hi ${name},</h2>
          <div style="background-color: #FFF9FA; border-left: 4px solid #FFD1DC; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <p style="color: #4A3525; font-style: italic; margin: 0; font-size: 18px; line-height: 1.6;">"${affirmation}"</p>
          </div>

          <!-- Rituals -->
          <h3 style="color: #7A593E; text-transform: uppercase; font-size: 13px; letter-spacing: 1.5px; margin-bottom: 20px;">Today's Progress</h3>
          
          <div style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #4A3525; font-weight: 600;">💧 Hydration</span>
              <span style="color: #7A593E; font-size: 13px;">${rituals.water}ml / ${user.settings?.waterTarget || 2000}ml</span>
            </div>
            <div style="width: 100%; height: 12px; background-color: #FFF1F4; border-radius: 6px; overflow: hidden;">
              <div style="width: ${waterProgress}%; height: 100%; background-color: #FFD1DC; border-radius: 6px;"></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
            <div style="background-color: ${rituals.meditation ? '#F2FDF5' : '#FFF9FA'}; border: 1px solid ${rituals.meditation ? '#D1FADF' : '#FFE4E9'}; padding: 15px; border-radius: 20px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">🧘</div>
              <div style="color: #4A3525; font-size: 13px; font-weight: 600;">Meditation</div>
              <div style="color: #7A593E; font-size: 11px;">${rituals.meditation ? 'Completed!' : 'Not yet logged'}</div>
            </div>
            <div style="background-color: ${rituals.exercise ? '#F2FDF5' : '#FFF9FA'}; border: 1px solid ${rituals.exercise ? '#D1FADF' : '#FFE4E9'}; padding: 15px; border-radius: 20px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">🏃</div>
              <div style="color: #4A3525; font-size: 13px; font-weight: 600;">Excercise</div>
              <div style="color: #7A593E; font-size: 11px;">${rituals.exercise ? 'Completed!' : 'Not yet logged'}</div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="http://localhost:5173" style="display: inline-block; background: linear-gradient(135deg, #FFD1DC 0%, #E0BBE4 100%); color: #4A3525; text-decoration: none; padding: 18px 40px; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 25px rgba(255, 183, 197, 0.4);">
              Go to Dashboard
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #FBFBFF; padding: 30px; text-align: center; border-top: 1px solid #F0F0FF;">
          <p style="color: #7A593E; font-size: 12px; margin: 0;">Sent with love from DearLuna</p>
          <p style="color: #A0A0A0; font-size: 11px; margin: 10px 0 0;">You received this because you're a member of the DearLuna community.</p>
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
    const { displayName = '', date } = req.body;
    const todayDate = date || new Date().toISOString().slice(0, 10);

    let user = await User.findOne({ uid });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await User.create({ uid, ...buildDefaultProfile(displayName) });
    } else if (typeof user.hasSetPeriodDate === 'undefined') {
      // Backfill legacy users so existing accounts aren't blocked by onboarding
      user.hasSetPeriodDate = Boolean(user.lastPeriodDate);
      await user.save();
    }

    const baseLog = buildDefaultDailyLog(todayDate);
    const dailyLog = await DailyLog.findOneAndUpdate(
      { userId: uid, date: todayDate },
      { $setOnInsert: { ...baseLog, userId: uid } },
      { new: true, upsert: true }
    );

    res.json({ isNewUser, user, dailyLog });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

app.post('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOneAndUpdate(
      { uid },
      { ...req.body, uid },
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

    const transporter = getTransporter();
    if (!transporter) {
      return res.status(503).json({ message: 'SMTP service not configured in backend' });
    }

    const { EMAIL_FROM, EMAIL_TO } = process.env;
    const targetEmail = EMAIL_TO || user.email; // Fallback to env default or user's email if we had it

    if (!targetEmail) {
      return res.status(400).json({ message: 'No recipient email found for this user.' });
    }

    const affirmation = getRandomAffirmation(user.name);
    const htmlBody = generateEmailTemplate(user, currentLog, affirmation);

    const info = await transporter.sendMail({
      from: EMAIL_FROM || '"DearLuna" <no-reply@dearluna.app>',
      to: targetEmail,
      subject: `🌙 Morning Glow: A message for you, ${user.name || 'Luna'}!`,
      text: `Hi ${user.name}, here is your daily affirmation: ${affirmation}. Time to track your rituals!`,
      html: htmlBody,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Dear Luna Backend running at http://localhost:${PORT}`);
});
