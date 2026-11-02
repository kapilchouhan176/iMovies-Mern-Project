import { Router } from 'express';
import Favorite from '../models/Favorite.js';
import { protect } from '../middleware/auth.js';
const router = Router(); router.use(protect);
router.get('/', async (req, res, next) => { try { res.json({ favorites: await Favorite.find({ user: req.user._id }).populate('movie') }); } catch (e) { next(e); } });
router.post('/:movieId', async (req, res, next) => { try { const favorite = await Favorite.findOneAndUpdate({ user: req.user._id, movie: req.params.movieId }, { user: req.user._id, movie: req.params.movieId }, { upsert: true, new: true, setDefaultsOnInsert: true }); res.status(201).json({ favorite }); } catch (e) { next(e); } });
router.delete('/:movieId', async (req, res, next) => { try { await Favorite.deleteOne({ user: req.user._id, movie: req.params.movieId }); res.json({ message: 'Removed from watchlist.' }); } catch (e) { next(e); } });
export default router;
