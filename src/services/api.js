// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('tv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Public API methods
export const getSettings = () => api.get('/settings').then((res) => res.data);
export const getServices = () => api.get('/services').then((res) => res.data);
export const getServiceBySlug = (slug) => api.get(`/services/${slug}`).then((res) => res.data);
export const getProjects = (params = {}) => api.get('/projects', { params }).then((res) => res.data);
export const getProjectBySlug = (slug) => api.get(`/projects/${slug}`).then((res) => res.data);
export const getBlogs = () => api.get('/blogs').then((res) => res.data);
export const getBlogBySlug = (slug) => api.get(`/blogs/${slug}`).then((res) => res.data);
export const getTestimonials = () => api.get('/testimonials').then((res) => res.data);
export const getTeam = () => api.get('/team').then((res) => res.data);
export const getFaqs = () => api.get('/faqs').then((res) => res.data);

export const submitContact = (data) => api.post('/contact', data).then((res) => res.data);
export const submitNewsletter = (email) => api.post('/newsletter', { email }).then((res) => res.data);

// Auth
export const loginAdmin = (credentials) => api.post('/auth/login', credentials).then((res) => res.data);
export const getAdminProfile = () => api.get('/auth/me').then((res) => res.data);

// Admin API methods
export const getAdminSettings = () => api.get('/admin/settings').then((res) => res.data);
export const updateAdminSettings = (data) => api.put('/admin/settings', data).then((res) => res.data);

export const getAdminServices = () => api.get('/admin/services').then((res) => res.data);
export const createAdminService = (data) => api.post('/admin/services', data).then((res) => res.data);
export const updateAdminService = (id, data) => api.put(`/admin/services/${id}`, data).then((res) => res.data);
export const deleteAdminService = (id) => api.delete(`/admin/services/${id}`).then((res) => res.data);

export const getAdminProjects = (params = {}) => api.get('/admin/projects', { params }).then((res) => res.data);
export const getAdminProjectById = (id) => api.get(`/admin/projects/${id}`).then((res) => res.data);
export const createAdminProject = (data) => api.post('/admin/projects', data).then((res) => res.data);
export const updateAdminProject = (id, data) => api.put(`/admin/projects/${id}`, data).then((res) => res.data);
export const updateAdminProjectStatus = (id, status) => api.patch(`/admin/projects/${id}/status`, { status }).then((res) => res.data);
export const reorderAdminProjects = (items) => api.patch('/admin/projects/reorder', { items }).then((res) => res.data);
export const deleteAdminProject = (id) => api.delete(`/admin/projects/${id}`).then((res) => res.data);

export const getAdminBlogs = () => api.get('/admin/blogs').then((res) => res.data);
export const createAdminBlog = (data) => api.post('/admin/blogs', data).then((res) => res.data);
export const updateAdminBlog = (id, data) => api.put(`/admin/blogs/${id}`, data).then((res) => res.data);
export const deleteAdminBlog = (id) => api.delete(`/admin/blogs/${id}`).then((res) => res.data);

export const getAdminTestimonials = () => api.get('/admin/testimonials').then((res) => res.data);
export const createAdminTestimonial = (data) => api.post('/admin/testimonials', data).then((res) => res.data);
export const updateAdminTestimonial = (id, data) => api.put(`/admin/testimonials/${id}`, data).then((res) => res.data);
export const deleteAdminTestimonial = (id) => api.delete(`/admin/testimonials/${id}`).then((res) => res.data);

export const getAdminTeam = () => api.get('/admin/team').then((res) => res.data);
export const createAdminTeamMember = (data) => api.post('/admin/team', data).then((res) => res.data);
export const updateAdminTeamMember = (id, data) => api.put(`/admin/team/${id}`, data).then((res) => res.data);
export const deleteAdminTeamMember = (id) => api.delete(`/admin/team/${id}`).then((res) => res.data);

export const getAdminFaqs = () => api.get('/admin/faqs').then((res) => res.data);
export const createAdminFaq = (data) => api.post('/admin/faqs', data).then((res) => res.data);
export const updateAdminFaq = (id, data) => api.put(`/admin/faqs/${id}`, data).then((res) => res.data);
export const deleteAdminFaq = (id) => api.delete(`/admin/faqs/${id}`).then((res) => res.data);

export const getAdminLeads = () => api.get('/admin/leads').then((res) => res.data);
export const deleteAdminLead = (id) => api.delete(`/admin/leads/${id}`).then((res) => res.data);

export const getAdminNewsletter = () => api.get('/admin/newsletter').then((res) => res.data);
export const deleteAdminNewsletter = (id) => api.delete(`/admin/newsletter/${id}`).then((res) => res.data);

export const uploadFile = (formData) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);

export default api;
