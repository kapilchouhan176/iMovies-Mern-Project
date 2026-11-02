import { Router } from 'express';
import Show from '../models/Show.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = { status: 'scheduled', startsAt: { $gte: new Date() } };
    if (req.query.movie) filter.movie = req.query.movie;
    if (req.query.theatre) filter.theatre = req.query.theatre;
    const shows = await Show.find(filter).populate('movie', 'title posterUrl genres durationMinutes').populate('theatre', 'name city address').sort({ startsAt: 1 }).limit(100);
    res.json({ shows });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try { const show = await Show.findById(req.params.id).populate('movie').populate('theatre'); if (!show) return res.status(404).json({ message: 'Show not found.' }); res.json({ show }); } catch (e) { next(e); }
});
router.post('/', protect, adminOnly, async (req, res, next) => {
  try { const show = await Show.create(req.body); res.status(201).json({ show }); } catch (e) { next(e); }
});
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try { const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!show) return res.status(404).json({ message: 'Show not found.' }); res.json({ show }); } catch (e) { next(e); }
});
export default router;
