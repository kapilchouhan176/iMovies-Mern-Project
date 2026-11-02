import { Router } from 'express';
import crypto from 'node:crypto';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.get('/mine', async (req, res, next) => {
  try { const bookings = await Booking.find({ user: req.user._id }).populate({ path: 'show', populate: [{ path: 'movie' }, { path: 'theatre' }] }).sort({ createdAt: -1 }); res.json({ bookings }); } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const showId = req.body.showId;
    const seats = [...new Set((Array.isArray(req.body.seats) ? req.body.seats : []).map(s => String(s).trim()))];
    if (!showId || seats.length < 1 || seats.length > 8 || seats.some(s => !/^[A-F](?:[1-9]|10)$/.test(s)))
      return res.status(400).json({ message: 'Select 1–8 valid seats (A1–F10).' });
    const show = await Show.findOne({ _id: showId, status: 'scheduled', startsAt: { $gt: new Date() } });
    if (!show) return res.status(404).json({ message: 'Show not found or has already started.' });
    const validSeats = seats.every(s => Number(s.slice(1)) <= 10);
    if (!validSeats) return res.status(400).json({ message: 'Invalid seat.' });
    const updated = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: seats } },
      { $addToSet: { bookedSeats: { $each: seats } } },
      { new: true }
    );
    if (!updated) return res.status(409).json({ message: 'One or more seats were just booked. Refresh and choose again.' });
    try {
      const booking = await Booking.create({
        bookingCode: `IM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        user: req.user._id, show: show._id, seats, totalAmount: seats.length * show.price,
        status: 'confirmed', paymentStatus: 'demo-paid'
      });
      res.status(201).json({ booking, message: 'Demo booking confirmed. No real payment was charged.' });
    } catch (error) {
      await Show.updateOne({ _id: showId }, { $pull: { bookedSeats: { $in: seats } } });
      throw error;
    }
  } catch (e) { next(e); }
});
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id, status: 'confirmed' });
    if (!booking) return res.status(404).json({ message: 'Active booking not found.' });
    const show = await Show.findById(booking.show);
    if (!show || show.startsAt <= new Date()) return res.status(400).json({ message: 'Past or started shows cannot be cancelled.' });
    booking.status = 'cancelled'; booking.paymentStatus = 'refunded-demo';
    await booking.save();
    await Show.updateOne({ _id: show._id }, { $pull: { bookedSeats: { $in: booking.seats } } });
    res.json({ booking, message: 'Demo booking cancelled.' });
  } catch (e) { next(e); }
});
export default router;
