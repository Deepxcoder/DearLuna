import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

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

app.listen(PORT, () => {
  console.log(`🚀 Dear Luna Backend running at http://localhost:${PORT}`);
});
