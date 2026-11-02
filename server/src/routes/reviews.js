import { Router } from 'express';
import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.post('/:movieId', protect, async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    const review = await Review.findOneAndUpdate(
      { user: req.user._id, movie: movie._id },
      { user: req.user._id, movie: movie._id, rating, comment: String(req.body.comment || '').slice(0, 1000) },
      { new: true, upsert: true, runValidators: true }
    );
    const aggregate = await Review.aggregate([{ $match: { movie: movie._id } }, { $group: { _id: '$movie', average: { $avg: '$rating' } } }]);
    movie.rating = aggregate[0]?.average || 0; await movie.save();
    res.status(201).json({ review });
  } catch (e) { next(e); }
});
export default router;
