// src/backend/routes/admin.routes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import dataStore from '../services/dataStore.js';

const router = express.Router();

// Apply auth middleware to all admin endpoints
router.use(protect);

// --- Settings ---
router.get('/settings', async (req, res) => {
  try {
    const settings = await dataStore.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const updated = await dataStore.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- Services CRUD ---
router.get('/services', async (req, res) => {
  try {
    const list = await dataStore.getServices();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

router.post('/services', async (req, res) => {
  try {
    const created = await dataStore.createService(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateService(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await dataStore.deleteService(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

// --- Projects CRUD ---
router.get('/projects', async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const list = await dataStore.getProjects({ search, category, status });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const created = await dataStore.createProject(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateProject(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await dataStore.deleteProject(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// --- Blogs CRUD ---
router.get('/blogs', async (req, res) => {
  try {
    const list = await dataStore.getBlogs();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const created = await dataStore.createBlog(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateBlog(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    await dataStore.deleteBlog(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

// --- Testimonials CRUD ---
router.get('/testimonials', async (req, res) => {
  try {
    const list = await dataStore.getTestimonials();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const created = await dataStore.createTestimonial(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateTestimonial(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await dataStore.deleteTestimonial(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
});

// --- Team CRUD ---
router.get('/team', async (req, res) => {
  try {
    const list = await dataStore.getTeam();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

router.post('/team', async (req, res) => {
  try {
    const created = await dataStore.createTeamMember(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/team/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateTeamMember(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    await dataStore.deleteTeamMember(req.params.id);
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete team member' });
  }
});

// --- Page Images / Banners CRUD ---
router.get('/pageImages', async (req, res) => {
  try {
    const list = await dataStore.getPageImages();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch page images' });
  }
});

router.post('/pageImages', async (req, res) => {
  try {
    const result = await dataStore.createOrUpdatePageImage(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/pageImages/:id', async (req, res) => {
  try {
    const result = await dataStore.updatePageImage(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/pageImages/:id', async (req, res) => {
  try {
    await dataStore.deletePageImage(req.params.id);
    res.json({ message: 'Page image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete page image' });
  }
});

// --- FAQs CRUD ---
router.get('/faqs', async (req, res) => {
  try {
    const list = await dataStore.getFaqs();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch faqs' });
  }
});

router.post('/faqs', async (req, res) => {
  try {
    const created = await dataStore.createFaq(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/faqs/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateFaq(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/faqs/:id', async (req, res) => {
  try {
    await dataStore.deleteFaq(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete FAQ' });
  }
});

// --- Leads ---
router.get('/leads', async (req, res) => {
  try {
    const list = await dataStore.getLeads();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

router.delete('/leads/:id', async (req, res) => {
  try {
    await dataStore.deleteLead(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete lead' });
  }
});

export default router;
