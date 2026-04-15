import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  avatarId: {
    type: String,
    default: null    // kawaii avatar id from kawaiiAvatars.js
  },
  lastPeriodDate: {
    type: String,
    default: () => new Date().toISOString()
  },
  hasSetPeriodDate: {
    type: Boolean,
    default: false
  },
  membership: {
    type: String,
    default: 'Free Member'
  },
  pet: {
    level:     { type: Number, default: 1 },
    xp:        { type: Number, default: 0 },
    happiness: { type: Number, default: 100 }
  },
  settings: {
    cycleLength:  { type: Number, default: 28 },
    periodLength: { type: Number, default: 5 },
    waterTarget:  { type: Number, default: 2000 }  // ml
  },
  // User-defined habit definitions: [{ id, emoji, name, color }]
  customHabits: {
    type: [{
      id:    { type: String, required: true },
      emoji: { type: String, default: '✨' },
      name:  { type: String, required: true },
      color: { type: String, default: 'bg-pink-50' }
    }],
    default: []
  },
  stats: {
    totalJournalEntries: { type: Number, default: 0 },
    currentStreak:       { type: Number, default: 0 },
    entries30Days:       { type: Number, default: 0 },
    entriesYear:         { type: Number, default: 0 }
  },
  history: {
    type: [{
      month:    String,
      duration: String,
      status:   String
    }],
    default: []
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
