import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  synopsis: { type: String, required: true },
  genres: [{ type: String }],
  language: { type: String, default: 'English' },
  durationMinutes: { type: Number, default: 120 },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  releaseDate: { type: Date },
  posterUrl: { type: String, default: '' },
  backdropUrl: { type: String, default: '' },
  certificate: { type: String, default: 'UA' },
  cast: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Movie', movieSchema);
