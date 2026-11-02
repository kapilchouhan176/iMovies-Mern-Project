import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['demo-paid', 'refunded-demo'], default: 'demo-paid' }
}, { timestamps: true });
export default mongoose.model('Booking', bookingSchema);
