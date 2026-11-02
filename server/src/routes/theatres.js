import { Router } from 'express';
import Theatre from '../models/Theatre.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', async (_req, res, next) => { try { res.json({ theatres: await Theatre.find({ isActive: true }).sort({ city: 1, name: 1 }) }); } catch (e) { next(e); } });
router.post('/', protect, adminOnly, async (req, res, next) => { try { res.status(201).json({ theatre: await Theatre.create(req.body) }); } catch (e) { next(e); } });
router.put('/:id', protect, adminOnly, async (req, res, next) => { try { const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!theatre) return res.status(404).json({ message: 'Theatre not found.' }); res.json({ theatre }); } catch (e) { next(e); } });
export default router;
