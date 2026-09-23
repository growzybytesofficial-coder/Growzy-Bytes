// src/backend/routes/pageImage.routes.js
import express from 'express';
import {
  getPageImages,
  createOrUpdatePageImage,
  updatePageImage,
  deletePageImage,
} from '../services/dataStore.js';

const router = express.Router();

// GET all page banners
router.get('/', async (req, res) => {
  try {
    const list = await getPageImages();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch page images' });
  }
});

// POST save or update site setting / banner
router.post('/', async (req, res) => {
  try {
    const result = await createOrUpdatePageImage(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update page banner by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await updatePageImage(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE site setting / banner
router.delete('/:id', async (req, res) => {
  try {
    await deletePageImage(req.params.id);
    res.json({ message: 'Page image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete page image' });
  }
});

export default router;
