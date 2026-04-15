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
  lastPeriodDate: {
    type: String, 
    default: new Date().toISOString()
  },
  // Expanded fields
  pet: {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    happiness: { type: Number, default: 100 }
  },
  settings: {
    cycleLength: { type: Number, default: 28 },
    periodLength: { type: Number, default: 5 }
  }
}, { 
  timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;
