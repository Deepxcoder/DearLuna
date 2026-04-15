import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: String, // Firebase UID
    required: true,
    index: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true
  },
  mood: { type: String, default: '' },
  energy: { type: String, default: '' }, // Low, Medium, High
  symptoms: { type: [String], default: [] },
  reflection: { type: String, default: '' },
  rituals: {
    water: { type: Number, default: 0 },
    meditation: { type: Boolean, default: false },
    exercise: { type: Boolean, default: false }
  },
  habits: {
    skincare: { type: Boolean, default: false },
    reading: { type: Boolean, default: false },
    sleep: { type: Boolean, default: false },
    journaling: { type: Boolean, default: false }
  }
}, { 
  timestamps: true 
});

// Ensure one log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
export default DailyLog;
