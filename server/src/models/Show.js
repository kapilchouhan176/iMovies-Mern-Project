import mongoose from 'mongoose';
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  startsAt: { type: Date, required: true },
  screen: { type: Number, default: 1 },
  seatCount: { type: Number, default: 60 },
  bookedSeats: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['scheduled', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });
showSchema.index({ movie: 1, startsAt: 1 });
export default mongoose.model('Show', showSchema);
