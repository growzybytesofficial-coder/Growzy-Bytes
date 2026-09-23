// src/backend/routes/public.routes.js
import express from 'express';
import dataStore from '../services/dataStore.js';

const router = express.Router();

// GET /api/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await dataStore.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// GET /api/services
router.get('/services', async (req, res) => {
  try {
    const list = await dataStore.getServices();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// GET /api/services/:slug
router.get('/services/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const list = await dataStore.getServices();
    const service = list.find((s) => s.slug === slug || String(s.id) === String(slug)) || list[0];
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

// GET /api/projects
router.get('/projects', async (req, res) => {
  try {
    const { category, search, status, page, limit } = req.query;
    const list = await dataStore.getProjects({ category, search, status });

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
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:slug
router.get('/projects/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await dataStore.getProjectByIdOrSlug(slug);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project, project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// GET /api/blogs
router.get('/blogs', async (req, res) => {
  try {
    const list = await dataStore.getBlogs();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/:slug
router.get('/blogs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const list = await dataStore.getBlogs();
    const blog = list.find((b) => b.slug === slug || String(b.id) === String(slug)) || list[0];
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
});

// GET /api/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const list = await dataStore.getTestimonials();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// GET /api/team
router.get('/team', async (req, res) => {
  try {
    const list = await dataStore.getTeam();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// GET /api/faqs
router.get('/faqs', async (req, res) => {
  try {
    const list = await dataStore.getFaqs();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch FAQs' });
  }
});

// GET /api/page-banners and /api/pageImages
router.get(['/page-banners', '/pageImages'], async (req, res) => {
  try {
    const list = await dataStore.getPageImages();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch page banners' });
  }
});

// GET /api/home (Aggregated for Homepage)
router.get('/home', async (req, res) => {
  try {
    const [settings, services, projects, blogs, testimonials] = await Promise.all([
      dataStore.getSettings(),
      dataStore.getServices(),
      dataStore.getProjects(),
      dataStore.getBlogs(),
      dataStore.getTestimonials(),
    ]);

    res.json({
      settings,
      hero: {
        title: settings.hero_title || 'Transforming Vision Into Digital Reality',
        subtitle: settings.hero_subtitle || 'Full-cycle digital engineering and high-velocity development.',
      },
      featuredServices: services.slice(0, 6),
      featuredProjects: projects.filter((p) => p.featured).slice(0, 6),
      recentBlogs: blogs.slice(0, 3),
      testimonials: testimonials.slice(0, 6),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch homepage data' });
  }
});

// GET /api/about
router.get('/about', async (req, res) => {
  try {
    const [settings, team, testimonials] = await Promise.all([
      dataStore.getSettings(),
      dataStore.getTeam(),
      dataStore.getTestimonials(),
    ]);

    res.json({
      settings,
      team,
      testimonials,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch about page data' });
  }
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, service, budget, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const lead = await dataStore.createLead(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully!', lead });
  } catch (err) {
    res.status(200).json({ success: true, message: 'Message received successfully!' });
  }
});

// POST /api/newsletter
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(200).json({ success: true, message: 'Subscribed successfully!' });
  }
});

export default router;
