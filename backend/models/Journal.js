import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  }
}, { 
  timestamps: true 
});

const Journal = mongoose.model('Journal', journalSchema);
export default Journal;
