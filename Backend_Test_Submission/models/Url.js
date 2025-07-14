import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  clickDetails: [
    {
      timestamp: { type: Date, default: Date.now },
      source: { type: String },
      location: { type: String },
    }
  ]
});

export default mongoose.model('Url', urlSchema);
