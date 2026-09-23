// src/backend/routes/blog.routes.js
import express from 'express';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../services/dataStore.js';

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const list = await getBlogs();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

// GET blog by slug or ID
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const list = await getBlogs();
    const blog = list.find((b) => String(b.id) === String(identifier) || String(b.slug) === String(identifier)) || list[0];

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
});

// POST create blog
router.post('/', async (req, res) => {
  try {
    const created = await createBlog(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update blog
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await updateBlog(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE blog
router.delete('/:id', async (req, res) => {
  try {
    await deleteBlog(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

export default router;
