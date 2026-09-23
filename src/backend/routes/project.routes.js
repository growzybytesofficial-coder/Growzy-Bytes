// src/backend/routes/project.routes.js
import express from 'express';
import {
  getProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  deleteProject,
} from '../services/dataStore.js';

const router = express.Router();

// GET /api/projects - All projects with optional pagination & filters
router.get('/', async (req, res) => {
  try {
    const { category, search, status, page, limit } = req.query;
    let list = await getProjects({ category, search, status });

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10);
    const totalCount = list.length;

    let paginated = list;
    if (limitNum && limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      paginated = list.slice(skip, skip + limitNum);
    }

    const activeLimit = limitNum || (totalCount > 0 ? totalCount : 12);
    const totalPages = Math.ceil(totalCount / activeLimit) || 1;

    // Both top-level array and nested format for full frontend compatibility
    res.json({
      success: true,
      projects: paginated,
      data: {
        projects: paginated,
        pagination: {
          page: pageNum,
          limit: activeLimit,
          total: totalCount,
          totalPages,
        },
      },
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:slug - Single project by id or slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await getProjectByIdOrSlug(slug);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project, project });
  } catch (err) {
    console.error('Error fetching single project:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create a new project (Admin)
router.post('/', async (req, res) => {
  try {
    const created = await createProject(req.body);
    res.status(201).json({ success: true, message: 'Project created successfully', data: created, project: created });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ success: false, message: err.message || 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update existing project (Admin)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await updateProject(id, req.body);
    res.status(200).json({ success: true, message: 'Project updated successfully', data: updated, project: updated });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(400).json({ success: false, message: err.message || 'Failed to update project' });
  }
});

// PATCH /api/projects/:id/status - Toggle status
router.patch('/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const updated = await updateProject(id, { status });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    await deleteProject(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

export default router;
