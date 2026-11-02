import { Router } from 'express';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.query.genre && req.query.genre !== 'All') query.genres = req.query.genre;
    if (req.query.q) query.title = { $regex: String(req.query.q).slice(0, 80), $options: 'i' };
    res.json({ movies: await Movie.find(query).sort({ createdAt: -1 }).limit(100) });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, isActive: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    const reviews = await Review.find({ movie: movie._id }).populate('user', 'name').sort({ createdAt: -1 }).limit(30);
    res.json({ movie, reviews });
  } catch (e) { next(e); }
});
router.post('/', protect, adminOnly, async (req, res, next) => {
  try { res.status(201).json({ movie: await Movie.create(req.body) }); } catch (e) { next(e); }
});
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try { const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!movie) return res.status(404).json({ message: 'Movie not found.' }); res.json({ movie }); } catch (e) { next(e); }
});
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try { await Movie.findByIdAndUpdate(req.params.id, { isActive: false }); res.json({ message: 'Movie archived.' }); } catch (e) { next(e); }
});
export default router;
