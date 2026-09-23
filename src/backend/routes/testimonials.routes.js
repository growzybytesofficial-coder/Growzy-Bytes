// src/backend/routes/testimonials.routes.js
import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../services/dataStore.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const list = await getTestimonials();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// POST create testimonial
router.post('/', async (req, res) => {
  try {
    const created = await createTestimonial(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update testimonial
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await updateTestimonial(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE testimonial
router.delete('/:id', async (req, res) => {
  try {
    await deleteTestimonial(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
});

export default router;
