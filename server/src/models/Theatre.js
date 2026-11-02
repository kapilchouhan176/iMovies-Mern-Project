import mongoose from 'mongoose';
const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, default: '' },
  screens: { type: Number, default: 1, min: 1 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Theatre', theatreSchema);
