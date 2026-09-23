// src/backend/services/dataStore.js
import fs from 'fs';
import path from 'path';
import { prisma, isDbConnected } from './prisma.js';
import {
  FALLBACK_SERVICES,
  FALLBACK_PROJECTS,
  FALLBACK_BLOGS,
  FALLBACK_TESTIMONIALS,
  FALLBACK_TEAM,
  FALLBACK_FAQS,
  FALLBACK_PAGE_IMAGES,
  FALLBACK_SETTINGS,
  FALLBACK_LEADS,
  FALLBACK_SUBSCRIBERS,
} from './fallbackData.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'app_store.json');

// Memory store
const store = {
  projects: JSON.parse(JSON.stringify(FALLBACK_PROJECTS)),
  services: JSON.parse(JSON.stringify(FALLBACK_SERVICES)),
  blogs: JSON.parse(JSON.stringify(FALLBACK_BLOGS)),
  team: JSON.parse(JSON.stringify(FALLBACK_TEAM)),
  testimonials: JSON.parse(JSON.stringify(FALLBACK_TESTIMONIALS)),
  pageImages: JSON.parse(JSON.stringify(FALLBACK_PAGE_IMAGES)),
  settings: JSON.parse(JSON.stringify(FALLBACK_SETTINGS)),
  faqs: JSON.parse(JSON.stringify(FALLBACK_FAQS)),
  leads: JSON.parse(JSON.stringify(FALLBACK_LEADS)),
  subscribers: JSON.parse(JSON.stringify(FALLBACK_SUBSCRIBERS)),
};

// Normalize image URLs and page keys
store.pageImages.forEach((img) => {
  if (!img.page && img.key) {
    img.page = img.key.replace('_banner', '');
  }
  if (!img.image) {
    img.image = img.imageUrl || img.value || '';
  }
  if (!img.imageUrl) {
    img.imageUrl = img.image || img.value || '';
  }
});

// Load persistent data from disk if present
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.projects) && parsed.projects.length > 0) store.projects = parsed.projects;
      if (Array.isArray(parsed.services) && parsed.services.length > 0) store.services = parsed.services;
      if (Array.isArray(parsed.blogs) && parsed.blogs.length > 0) store.blogs = parsed.blogs;
      if (Array.isArray(parsed.team) && parsed.team.length > 0) store.team = parsed.team;
      if (Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0) store.testimonials = parsed.testimonials;
      if (Array.isArray(parsed.pageImages) && parsed.pageImages.length > 0) store.pageImages = parsed.pageImages;
      if (parsed.settings && typeof parsed.settings === 'object') store.settings = { ...store.settings, ...parsed.settings };
      if (Array.isArray(parsed.faqs) && parsed.faqs.length > 0) store.faqs = parsed.faqs;
      if (Array.isArray(parsed.leads)) store.leads = parsed.leads;
      if (Array.isArray(parsed.subscribers)) store.subscribers = parsed.subscribers;
      console.log('✅ Persistent store loaded from disk');
    }
  }
} catch (e) {
  console.warn('⚠️ Could not load store from disk:', e.message);
}

// Debounced save to disk
let saveTimeout = null;
function persistStore() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      await fs.promises.writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (err) {
      console.warn('⚠️ Failed to persist store to disk:', err.message);
    }
  }, 300);
}

// Helper to make URL slug
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- PROJECTS ---
export function formatProject(p) {
  if (!p) return null;
  const techList = p.technologies
    ? p.technologies.map((t) => (typeof t === 'string' ? t : t.techName || t.technology_name)).filter(Boolean)
    : (typeof p.tech === 'string' ? p.tech.split(',').map((s) => s.trim()).filter(Boolean) : (Array.isArray(p.tech) ? p.tech : []));

  const imageList = p.images
    ? p.images.map((img) => (typeof img === 'string' ? img : img.imageUrl || img.image_url)).filter(Boolean)
    : [];

  const cover = p.coverImage || p.image || p.imageUrl || (imageList[0] || '');

  return {
    id: p.id,
    _id: p.id,
    title: p.title || '',
    slug: p.slug || slugify(p.title),
    category: p.category || 'Web Development',
    shortDesc: p.shortDesc || p.short_description || p.description || '',
    short_description: p.shortDesc || p.short_description || p.description || '',
    fullDesc: p.fullDesc || p.full_description || p.description || '',
    full_description: p.fullDesc || p.full_description || p.description || '',
    description: p.description || p.shortDesc || p.fullDesc || '',
    coverImage: cover,
    image: cover,
    imageUrl: cover,
    cover_image: cover,
    liveUrl: p.liveUrl || p.liveLink || '',
    live_url: p.liveUrl || p.liveLink || '',
    liveLink: p.liveLink || p.liveUrl || '',
    githubUrl: p.githubUrl || p.repoLink || '',
    github_url: p.githubUrl || p.repoLink || '',
    repoLink: p.repoLink || p.githubUrl || '',
    clientName: p.clientName || '',
    client_name: p.clientName || '',
    completedDate: p.completedDate || '',
    completed_date: p.completedDate || '',
    featured: Boolean(p.featured),
    displayOrder: Number(p.displayOrder || 0),
    display_order: Number(p.displayOrder || 0),
    status: p.status || 'Live',
    createdAt: p.createdAt || new Date().toISOString(),
    created_at: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
    updated_at: p.updatedAt || new Date().toISOString(),
    tech: techList.join(', '),
    technologies: techList,
    images: imageList.length ? imageList : (cover ? [cover] : []),
    gallery: imageList.length ? imageList : (cover ? [cover] : []),
  };
}

export async function getProjects(filter = {}) {
  let list = store.projects;
  if (isDbConnected()) {
    try {
      const dbList = await prisma.project.findMany({
        include: { images: true, technologies: true },
        orderBy: { displayOrder: 'asc' },
      });
      if (dbList && dbList.length > 0) list = dbList;
    } catch (e) {}
  }
  let formatted = list.map(formatProject);
  if (filter.status && filter.status !== 'All') {
    formatted = formatted.filter((p) => String(p.status).toLowerCase() === String(filter.status).toLowerCase());
  }
  if (filter.category && filter.category !== 'All') {
    formatted = formatted.filter((p) => String(p.category).toLowerCase() === String(filter.category).toLowerCase());
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    formatted = formatted.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tech.toLowerCase().includes(q)
    );
  }
  return formatted;
}

export async function getProjectByIdOrSlug(idOrSlug) {
  const all = await getProjects();
  return all.find((p) => String(p.id) === String(idOrSlug) || String(p.slug) === String(idOrSlug)) || null;
}

export async function createProject(data) {
  const newId = Date.now();
  const slug = data.slug || slugify(data.title) || `project-${newId}`;
  const cover = data.coverImage || data.imageUrl || data.image || '';

  const techArr = Array.isArray(data.tech)
    ? data.tech
    : (typeof data.tech === 'string' ? data.tech.split(',').map((s) => s.trim()).filter(Boolean) : []);

  const projectRecord = {
    id: newId,
    _id: newId,
    title: data.title || 'Untitled Project',
    slug,
    category: data.category || 'Web Development',
    shortDesc: data.shortDesc || data.description || '',
    fullDesc: data.fullDesc || data.description || '',
    description: data.description || data.shortDesc || '',
    coverImage: cover,
    image: cover,
    imageUrl: cover,
    liveUrl: data.liveUrl || data.liveLink || '',
    liveLink: data.liveLink || data.liveUrl || '',
    githubUrl: data.githubUrl || data.repoLink || '',
    repoLink: data.repoLink || data.githubUrl || '',
    clientName: data.clientName || '',
    status: data.status || 'Live',
    featured: Boolean(data.featured),
    displayOrder: Number(data.displayOrder || 0),
    technologies: techArr,
    tech: techArr.join(', '),
    images: cover ? [cover] : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.projects.unshift(projectRecord);
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.project.create({
        data: {
          title: projectRecord.title,
          slug: projectRecord.slug,
          category: projectRecord.category,
          shortDesc: projectRecord.shortDesc,
          fullDesc: projectRecord.fullDesc,
          coverImage: cover,
          liveUrl: projectRecord.liveUrl,
          githubUrl: projectRecord.githubUrl,
          clientName: projectRecord.clientName,
          status: projectRecord.status,
          featured: projectRecord.featured,
          displayOrder: projectRecord.displayOrder,
        },
      });
    } catch (e) {
      console.warn('DB create project fallback to store:', e.message);
    }
  }

  return formatProject(projectRecord);
}

export async function updateProject(id, data) {
  const targetId = Number(id) || id;
  const idx = store.projects.findIndex((p) => String(p.id) === String(targetId) || String(p._id) === String(targetId));

  const existing = idx !== -1 ? store.projects[idx] : null;
  const cover = data.coverImage || data.imageUrl || data.image || (existing ? (existing.coverImage || existing.image || existing.imageUrl) : '');

  let techArr = existing?.technologies || [];
  if (data.tech !== undefined) {
    techArr = Array.isArray(data.tech)
      ? data.tech
      : (typeof data.tech === 'string' ? data.tech.split(',').map((s) => s.trim()).filter(Boolean) : []);
  }

  const updatedRecord = {
    ...(existing || { id: targetId, _id: targetId }),
    ...data,
    id: targetId,
    _id: targetId,
    coverImage: cover,
    image: cover,
    imageUrl: cover,
    liveUrl: data.liveUrl || data.liveLink || existing?.liveUrl || '',
    liveLink: data.liveLink || data.liveUrl || existing?.liveLink || '',
    githubUrl: data.githubUrl || data.repoLink || existing?.githubUrl || '',
    repoLink: data.repoLink || data.githubUrl || existing?.repoLink || '',
    technologies: techArr,
    tech: techArr.join(', '),
    images: cover ? [cover] : (existing?.images || []),
    updatedAt: new Date().toISOString(),
  };

  if (idx !== -1) {
    store.projects[idx] = updatedRecord;
  } else {
    store.projects.unshift(updatedRecord);
  }
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.project.update({
        where: { id: Number(targetId) },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.slug && { slug: data.slug }),
          ...(data.category && { category: data.category }),
          ...(data.description && { shortDesc: data.description, fullDesc: data.description }),
          ...(cover && { coverImage: cover }),
          ...(data.liveLink !== undefined && { liveUrl: data.liveLink }),
          ...(data.repoLink !== undefined && { githubUrl: data.repoLink }),
          ...(data.status && { status: data.status }),
          ...(data.featured !== undefined && { featured: Boolean(data.featured) }),
        },
      });
    } catch (e) {
      console.warn('DB update project fallback to store:', e.message);
    }
  }

  return formatProject(updatedRecord);
}

export async function deleteProject(id) {
  const targetId = Number(id) || id;
  store.projects = store.projects.filter((p) => String(p.id) !== String(targetId) && String(p._id) !== String(targetId));
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.project.delete({ where: { id: Number(targetId) } });
    } catch (e) {}
  }
  return true;
}

// --- SERVICES ---
export function formatService(s) {
  if (!s) return null;
  const featuresArr = Array.isArray(s.features)
    ? s.features
    : (typeof s.features === 'string' ? s.features.split(',').map((f) => f.trim()).filter(Boolean) : []);

  return {
    id: s.id,
    _id: s.id,
    title: s.title || '',
    slug: s.slug || slugify(s.title),
    category: s.category || 'Development',
    shortDesc: s.shortDesc || s.description || '',
    fullDesc: s.fullDesc || s.description || s.shortDesc || '',
    description: s.shortDesc || s.fullDesc || '',
    features: featuresArr.join(', '),
    featuresList: featuresArr,
    displayOrder: Number(s.displayOrder || 0),
    status: s.status || 'published',
    featured: Boolean(s.featured),
    icon: s.icon || '',
    imageUrl: s.imageUrl || s.image || '',
    image: s.image || s.imageUrl || '',
    createdAt: s.createdAt || new Date().toISOString(),
    updatedAt: s.updatedAt || new Date().toISOString(),
  };
}

export async function getServices() {
  let list = store.services;
  if (isDbConnected()) {
    try {
      const dbList = await prisma.service.findMany({ orderBy: { displayOrder: 'asc' } });
      if (dbList && dbList.length > 0) list = dbList;
    } catch (e) {}
  }
  return list.map(formatService);
}

export async function createService(data) {
  const newId = Date.now();
  const slug = data.slug || slugify(data.title) || `service-${newId}`;
  const featuresStr = Array.isArray(data.features) ? data.features.join(',') : (data.features || '');

  const record = {
    id: newId,
    _id: newId,
    title: data.title || 'New Service',
    slug,
    category: data.category || 'Development',
    shortDesc: data.shortDesc || data.description || '',
    fullDesc: data.fullDesc || data.description || data.shortDesc || '',
    features: featuresStr,
    displayOrder: Number(data.displayOrder || 0),
    status: data.status || 'published',
    featured: Boolean(data.featured),
    icon: data.icon || '',
    image: data.image || data.imageUrl || '',
    imageUrl: data.imageUrl || data.image || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.services.unshift(record);
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.service.create({
        data: {
          title: record.title,
          slug: record.slug,
          category: record.category,
          shortDesc: record.shortDesc,
          fullDesc: record.fullDesc,
          features: record.features,
          displayOrder: record.displayOrder,
          status: record.status,
          featured: record.featured,
        },
      });
    } catch (e) {}
  }

  return formatService(record);
}

export async function updateService(id, data) {
  const targetId = Number(id) || id;
  const idx = store.services.findIndex((s) => String(s.id) === String(targetId) || String(s._id) === String(targetId));
  const existing = idx !== -1 ? store.services[idx] : null;

  const featuresStr = data.features !== undefined
    ? (Array.isArray(data.features) ? data.features.join(',') : data.features)
    : (existing?.features || '');

  const updatedRecord = {
    ...(existing || { id: targetId, _id: targetId }),
    ...data,
    id: targetId,
    _id: targetId,
    features: featuresStr,
    image: data.image || data.imageUrl || existing?.image || existing?.imageUrl || '',
    imageUrl: data.imageUrl || data.image || existing?.imageUrl || existing?.image || '',
    updatedAt: new Date().toISOString(),
  };

  if (idx !== -1) {
    store.services[idx] = updatedRecord;
  } else {
    store.services.unshift(updatedRecord);
  }
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.service.update({
        where: { id: Number(targetId) },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.slug && { slug: data.slug }),
          ...(data.category && { category: data.category }),
          ...(data.shortDesc !== undefined && { shortDesc: data.shortDesc }),
          ...(data.fullDesc !== undefined && { fullDesc: data.fullDesc }),
          ...(featuresStr !== undefined && { features: featuresStr }),
          ...(data.status && { status: data.status }),
        },
      });
    } catch (e) {}
  }

  return formatService(updatedRecord);
}

export async function deleteService(id) {
  const targetId = Number(id) || id;
  store.services = store.services.filter((s) => String(s.id) !== String(targetId) && String(s._id) !== String(targetId));
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.service.delete({ where: { id: Number(targetId) } });
    } catch (e) {}
  }
  return true;
}

// --- BLOGS ---
export function formatBlog(b) {
  if (!b) return null;
  const tagList = b.tags
    ? (Array.isArray(b.tags) ? b.tags : (typeof b.tags === 'string' ? b.tags.split(',').map((t) => t.trim()).filter(Boolean) : []))
    : [];

  const img = b.featuredImage || b.image || b.imageUrl || '';

  return {
    id: b.id,
    _id: b.id,
    title: b.title || '',
    slug: b.slug || slugify(b.title),
    category: b.category || 'General',
    content: b.content || '',
    shortDesc: b.shortDesc || (b.content ? b.content.slice(0, 160) + '...' : ''),
    featuredImage: img,
    image: img,
    imageUrl: img,
    author: b.author || 'GROWZYBYTES Team',
    featured: Boolean(b.featured),
    displayOrder: Number(b.displayOrder || 0),
    status: b.status || 'published',
    tags: tagList.join(', '),
    tagArray: tagList,
    createdAt: b.createdAt || new Date().toISOString(),
    updatedAt: b.updatedAt || new Date().toISOString(),
  };
}

export async function getBlogs() {
  let list = store.blogs;
  if (isDbConnected()) {
    try {
      const dbList = await prisma.blog.findMany({ include: { tags: true }, orderBy: { createdAt: 'desc' } });
      if (dbList && dbList.length > 0) list = dbList;
    } catch (e) {}
  }
  return list.map(formatBlog);
}

export async function createBlog(data) {
  const newId = Date.now();
  const slug = data.slug || slugify(data.title) || `blog-${newId}`;
  const img = data.featuredImage || data.imageUrl || data.image || '';
  const tagList = Array.isArray(data.tags)
    ? data.tags
    : (typeof data.tags === 'string' ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : []);

  const record = {
    id: newId,
    _id: newId,
    title: data.title || 'Untitled Blog',
    slug,
    category: data.category || 'General',
    content: data.content || '',
    featuredImage: img,
    image: img,
    imageUrl: img,
    author: data.author || 'Growzybytes Team',
    featured: Boolean(data.featured),
    displayOrder: Number(data.displayOrder || 0),
    status: data.status || 'published',
    tags: tagList.join(', '),
    tagArray: tagList,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.blogs.unshift(record);
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.blog.create({
        data: {
          title: record.title,
          slug: record.slug,
          category: record.category,
          content: record.content,
          featuredImage: img,
          author: record.author,
          featured: record.featured,
          displayOrder: record.displayOrder,
          status: record.status,
        },
      });
    } catch (e) {}
  }

  return formatBlog(record);
}

export async function updateBlog(id, data) {
  const targetId = Number(id) || id;
  const idx = store.blogs.findIndex((b) => String(b.id) === String(targetId) || String(b._id) === String(targetId));
  const existing = idx !== -1 ? store.blogs[idx] : null;

  const img = data.featuredImage || data.imageUrl || data.image || (existing ? (existing.featuredImage || existing.image || existing.imageUrl) : '');

  let tagList = existing?.tagArray || [];
  if (data.tags !== undefined) {
    tagList = Array.isArray(data.tags)
      ? data.tags
      : (typeof data.tags === 'string' ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : []);
  }

  const updatedRecord = {
    ...(existing || { id: targetId, _id: targetId }),
    ...data,
    id: targetId,
    _id: targetId,
    featuredImage: img,
    image: img,
    imageUrl: img,
    tags: tagList.join(', '),
    tagArray: tagList,
    updatedAt: new Date().toISOString(),
  };

  if (idx !== -1) {
    store.blogs[idx] = updatedRecord;
  } else {
    store.blogs.unshift(updatedRecord);
  }
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.blog.update({
        where: { id: Number(targetId) },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.slug && { slug: data.slug }),
          ...(data.category && { category: data.category }),
          ...(data.content !== undefined && { content: data.content }),
          ...(img && { featuredImage: img }),
          ...(data.author && { author: data.author }),
          ...(data.status && { status: data.status }),
        },
      });
    } catch (e) {}
  }

  return formatBlog(updatedRecord);
}

export async function deleteBlog(id) {
  const targetId = Number(id) || id;
  store.blogs = store.blogs.filter((b) => String(b.id) !== String(targetId) && String(b._id) !== String(targetId));
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.blog.delete({ where: { id: Number(targetId) } });
    } catch (e) {}
  }
  return true;
}

// --- TEAM ---
export function formatTeamMember(m) {
  if (!m) return null;
  const img = m.image || m.imageUrl || '';
  return {
    id: m.id,
    _id: m.id,
    name: m.name || '',
    role: m.role || '',
    bio: m.bio || '',
    image: img,
    imageUrl: img,
    displayOrder: Number(m.displayOrder || 0),
    createdAt: m.createdAt || new Date().toISOString(),
    updatedAt: m.updatedAt || new Date().toISOString(),
  };
}

export async function getTeam() {
  let list = store.team;
  if (isDbConnected()) {
    try {
      const dbList = await prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' } });
      if (dbList && dbList.length > 0) list = dbList;
    } catch (e) {}
  }
  return list.map(formatTeamMember);
}

export async function createTeamMember(data) {
  const newId = Date.now();
  const img = data.image || data.imageUrl || '';
  const record = {
    id: newId,
    _id: newId,
    name: data.name || 'Team Member',
    role: data.role || 'Specialist',
    bio: data.bio || '',
    image: img,
    imageUrl: img,
    displayOrder: Number(data.displayOrder || 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.team.unshift(record);
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.teamMember.create({
        data: {
          name: record.name,
          role: record.role,
          bio: record.bio,
          image: img,
          displayOrder: record.displayOrder,
        },
      });
    } catch (e) {}
  }

  return formatTeamMember(record);
}

export async function updateTeamMember(id, data) {
  const targetId = Number(id) || id;
  const idx = store.team.findIndex((m) => String(m.id) === String(targetId) || String(m._id) === String(targetId));
  const existing = idx !== -1 ? store.team[idx] : null;
  const img = data.image || data.imageUrl || (existing ? (existing.image || existing.imageUrl) : '');

  const updatedRecord = {
    ...(existing || { id: targetId, _id: targetId }),
    ...data,
    id: targetId,
    _id: targetId,
    image: img,
    imageUrl: img,
    updatedAt: new Date().toISOString(),
  };

  if (idx !== -1) {
    store.team[idx] = updatedRecord;
  } else {
    store.team.unshift(updatedRecord);
  }
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.teamMember.update({
        where: { id: Number(targetId) },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.role && { role: data.role }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(img && { image: img }),
        },
      });
    } catch (e) {}
  }

  return formatTeamMember(updatedRecord);
}

export async function deleteTeamMember(id) {
  const targetId = Number(id) || id;
  store.team = store.team.filter((m) => String(m.id) !== String(targetId) && String(m._id) !== String(targetId));
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.teamMember.delete({ where: { id: Number(targetId) } });
    } catch (e) {}
  }
  return true;
}

// --- TESTIMONIALS ---
export function formatTestimonial(t) {
  if (!t) return null;
  const avatar = t.avatar || t.image || t.imageUrl || '';
  return {
    id: t.id,
    _id: t.id,
    name: t.name || '',
    role: t.role || '',
    company: t.company || '',
    quote: t.quote || '',
    rating: Number(t.rating || 5),
    avatar,
    image: avatar,
    imageUrl: avatar,
    displayOrder: Number(t.displayOrder || 0),
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || new Date().toISOString(),
  };
}

export async function getTestimonials() {
  let list = store.testimonials;
  if (isDbConnected()) {
    try {
      const dbList = await prisma.testimonial.findMany({ orderBy: { displayOrder: 'asc' } });
      if (dbList && dbList.length > 0) list = dbList;
    } catch (e) {}
  }
  return list.map(formatTestimonial);
}

export async function createTestimonial(data) {
  const newId = Date.now();
  const avatar = data.avatar || data.image || data.imageUrl || '';
  const record = {
    id: newId,
    _id: newId,
    name: data.name || 'Client',
    company: data.company || '',
    role: data.role || '',
    quote: data.quote || '',
    rating: Number(data.rating || 5),
    avatar,
    image: avatar,
    imageUrl: avatar,
    displayOrder: Number(data.displayOrder || 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.testimonials.unshift(record);
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.testimonial.create({
        data: {
          name: record.name,
          company: record.company,
          role: record.role,
          quote: record.quote,
          rating: record.rating,
          avatar,
          displayOrder: record.displayOrder,
        },
      });
    } catch (e) {}
  }

  return formatTestimonial(record);
}

export async function updateTestimonial(id, data) {
  const targetId = Number(id) || id;
  const idx = store.testimonials.findIndex((t) => String(t.id) === String(targetId) || String(t._id) === String(targetId));
  const existing = idx !== -1 ? store.testimonials[idx] : null;
  const avatar = data.avatar || data.image || data.imageUrl || (existing ? (existing.avatar || existing.image || existing.imageUrl) : '');

  const updatedRecord = {
    ...(existing || { id: targetId, _id: targetId }),
    ...data,
    id: targetId,
    _id: targetId,
    avatar,
    image: avatar,
    imageUrl: avatar,
    updatedAt: new Date().toISOString(),
  };

  if (idx !== -1) {
    store.testimonials[idx] = updatedRecord;
  } else {
    store.testimonials.unshift(updatedRecord);
  }
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.testimonial.update({
        where: { id: Number(targetId) },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.company !== undefined && { company: data.company }),
          ...(data.role !== undefined && { role: data.role }),
          ...(data.quote !== undefined && { quote: data.quote }),
          ...(data.rating !== undefined && { rating: Number(data.rating) }),
          ...(avatar && { avatar }),
        },
      });
    } catch (e) {}
  }

  return formatTestimonial(updatedRecord);
}

export async function deleteTestimonial(id) {
  const targetId = Number(id) || id;
  store.testimonials = store.testimonials.filter((t) => String(t.id) !== String(targetId) && String(t._id) !== String(targetId));
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.testimonial.delete({ where: { id: Number(targetId) } });
    } catch (e) {}
  }
  return true;
}

// --- PAGE IMAGES / BANNERS ---
export function formatPageImage(img) {
  if (!img) return null;
  const key = img.key || img.title || 'home_banner';
  const url = img.imageUrl || img.image || img.value || '';
  const pageName = img.page || (key.endsWith('_banner') ? key.replace('_banner', '') : key);
  const formattedPage = pageName.charAt(0).toUpperCase() + pageName.slice(1).toLowerCase();

  return {
    id: img.id || img._id,
    _id: img.id || img._id,
    key,
    title: formattedPage,
    page: formattedPage,
    subtitle: img.subtitle || '',
    value: url,
    imageUrl: url,
    image: url,
    createdAt: img.createdAt || new Date().toISOString(),
    updatedAt: img.updatedAt || new Date().toISOString(),
  };
}

export async function getPageImages() {
  let list = store.pageImages;
  if (isDbConnected()) {
    try {
      const dbList = await prisma.siteSetting.findMany();
      if (dbList && dbList.length > 0) {
        list = dbList.map((s) => ({
          id: s.id,
          _id: s.id,
          key: s.key,
          title: s.key,
          value: s.value,
          imageUrl: s.value,
          image: s.value,
        }));
      }
    } catch (e) {}
  }
  return list.map(formatPageImage);
}

export async function createOrUpdatePageImage(data) {
  const title = (data.title || data.page || data.key || 'Home').trim();
  const pageLower = title.toLowerCase().replace('_banner', '');
  const key = `${pageLower}_banner`;
  const url = data.imageUrl || data.image || data.value || '';

  const idx = store.pageImages.findIndex(
    (p) => String(p.id) === String(data.id) ||
           String(p._id) === String(data.id) ||
           String(p.key).toLowerCase() === key ||
           String(p.title).toLowerCase() === title.toLowerCase() ||
           String(p.page).toLowerCase() === pageLower
  );

  let record;
  if (idx !== -1) {
    record = {
      ...store.pageImages[idx],
      key,
      title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      page: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      subtitle: data.subtitle !== undefined ? data.subtitle : store.pageImages[idx].subtitle,
      value: url || store.pageImages[idx].value,
      imageUrl: url || store.pageImages[idx].imageUrl,
      image: url || store.pageImages[idx].image,
      updatedAt: new Date().toISOString(),
    };
    store.pageImages[idx] = record;
  } else {
    const newId = Date.now();
    record = {
      id: newId,
      _id: newId,
      key,
      title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      page: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      subtitle: data.subtitle || '',
      value: url,
      imageUrl: url,
      image: url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.pageImages.unshift(record);
  }

  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: url },
        create: { key, value: url },
      });
    } catch (e) {}
  }

  return formatPageImage(record);
}

export async function updatePageImage(id, data) {
  return createOrUpdatePageImage({ ...data, id });
}

export async function deletePageImage(id) {
  const targetId = Number(id) || id;
  store.pageImages = store.pageImages.filter((p) => String(p.id) !== String(targetId) && String(p._id) !== String(targetId));
  persistStore();

  if (isDbConnected()) {
    try {
      await prisma.siteSetting.delete({ where: { id: Number(targetId) } });
    } catch (e) {}
  }
  return true;
}

// --- SETTINGS ---
export async function getSettings() {
  return { ...store.settings };
}

export async function updateSettings(data) {
  store.settings = { ...store.settings, ...data };
  persistStore();
  return { ...store.settings };
}

// --- LEADS ---
export async function getLeads() {
  return [...store.leads];
}

export async function createLead(data) {
  const newId = Date.now();
  const leadRecord = {
    id: newId,
    _id: newId,
    name: data.name || 'Lead',
    email: data.email || '',
    phone: data.phone || '',
    company: data.company || '',
    website: data.website || '',
    service: data.service || '',
    budget: data.budget || '',
    timeline: data.timeline || '',
    message: data.message || '',
    status: data.status || 'new',
    createdAt: new Date().toISOString(),
  };

  store.leads.unshift(leadRecord);
  persistStore();
  return leadRecord;
}

export async function deleteLead(id) {
  const targetId = Number(id) || id;
  store.leads = store.leads.filter((l) => String(l.id) !== String(targetId) && String(l._id) !== String(targetId));
  persistStore();
  return true;
}

// --- FAQS ---
export async function getFaqs() {
  return [...store.faqs];
}

export async function createFaq(data) {
  const newId = Date.now();
  const faq = {
    id: newId,
    _id: newId,
    question: data.question || '',
    answer: data.answer || '',
    category: data.category || 'General',
    displayOrder: Number(data.displayOrder || 0),
    createdAt: new Date().toISOString(),
  };
  store.faqs.push(faq);
  persistStore();
  return faq;
}

export async function updateFaq(id, data) {
  const targetId = Number(id) || id;
  const idx = store.faqs.findIndex((f) => String(f.id) === String(targetId));
  if (idx !== -1) {
    store.faqs[idx] = { ...store.faqs[idx], ...data, id: targetId };
    persistStore();
    return store.faqs[idx];
  }
  return null;
}

export async function deleteFaq(id) {
  const targetId = Number(id) || id;
  store.faqs = store.faqs.filter((f) => String(f.id) !== String(targetId));
  persistStore();
  return true;
}

export default {
  getProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  deleteProject,
  getServices,
  createService,
  updateService,
  deleteService,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getPageImages,
  createOrUpdatePageImage,
  updatePageImage,
  deletePageImage,
  getSettings,
  updateSettings,
  getLeads,
  createLead,
  deleteLead,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};
