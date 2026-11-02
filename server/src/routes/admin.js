import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
const router = Router();
router.use(protect, adminOnly);
router.get('/stats', async (_req, res, next) => {
  try {
    const [users, movies, theatres, shows, bookings, revenue] = await Promise.all([
      User.countDocuments(), Movie.countDocuments({ isActive: true }), Theatre.countDocuments({ isActive: true }),
      Show.countDocuments({ status: 'scheduled' }), Booking.countDocuments({ status: 'confirmed' }),
      Booking.aggregate([{ $match: { status: 'confirmed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);
    res.json({ stats: { users, movies, theatres, shows, bookings, demoRevenue: revenue[0]?.total || 0 } });
  } catch (e) { next(e); }
});
router.get('/users', async (_req, res, next) => { try { res.json({ users: await User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(200) }); } catch (e) { next(e); } });
export default router;
