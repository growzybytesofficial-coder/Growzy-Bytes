// src/backend/routes/services.routes.js
import express from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../services/dataStore.js';

const router = express.Router();

// GET all services
router.get('/', async (req, res) => {
  try {
    const list = await getServices();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// GET single service
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const list = await getServices();
    const service = list.find((s) => String(s.id) === String(identifier) || String(s.slug) === String(identifier)) || list[0];

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

// POST create service
router.post('/', async (req, res) => {
  try {
    const created = await createService(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update service
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await updateService(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    await deleteService(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

export default router;
