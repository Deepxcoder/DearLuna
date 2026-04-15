import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: String,   // Firebase UID
    required: true,
    index: true
  },
  date: {
    type: String,   // YYYY-MM-DD
    required: true,
    index: true
  },

  // ── Mood & Wellbeing ──────────────────────────────────────────────────────
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'tired', 'calm', ''],
    default: ''
  },
  energy: {
    type: String,
    enum: ['Low', 'Medium', 'High', ''],
    default: ''
  },

  // ── Symptoms ──────────────────────────────────────────────────────────────
  symptoms: {
    type: [String],   // e.g. ['Cramps', 'Bloating']
    default: []
  },
  severity: {
    type: Number,     // 0–100 slider value
    default: 50
  },

  // ── Journal / Reflection ─────────────────────────────────────────────────
  reflection: {
    type: String,
    default: ''
  },

  // ── Daily Rituals ─────────────────────────────────────────────────────────
  rituals: {
    water:      { type: Number,  default: 0 },      // ml consumed
    meditation: { type: Boolean, default: false },
    exercise:   { type: Boolean, default: false }
  },

  // ── Habits ────────────────────────────────────────────────────────────────
  habits: {
    skincare:   { type: Boolean, default: false },
    journaling: { type: Boolean, default: false },
    reading:    { type: Boolean, default: false },
    sleep:      { type: Boolean, default: false }
  }

}, {
  timestamps: true   // createdAt, updatedAt
});

// One log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
export default DailyLog;
