// src/backend/routes/team.routes.js
import express from 'express';
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../services/dataStore.js';

const router = express.Router();

// GET all team members
router.get('/', async (req, res) => {
  try {
    const list = await getTeam();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// POST create team member
router.post('/', async (req, res) => {
  try {
    const created = await createTeamMember(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update team member
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await updateTeamMember(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE team member
router.delete('/:id', async (req, res) => {
  try {
    await deleteTeamMember(req.params.id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete team member' });
  }
});

export default router;
