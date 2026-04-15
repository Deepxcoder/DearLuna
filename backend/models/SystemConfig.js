import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'smtp',
    unique: true
  },
  settings: {
    host: { type: String, default: '' },
    port: { type: Number, default: 587 },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
    secure: { type: Boolean, default: false },
    senderEmail: { type: String, default: 'no-reply@dearluna.app' }
  }
}, {
  timestamps: true
});

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);
export default SystemConfig;
