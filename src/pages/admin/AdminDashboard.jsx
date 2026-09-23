// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaProjectDiagram, FaBlog, FaUsers, FaCogs, FaSignOutAlt, FaTimes, FaQuoteLeft, 
  FaIdBadge, FaImage, FaBars, FaPlus, FaSearch, FaSyncAlt, FaTrash, FaChartBar, 
  FaLayerGroup, FaCheckCircle, FaCloudUploadAlt, FaEye, FaGlobe, FaRegImage, 
  FaEdit, FaTable, FaThLarge, FaFilter, FaChevronDown, FaClone, FaDownload,
  FaLock, FaEyeSlash, FaShieldAlt
} from 'react-icons/fa';

const PAGE_OPTIONS = ['Home', 'About', 'Services', 'Projects', 'Blog', 'Contact'];

const TAB_CONFIG = [
  { key: 'pageImages', label: 'Page Banners', shortLabel: 'Banners', icon: <FaImage />, description: 'Manage hero banners and page visuals.', color: 'from-fuchsia-500 to-pink-500' },
  { key: 'projects', label: 'Projects', shortLabel: 'Projects', icon: <FaProjectDiagram />, description: 'Portfolio case studies and live work.', color: 'from-blue-500 to-cyan-500' },
  { key: 'services', label: 'Services', shortLabel: 'Services', icon: <FaCogs />, description: 'Website services and feature content.', color: 'from-emerald-500 to-teal-500' },
  { key: 'blogs', label: 'Blogs', shortLabel: 'Blogs', icon: <FaBlog />, description: 'Articles, tags, and content management.', color: 'from-orange-500 to-amber-500' },
  { key: 'team', label: 'Team Members', shortLabel: 'Team', icon: <FaIdBadge />, description: 'Team profiles, bios, and images.', color: 'from-violet-500 to-purple-500' },
  { key: 'testimonials', label: 'Testimonials', shortLabel: 'Testimonials', icon: <FaQuoteLeft />, description: 'Client feedback and social proof.', color: 'from-rose-500 to-red-500' },
  { key: 'leads', label: 'Audit Requests', shortLabel: 'Leads', icon: <FaUsers />, description: 'Incoming leads and client requests.', color: 'from-slate-700 to-slate-900' },
];

const INITIAL_FORM = {
  pageImages: { title: 'Home', subtitle: '', imageUrl: '', image: '' },
  projects: { title: '', category: '', status: 'Live', description: '', tech: '', liveLink: '', repoLink: '', imageUrl: '', image: '' },
  blogs: { title: '', author: '', category: '', tags: '', content: '', imageUrl: '', image: '' },
  services: { title: '', category: '', shortDesc: '', features: '', imageUrl: '', image: '' },
  team: { name: '', role: '', bio: '', imageUrl: '', image: '' },
  testimonials: { name: '', company: '', quote: '', imageUrl: '', image: '' },
};

const statusOptions = ['All', 'Live', 'Beta', 'Done', 'Plugin'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null); // ✅ Naya Ref for Keyboard Shortcut
  const token = localStorage.getItem('tv_token') || localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('projects');
  const [data, setData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM.projects);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('cards');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // In-App Delete Confirmation State (bypasses iframe window.confirm blocks)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Change Password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const activeConfig = useMemo(() => TAB_CONFIG.find((tab) => tab.key === activeTab) || TAB_CONFIG[0], [activeTab]);
  const isCrudTab = useMemo(() => ['projects', 'services', 'blogs', 'team', 'testimonials', 'pageImages'].includes(activeTab), [activeTab]);
  const draftKey = `admin_draft_${activeTab}`;

  const getAuthConfig = useCallback(() => {
    if (!token) return {};
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [token]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tv_token');
    navigate('/admin');
  }, [navigate]);

  useEffect(() => {
    if (!token) navigate('/admin', { replace: true });
  }, [navigate, token]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put(
        '/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        getAuthConfig()
      );

      if (res.data?.success) {
        setSuccessMsg(res.data.message || 'Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(res.data?.message || 'Failed to update password.');
      }
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || error.message || 'Error updating password.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const getEmptyForm = useCallback(() => ({ ...(INITIAL_FORM[activeTab] || {}) }), [activeTab]);

  const resetForm = useCallback(() => {
    setFormData(getEmptyForm());
    setImageFile(null);
    setImagePreview('');
    setEditingItem(null);
  }, [getEmptyForm]);

  const clearTransientState = useCallback(() => {
    setSelectedIds([]);
    setSearchTerm('');
    setStatusFilter('All');
    setSortBy('latest');
    setDetailsItem(null);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      if (activeTab === 'leads') {
        const res = await api.get('/leads', getAuthConfig());
        setLeads(Array.isArray(res.data) ? res.data : []);
        setData([]);
      } else if (activeTab === 'projects') {
        let res;
        try {
          res = await api.get('/admin/projects', getAuthConfig());
        } catch (e) {
          res = await api.get('/projects', getAuthConfig());
        }
        const resVal = res?.data;
        let list = [];
        if (Array.isArray(resVal)) {
          list = resVal;
        } else if (resVal?.data?.projects && Array.isArray(resVal.data.projects)) {
          list = resVal.data.projects;
        } else if (resVal?.projects && Array.isArray(resVal.projects)) {
          list = resVal.projects;
        } else if (resVal?.data && Array.isArray(resVal.data)) {
          list = resVal.data;
        }
        setData(list);
        setLeads([]);
      } else {
        const res = await api.get(`/${activeTab}`, getAuthConfig());
        setData(Array.isArray(res.data) ? res.data : []);
        setLeads([]);
      }
    } catch (error) {
      setErr('Failed to load data. Please try again.');
      if (error?.response?.status === 401) handleLogout();
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [activeTab, getAuthConfig, handleLogout]);

  useEffect(() => {
    fetchData();
    clearTransientState();
    resetForm();
  }, [activeTab, fetchData, clearTransientState, resetForm]);

  useEffect(() => {
    if (!successMsg && !err) return;
    const timer = setTimeout(() => { setSuccessMsg(''); setErr(''); }, 3000);
    return () => clearTimeout(timer);
  }, [successMsg, err]);

  // ✅ NAYA: Keyboard Shortcut (Ctrl+K to Search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentItems = activeTab === 'leads' ? leads : data;

  const normalizeArrayField = (value) => {
    if (typeof value !== 'string') return value;
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  };

  const stringifyItem = (item) => Object.values(item || {}).map((val) => (Array.isArray(val) ? val.join(' ') : typeof val === 'string' ? val : '')).join(' ').toLowerCase();

  const filteredItems = useMemo(() => {
    let items = [...currentItems];
    const term = searchTerm.trim().toLowerCase();

    if (term) items = items.filter((item) => stringifyItem(item).includes(term));
    if (activeTab === 'projects' && statusFilter !== 'All') items = items.filter((item) => item?.status === statusFilter);

    if (sortBy === 'name-asc') items.sort((a, b) => (a?.title || a?.name || '').localeCompare(b?.title || b?.name || ''));
    else if (sortBy === 'name-desc') items.sort((a, b) => (b?.title || b?.name || '').localeCompare(a?.title || a?.name || ''));
    else if (sortBy === 'status' && activeTab === 'projects') items.sort((a, b) => (a?.status || '').localeCompare(b?.status || ''));
    else items.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());

    return items;
  }, [currentItems, searchTerm, sortBy, activeTab, statusFilter]);

  // ✅ Export to CSV Feature
  const handleExportCSV = () => {
    if (filteredItems.length === 0) {
      setErr('No data available to export.');
      return;
    }
    
    // Extract headers
    const headers = Object.keys(filteredItems[0]).filter(key => key !== '_id' && key !== '__v' && key !== 'image' && key !== 'imageUrl');
    
    // Format rows
    const csvRows = filteredItems.map(item => {
      return headers.map(header => {
        let val = item[header] || '';
        if (Array.isArray(val)) val = val.join('; ');
        // Escape quotes and wrap in quotes for CSV safety
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `GROWZYBYTES_${activeConfig.shortLabel}_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    setSuccessMsg('Data exported successfully!');
  };

  const stats = useMemo(() => {
    const total = currentItems.length;
    const visible = filteredItems.length;
    const imageCount = currentItems.filter((item) => item?.image || item?.imageUrl).length;
    const liveCount = activeTab === 'projects' ? currentItems.filter((item) => item?.status === 'Live').length : 0;

    return [
      { title: 'Total Records', value: total, icon: <FaChartBar />, tone: 'bg-blue-50 text-blue-700 border-blue-100' },
      { title: 'Filtered Results', value: visible, icon: <FaSearch />, tone: 'bg-violet-50 text-violet-700 border-violet-100' },
      { title: activeTab === 'projects' ? 'Live Projects' : 'Images', value: activeTab === 'projects' ? liveCount : imageCount, icon: activeTab === 'projects' ? <FaGlobe /> : <FaRegImage />, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      { title: 'Selected', value: selectedIds.length, icon: <FaCheckCircle />, tone: 'bg-amber-50 text-amber-700 border-amber-100' },
    ];
  }, [currentItems, filteredItems, activeTab, selectedIds]);

  const getItemId = (item) => item?._id || item?.id;
  const getItemTitle = (item) => item?.title || item?.name || 'Untitled';
  const getItemSubtitle = (item) => {
    if (activeTab === 'projects') return item?.category || item?.status || 'Project';
    if (activeTab === 'blogs') return item?.author || item?.category || 'Blog';
    if (activeTab === 'services') return item?.category || 'Service';
    if (activeTab === 'team') return item?.role || 'Team Member';
    if (activeTab === 'testimonials') return item?.company || 'Client';
    if (activeTab === 'pageImages') return 'Page Banner';
    if (activeTab === 'leads') return item?.company || item?.email || 'Lead';
    return 'Record';
  };

  const getItemDescription = (item) => {
    if (activeTab === 'projects') return item?.description || 'No description available.';
    if (activeTab === 'blogs') return item?.content || 'No content available.';
    if (activeTab === 'services') return item?.shortDesc || 'No description available.';
    if (activeTab === 'team') return item?.bio || 'No bio available.';
    if (activeTab === 'testimonials') return item?.quote || 'No quote available.';
    if (activeTab === 'pageImages') return `${item?.title || 'Page'} banner image`;
    if (activeTab === 'leads') return item?.message || 'No message available.';
    return '';
  };

  const getItemImage = (item) => item?.imageUrl || item?.image || item?.coverImage || item?.value || item?.avatar || '';

  const openCreateModal = () => { resetForm(); setShowModal(true); };
  const closeModal = () => { setShowModal(false); resetForm(); };
  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // 1. Read as Base64 Data URL immediately for instant preview and local reliability
    const reader = new FileReader();
    reader.onload = async (readEvent) => {
      const dataUri = readEvent.target?.result;
      if (dataUri) {
        setImagePreview(dataUri);
        setFormData((prev) => ({
          ...prev,
          imageUrl: dataUri,
          image: dataUri,
        }));
      }

      // 2. Auto-upload in background to server /uploads directory
      setUploadingImage(true);
      try {
        let uploadedUrl = '';
        // Try multipart upload without explicit Content-Type header so browser sets boundary
        try {
          const imgData = new FormData();
          imgData.append('image', file);
          const uploadRes = await api.post('/upload', imgData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          uploadedUrl = uploadRes?.data?.imageUrl || uploadRes?.data?.image || uploadRes?.data?.url;
        } catch (formDataErr) {
          console.warn('Multipart upload fallback to base64:', formDataErr?.message);
          // Fallback: Send JSON base64
          const jsonRes = await api.post(
            '/upload',
            { image: dataUri },
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          uploadedUrl = jsonRes?.data?.imageUrl || jsonRes?.data?.image || jsonRes?.data?.url;
        }

        if (uploadedUrl) {
          setImagePreview(uploadedUrl);
          setFormData((prev) => ({
            ...prev,
            imageUrl: uploadedUrl,
            image: uploadedUrl,
          }));
        }
      } catch (uploadErr) {
        console.warn('Upload error, retaining local base64 preview:', uploadErr?.message);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger single item deletion modal
  const triggerDelete = (itemOrId) => {
    let id;
    let title = 'this item';
    if (typeof itemOrId === 'object' && itemOrId !== null) {
      id = getItemId(itemOrId);
      title = getItemTitle(itemOrId);
    } else {
      id = itemOrId;
      const found = currentItems.find((x) => String(getItemId(x)) === String(id));
      if (found) title = getItemTitle(found);
    }
    setDeleteTarget({
      id,
      title,
      isBulk: false,
      ids: [id],
    });
  };

  // Trigger bulk deletion modal
  const triggerBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget({
      id: null,
      title: `${selectedIds.length} selected item(s)`,
      isBulk: true,
      ids: [...selectedIds],
    });
  };

  const handleDelete = triggerDelete;
  const handleBulkDelete = triggerBulkDelete;

  // Execute confirmed deletion (safe against iframe restrictions)
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErr('');

    try {
      if (deleteTarget.isBulk) {
        const ids = deleteTarget.ids || [];
        await Promise.all(
          ids.map(async (id) => {
            try {
              await api.delete(`/${activeTab}/${id}`, getAuthConfig());
            } catch (e) {
              await api.delete(`/admin/${activeTab}/${id}`, getAuthConfig());
            }
          })
        );
        const strIds = ids.map(String);
        setSelectedIds([]);
        setData((prev) => prev.filter((item) => !strIds.includes(String(getItemId(item)))));
        setLeads((prev) => prev.filter((lead) => !strIds.includes(String(getItemId(lead)))));
        setSuccessMsg(`${ids.length} item(s) deleted successfully.`);
      } else {
        const id = deleteTarget.id;
        try {
          await api.delete(`/${activeTab}/${id}`, getAuthConfig());
        } catch (delErr) {
          await api.delete(`/admin/${activeTab}/${id}`, getAuthConfig());
        }
        setSelectedIds((prev) => prev.filter((x) => String(x) !== String(id)));
        setData((prev) => prev.filter((item) => String(getItemId(item)) !== String(id)));
        setLeads((prev) => prev.filter((lead) => String(getItemId(lead)) !== String(id)));
        if (detailsItem && String(getItemId(detailsItem)) === String(id)) setDetailsItem(null);
        setSuccessMsg('Item deleted successfully.');
      }
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      setErr(error?.response?.data?.message || 'Error deleting item.');
      if (error?.response?.status === 401) handleLogout();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    const image = getItemImage(item);
    setEditingItem(item);

    if (activeTab === 'projects') setFormData({
      title: item?.title || '',
      category: item?.category || '',
      status: item?.status || 'Live',
      description: item?.description || item?.shortDesc || '',
      tech: Array.isArray(item?.tech) ? item.tech.join(', ') : item?.tech || '',
      liveLink: item?.liveLink || item?.liveUrl || item?.links?.live || '',
      repoLink: item?.repoLink || item?.githubUrl || item?.links?.repo || '',
      imageUrl: image,
      image: image,
    });
    else if (activeTab === 'blogs') setFormData({
      title: item?.title || '',
      author: item?.author || '',
      category: item?.category || '',
      tags: Array.isArray(item?.tags) ? item.tags.join(', ') : item?.tags || '',
      content: item?.content || '',
      imageUrl: image,
      image: image,
    });
    else if (activeTab === 'services') setFormData({
      title: item?.title || '',
      category: item?.category || '',
      shortDesc: item?.shortDesc || item?.description || '',
      features: Array.isArray(item?.features) ? item.features.join(', ') : item?.features || '',
      imageUrl: image,
      image: image,
    });
    else if (activeTab === 'team') setFormData({
      name: item?.name || '',
      role: item?.role || '',
      bio: item?.bio || '',
      imageUrl: image,
      image: image,
    });
    else if (activeTab === 'testimonials') setFormData({
      name: item?.name || '',
      company: item?.company || '',
      quote: item?.quote || '',
      imageUrl: image,
      image: image,
    });
    else if (activeTab === 'pageImages') setFormData({
      title: item?.title || item?.page || 'Home',
      subtitle: item?.subtitle || '',
      imageUrl: image,
      image: image,
    });

    setImagePreview(image);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDuplicate = async (item) => {
    try {
      const clone = { ...item };
      delete clone._id; delete clone.id; delete clone.createdAt; delete clone.updatedAt;
      if (clone.title) clone.title = `${clone.title} Copy`;
      if (clone.name) clone.name = `${clone.name} Copy`;
      try {
        await api.post(`/${activeTab}`, clone, getAuthConfig());
      } catch (err) {
        await api.post(`/admin/${activeTab}`, clone, getAuthConfig());
      }
      setSuccessMsg('Item duplicated successfully.');
      fetchData();
    } catch (error) {
      setErr('Error duplicating item.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCrudTab) return;
    try {
      let payload = { ...formData };
      let finalImageUrl =
        (formData.imageUrl && formData.imageUrl.trim()) ||
        (formData.image && formData.image.trim()) ||
        imagePreview ||
        '';

      if (imageFile && (!finalImageUrl || finalImageUrl.startsWith('blob:'))) {
        setUploadingImage(true);
        try {
          const imgData = new FormData();
          imgData.append('image', imageFile);
          const uploadRes = await api.post('/upload', imgData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          finalImageUrl = uploadRes?.data?.imageUrl || uploadRes?.data?.image || uploadRes?.data?.url || '';
        } catch (uploadErr) {
          console.warn('Multipart upload in submit failed, checking data uri fallback:', uploadErr?.message);
          if (imagePreview && imagePreview.startsWith('data:')) {
            finalImageUrl = imagePreview;
          }
        }
      } else if (!finalImageUrl && editingItem) {
        finalImageUrl = getItemImage(editingItem);
      }

      if (finalImageUrl) {
        payload.imageUrl = finalImageUrl;
        payload.image = finalImageUrl;
        payload.coverImage = finalImageUrl;
        payload.value = finalImageUrl;
        payload.avatar = finalImageUrl;
      }

      if (activeTab === 'services') payload.features = normalizeArrayField(payload.features);
      if (activeTab === 'projects') payload.tech = normalizeArrayField(payload.tech);
      if (activeTab === 'blogs') payload.tags = normalizeArrayField(payload.tags);
      if (activeTab === 'pageImages') {
        const pageName = (payload.title || 'Home').trim();
        payload.key = `${pageName.toLowerCase()}_banner`;
        payload.page = pageName;
        payload.value = finalImageUrl || payload.imageUrl || payload.image || '';
      }

      const itemId = editingItem ? getItemId(editingItem) : null;
      if (editingItem) {
        try {
          await api.put(`/${activeTab}/${itemId}`, payload, getAuthConfig());
        } catch (putErr) {
          await api.put(`/admin/${activeTab}/${itemId}`, payload, getAuthConfig());
        }
        setSuccessMsg('Item updated successfully.');
      } else {
        try {
          await api.post(`/${activeTab}`, payload, getAuthConfig());
        } catch (postErr) {
          await api.post(`/admin/${activeTab}`, payload, getAuthConfig());
        }
        setSuccessMsg('Item published successfully.');
      }

      localStorage.removeItem(draftKey);
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error saving item:', error);
      setErr(error?.response?.data?.message || 'Error saving data. Please check fields.');
      if (error?.response?.status === 401) handleLogout();
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleSelect = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  const toggleSelectAll = () => {
    const ids = filteredItems.map((item) => getItemId(item));
    setSelectedIds(ids.every((id) => selectedIds.includes(id)) ? [] : ids);
  };

  const ImageInput = () => (
    <div className="space-y-3 bg-slate-100/70 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black text-slate-700 uppercase tracking-[0.18em]">
          Item Visual / Image
        </label>
        {imagePreview && (
          <button
            type="button"
            onClick={() => {
              setImageFile(null);
              setImagePreview('');
              setFormData((prev) => ({ ...prev, imageUrl: '', image: '' }));
            }}
            className="text-xs text-rose-500 hover:text-rose-600 font-bold underline"
          >
            Remove Image
          </button>
        )}
      </div>

      {/* File Upload Box */}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-xl p-4 transition text-center cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <FaCloudUploadAlt className="text-3xl text-blue-500" />
          <span className="text-xs font-bold text-slate-700">
            {imageFile ? imageFile.name : 'Click to Upload Image from device'}
          </span>
          <span className="text-[11px] text-slate-400">PNG, JPG, WEBP, GIF up to 30MB</span>
        </div>
      </div>

      {/* Uploading Status Banner */}
      {uploadingImage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 animate-pulse">
          <FaSyncAlt className="animate-spin" />
          <span>Uploading image to server...</span>
        </div>
      )}

      {/* Direct URL input */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 mb-1">Or paste direct Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl || ''}
          placeholder="https://... or /uploads/..."
          onChange={(e) => {
            handleInputChange(e);
            setImagePreview(e.target.value);
          }}
          className={inputBase}
        />
      </div>

      {/* Live Preview */}
      {imagePreview && (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 relative group">
          <img
            src={imagePreview}
            alt="Preview"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.opacity = '0.3';
            }}
            className="w-full h-44 object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs">
            Live Preview
          </div>
        </div>
      )}
    </div>
  );

  const inputBase = 'w-full p-3.5 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-300';

  const renderFormFields = () => {
    if (activeTab === 'pageImages') {
      return (
        <div className="space-y-5">
          <select name="title" value={formData.title || ''} onChange={handleInputChange} required className={inputBase}>
            <option value="">-- Choose a Page --</option>
            {PAGE_OPTIONS.map((page) => <option key={page} value={page}>{page} Page</option>)}
          </select>
          <input type="text" name="subtitle" value={formData.subtitle || ''} placeholder="Optional Subtitle" onChange={handleInputChange} className={inputBase} />
          <ImageInput />
        </div>
      );
    }
    if (activeTab === 'projects') {
        return (
          <div className="space-y-5">
            <input type="text" name="title" value={formData.title || ''} placeholder="Project Title *" onChange={handleInputChange} required className={inputBase} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="category" value={formData.category || ''} placeholder="Category" onChange={handleInputChange} className={inputBase} />
              <select name="status" value={formData.status || 'Live'} onChange={handleInputChange} className={inputBase}>
                {statusOptions.filter((s) => s !== 'All').map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <textarea name="description" value={formData.description || ''} placeholder="Project Description *" rows="4" onChange={handleInputChange} required className={inputBase} />
            <textarea name="tech" value={formData.tech || ''} placeholder="Tech Stack (React, Node, MongoDB)" rows="3" onChange={handleInputChange} className={inputBase} />
            <ImageInput />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="liveLink" value={formData.liveLink || ''} placeholder="Live URL" onChange={handleInputChange} className={inputBase} />
              <input type="text" name="repoLink" value={formData.repoLink || ''} placeholder="Repo URL" onChange={handleInputChange} className={inputBase} />
            </div>
          </div>
        );
      }
      if (activeTab === 'blogs') {
        return (
          <div className="space-y-5">
            <input type="text" name="title" value={formData.title || ''} placeholder="Blog Title *" onChange={handleInputChange} required className={inputBase} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="author" value={formData.author || ''} placeholder="Author Name" onChange={handleInputChange} className={inputBase} />
              <input type="text" name="category" value={formData.category || ''} placeholder="Category" onChange={handleInputChange} className={inputBase} />
            </div>
            <input type="text" name="tags" value={formData.tags || ''} placeholder="Tags (SEO, Marketing, React)" onChange={handleInputChange} className={inputBase} />
            <ImageInput />
            <textarea name="content" value={formData.content || ''} placeholder="Write full blog content..." rows="7" onChange={handleInputChange} required className={inputBase} />
          </div>
        );
      }
      if (activeTab === 'services') {
        return (
          <div className="space-y-5">
            <input type="text" name="title" value={formData.title || ''} placeholder="Service Name *" onChange={handleInputChange} required className={inputBase} />
            <input type="text" name="category" value={formData.category || ''} placeholder="Category" onChange={handleInputChange} className={inputBase} />
            <textarea name="shortDesc" value={formData.shortDesc || ''} placeholder="Short Description *" rows="3" onChange={handleInputChange} required className={inputBase} />
            <textarea name="features" value={formData.features || ''} placeholder="Features (Fast, Responsive, SEO)" rows="3" onChange={handleInputChange} className={inputBase} />
            <ImageInput />
          </div>
        );
      }
      if (activeTab === 'team') {
        return (
          <div className="space-y-5">
            <input type="text" name="name" value={formData.name || ''} placeholder="Member Name *" onChange={handleInputChange} required className={inputBase} />
            <input type="text" name="role" value={formData.role || ''} placeholder="Role *" onChange={handleInputChange} required className={inputBase} />
            <ImageInput />
            <textarea name="bio" value={formData.bio || ''} placeholder="Short Bio" rows="4" onChange={handleInputChange} className={inputBase} />
          </div>
        );
      }
      if (activeTab === 'testimonials') {
        return (
          <div className="space-y-5">
            <input type="text" name="name" value={formData.name || ''} placeholder="Client Name *" onChange={handleInputChange} required className={inputBase} />
            <input type="text" name="company" value={formData.company || ''} placeholder="Company / Role" onChange={handleInputChange} className={inputBase} />
            <textarea name="quote" value={formData.quote || ''} placeholder="Client Feedback *" rows="5" onChange={handleInputChange} required className={inputBase} />
            <ImageInput />
          </div>
        );
      }
    return null;
  };

  const NavButton = ({ tab }) => {
    const isActive = activeTab === tab.key;
    return (
      <button onClick={() => { setActiveTab(tab.key); setMobileSidebarOpen(false); }} className={`w-full flex items-start gap-3 p-4 rounded-2xl transition-all duration-300 text-left border relative overflow-hidden ${isActive ? 'bg-white text-slate-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'text-slate-300 border-white/5 hover:bg-white/5 hover:text-white hover:border-white/10'}`}>
        {isActive && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white z-0 rounded-2xl" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
        <div className={`relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-inner transition-transform duration-300 ${isActive ? `bg-gradient-to-br ${tab.color} text-white scale-110` : 'bg-white/10 text-slate-200'}`}>
          {tab.icon}
        </div>
        <div className="relative z-10">
          <div className={`font-bold transition-colors ${isActive ? 'text-slate-900' : ''}`}>{tab.label}</div>
          <div className={`text-[11px] mt-1 leading-tight transition-colors ${isActive ? 'text-slate-500' : 'text-slate-500'}`}>{tab.description}</div>
        </div>
      </button>
    );
  };

  const renderCardActions = (item) => {
    return (
      <div className="flex items-center gap-2 mt-5 border-t border-slate-100 pt-4">
        <button onClick={() => setDetailsItem(item)} className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-700 font-bold hover:bg-slate-900 hover:text-white transition-colors inline-flex items-center justify-center text-sm">
          <FaEye className="mr-2" /> View
        </button>
        {isCrudTab && (
          <>
            <button onClick={() => handleEdit(item)} className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center" title="Edit"><FaEdit /></button>
            <button onClick={() => handleDuplicate(item)} className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white transition-colors flex items-center justify-center" title="Duplicate"><FaClone /></button>
          </>
        )}
        {(isCrudTab || activeTab === 'leads') && (
          <button onClick={() => triggerDelete(item)} className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center" title="Delete"><FaTrash /></button>
        )}
      </div>
    );
  };

  // ✅ NAYA: Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 animate-pulse">
      <div className="h-48 bg-slate-200 rounded-2xl mb-4"></div>
      <div className="h-6 bg-slate-200 rounded-full w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded-full w-1/4 mb-4"></div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-slate-200 rounded-full w-full"></div>
        <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
        <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
        <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );

  const renderCards = () => (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <AnimatePresence>
        {filteredItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-full py-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 text-slate-300 text-4xl mb-5 shadow-inner"><FaLayerGroup /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No data found</h3>
            <p className="text-slate-500 font-medium">Try changing search, filter, or add a new record.</p>
          </motion.div>
        ) : (
          filteredItems.map((item) => {
            const id = getItemId(item);
            return (
              <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} key={id} className={`group flex flex-col rounded-[1.75rem] border overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${selectedIds.includes(id) ? 'border-blue-400 ring-4 ring-blue-50 bg-blue-50/10' : 'border-slate-200 bg-white'}`}>
                <div className="relative h-48 bg-slate-100 shrink-0 overflow-hidden">
                  {getItemImage(item) ? (
                    <img
                      src={getItemImage(item)}
                      alt={getItemTitle(item)}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.empty-card-visual');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : null}
                  <div
                    className="empty-card-visual w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center"
                    style={{ display: getItemImage(item) ? 'none' : 'flex' }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl text-blue-600 font-black mb-1">
                      {getItemTitle(item)?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">No Image Uploaded</span>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        handleEdit(item);
                      }}
                      className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1 rounded-lg shadow-xs transition hover:shadow"
                    >
                      + Add Image
                    </button>
                  </div>
                  <button onClick={() => toggleSelect(id)} className={`absolute top-4 left-4 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${selectedIds.includes(id) ? 'bg-blue-600 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'}`}>
                    {selectedIds.includes(id) ? 'Selected' : 'Select'}
                  </button>
                  {activeTab === 'projects' && item?.status && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-500 text-white shadow-lg text-[10px] font-black uppercase tracking-widest">
                      {item.status}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1 bg-white">
                  <h3 className="text-xl font-black text-slate-900 line-clamp-1">{getItemTitle(item)}</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1 mb-3">{getItemSubtitle(item)}</p>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-1">{getItemDescription(item)}</p>
                  {renderCardActions(item)}
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderTable = () => (
    <div className="overflow-x-auto rounded-[1.75rem] border border-slate-200 shadow-sm bg-white">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-4 px-6 text-slate-500 uppercase text-[10px] font-black tracking-widest w-12"><input type="checkbox" checked={filteredItems.length > 0 && filteredItems.every((item) => selectedIds.includes(getItemId(item)))} onChange={toggleSelectAll} className="rounded text-blue-600 focus:ring-blue-500" /></th>
            <th className="py-4 px-6 text-slate-500 uppercase text-[10px] font-black tracking-widest w-24">Preview</th>
            <th className="py-4 px-6 text-slate-500 uppercase text-[10px] font-black tracking-widest">Details</th>
            <th className="py-4 px-6 text-slate-500 uppercase text-[10px] font-black tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <tr><td colSpan="4" className="py-16 text-center text-slate-400 font-bold">No data found.</td></tr>
          ) : (
            filteredItems.map((item) => {
              const id = getItemId(item);
              return (
                <tr key={id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="py-4 px-6"><input type="checkbox" checked={selectedIds.includes(id)} onChange={() => toggleSelect(id)} className="rounded text-blue-600 focus:ring-blue-500" /></td>
                  <td className="py-4 px-6">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      {getItemImage(item) ? <img src={getItemImage(item)} alt="preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FaRegImage /></div>}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-base">{getItemTitle(item)}</div>
                    <div className="text-xs text-blue-600 font-semibold mt-0.5">{getItemSubtitle(item)}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setDetailsItem(item)} className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition flex items-center justify-center" title="View"><FaEye /></button>
                      {isCrudTab && (
                        <>
                          <button onClick={() => handleEdit(item)} className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center" title="Edit"><FaEdit /></button>
                          <button onClick={() => handleDuplicate(item)} className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white transition flex items-center justify-center" title="Duplicate"><FaClone /></button>
                        </>
                      )}
                      {(isCrudTab || activeTab === 'leads') && (
                        <button onClick={() => triggerDelete(item)} className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition flex items-center justify-center" title="Delete"><FaTrash /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="h-screen bg-[#f1f5f9] font-sans selection:bg-blue-600 selection:text-white overflow-hidden flex flex-col relative">
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {(successMsg || err) && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full px-4 pointer-events-none">
            <div className={`pointer-events-auto flex items-center px-6 py-4 rounded-full shadow-2xl backdrop-blur-md font-bold text-sm border ${successMsg ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-red-500/90 border-red-400 text-white'}`}>
              {successMsg ? <FaCheckCircle className="mr-3 text-lg" /> : <FaTimes className="mr-3 text-lg" />}
              {successMsg || err}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Overlay */}
        <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] xl:w-[320px] bg-[#0A0F1C] text-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6 xl:p-8 border-b border-white/5 flex items-center justify-between shrink-0">
            <div>
              <div className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">GROWZYBYTES</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mt-1">Admin OS</div>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition text-slate-300"><FaTimes /></button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
            {TAB_CONFIG.map((tab) => <NavButton key={tab.key} tab={tab} />)}
          </nav>
          <div className="p-6 shrink-0 border-t border-white/5 bg-[#0A0F1C] space-y-2">
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordError('');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="flex w-full items-center justify-center p-3.5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-2xl transition-all font-semibold text-sm border border-white/10 shadow-sm"
            >
              <FaLock className="mr-2 text-blue-400" /> Change Password
            </button>
            <button onClick={handleLogout} className="flex w-full items-center justify-center p-3.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-bold border border-red-500/20 shadow-sm"><FaSignOutAlt className="mr-2" /> End Session</button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#f4f7fa] relative">
          
          {/* Header */}
          <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-5 sticky top-0 z-30 shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 hover:bg-slate-50 transition"><FaBars /></button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{activeConfig.label}</h1>
                  <p className="hidden md:block text-slate-500 text-sm mt-0.5 font-medium">Overview and management for {activeConfig.label.toLowerCase()}.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 custom-scrollbar-hidden">
                <button onClick={fetchData} className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm" title="Refresh"><FaSyncAlt /></button>
                
                {/* ✅ NAYA: Export to CSV Button */}
                <button onClick={handleExportCSV} className="shrink-0 inline-flex items-center justify-center px-4 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition shadow-sm" title="Export to CSV">
                  <FaDownload className="md:mr-2 text-blue-600" />
                  <span className="hidden md:inline">Export CSV</span>
                </button>

                {/* ✅ NAYA: Change Password Button */}
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setPasswordError('');
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="shrink-0 inline-flex items-center justify-center px-4 h-12 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold transition shadow-sm hover:border-blue-300"
                  title="Change Admin Password"
                >
                  <FaLock className="md:mr-2 text-blue-600" />
                  <span className="hidden md:inline">Change Password</span>
                </button>

                {selectedIds.length > 0 && (
                  <button onClick={handleBulkDelete} className="shrink-0 inline-flex items-center justify-center px-4 h-12 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition shadow-sm"><FaTrash className="md:mr-2" /><span className="hidden md:inline">Delete ({selectedIds.length})</span></button>
                )}
                {isCrudTab && (
                  <button onClick={openCreateModal} className="shrink-0 inline-flex items-center justify-center bg-slate-900 text-white px-6 h-12 rounded-2xl shadow-lg hover:bg-blue-600 transition font-bold tracking-wide"><FaPlus className="mr-2" />Create New</button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 custom-scrollbar relative">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={stat.title} className={`rounded-[2rem] border p-5 md:p-6 ${stat.tone} bg-white shadow-sm relative overflow-hidden group`}>
                  <div className="absolute -right-4 -top-4 opacity-10 text-8xl group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                  <div className="relative z-10">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black opacity-70 mb-2">{stat.title}</p>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter">{stat.value}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-3 mb-6 flex flex-col xl:flex-row gap-3">
              <div className="relative flex-1 group">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  ref={searchInputRef} // ✅ Ref added for Ctrl+K
                  type="text" 
                  placeholder={`Search ${activeConfig.shortLabel}... (Press Ctrl+K)`} 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-700" 
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {activeTab === 'projects' && (
                  <div className="relative shrink-0">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-6 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-transparent hover:bg-slate-100 focus:bg-white focus:border-blue-500 text-slate-700 font-bold appearance-none outline-none transition-all cursor-pointer">
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                )}
                <div className="relative shrink-0 flex-1 xl:flex-none">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-6 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-transparent hover:bg-slate-100 focus:bg-white focus:border-blue-500 text-slate-700 font-bold appearance-none outline-none transition-all cursor-pointer">
                    <option value="latest">Sort: Latest</option>
                    <option value="name-asc">Sort: A-Z</option>
                    <option value="name-desc">Sort: Z-A</option>
                    {activeTab === 'projects' && <option value="status">Sort: Status</option>}
                  </select>
                  <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                </div>
                <div className="inline-flex p-1.5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
                  <button onClick={() => setViewMode('cards')} className={`px-5 py-2 rounded-xl font-bold inline-flex items-center text-sm transition-all ${viewMode === 'cards' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}><FaThLarge className="md:mr-2" /><span className="hidden md:inline">Cards</span></button>
                  <button onClick={() => setViewMode('table')} className={`px-5 py-2 rounded-xl font-bold inline-flex items-center text-sm transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}><FaTable className="md:mr-2" /><span className="hidden md:inline">Table</span></button>
                </div>
              </div>
            </div>

            {/* Content Area with Skeletons */}
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
                 {/* Show 6 skeletons while loading */}
                 {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
               </div>
            ) : viewMode === 'cards' ? renderCards() : renderTable()}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && isCrudTab && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[80] p-4 md:p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-full overflow-hidden flex flex-col border border-slate-200 ring-1 ring-white/50">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{editingItem ? 'Edit Details' : 'New Record'}</h3>
                  <p className="text-blue-600 text-[10px] uppercase tracking-widest font-black mt-1">{activeConfig.label}</p>
                </div>
                <button onClick={closeModal} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 flex items-center justify-center transition-all shadow-sm"><FaTimes className="text-xl" /></button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                <form id="crud-form" onSubmit={handleSubmit} className="space-y-2">
                  {renderFormFields()}
                </form>
              </div>
              <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-4">
                <button type="button" onClick={() => { setFormData(getEmptyForm()); setImageFile(null); setImagePreview(''); localStorage.removeItem(draftKey); }} className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-100 transition shadow-sm text-lg">Reset</button>
                <button type="submit" form="crud-form" disabled={uploadingImage} className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 disabled:bg-slate-400 disabled:shadow-none inline-flex items-center justify-center transition-all text-lg tracking-wide">
                  {uploadingImage ? <div className="animate-spin h-6 w-6 border-t-2 border-white rounded-full mr-3"></div> : <FaCloudUploadAlt className="mr-3 text-2xl" />}
                  {uploadingImage ? 'Processing...' : editingItem ? 'Save Changes' : 'Publish Live'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Slide-over */}
      <AnimatePresence>
        {detailsItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[85]" onClick={() => setDetailsItem(null)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[90] flex flex-col border-l border-slate-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="text-2xl font-black text-slate-900 truncate pr-4">Details</h3>
                <button onClick={() => setDetailsItem(null)} className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition shadow-sm"><FaTimes /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
                <div className="rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-sm relative">
                  {getItemImage(detailsItem) ? <img src={getItemImage(detailsItem)} alt="Detail" className="w-full h-64 object-cover" /> : <div className="w-full h-64 flex items-center justify-center text-slate-300 text-5xl"><FaRegImage /></div>}
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-lg">{activeConfig.shortLabel}</div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{getItemTitle(detailsItem)}</h2>
                  <p className="text-blue-600 font-bold tracking-wide mt-2 bg-blue-50 inline-block px-3 py-1 rounded-lg">{getItemSubtitle(detailsItem)}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Content</h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{getItemDescription(detailsItem)}</p>
                </div>
              </div>
              <div className="p-6 bg-white border-t border-slate-100 shrink-0 flex gap-3">
                 {isCrudTab && (
                    <button onClick={() => { setDetailsItem(null); handleEdit(detailsItem); }} className="flex-1 bg-blue-50 text-blue-700 font-bold py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition inline-flex items-center justify-center text-lg"><FaEdit className="mr-2" /> Edit</button>
                 )}
                <button onClick={() => triggerDelete(detailsItem)} className="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-600 hover:text-white transition inline-flex items-center justify-center text-lg"><FaTrash className="mr-2" /> Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[95] p-4 md:p-6"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200 ring-1 ring-white/50"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xl shadow-sm">
                    <FaLock />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Change Password</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">Update your admin panel credentials</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 flex items-center justify-center transition-all shadow-sm"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-8 space-y-5 bg-slate-50/50">
                {passwordError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
                    <FaTimes className="shrink-0 text-red-500" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                    Current Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password if known"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full p-3.5 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full p-3.5 pr-12 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Re-type new password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3.5 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                  />
                </div>

                {passwordData.newPassword && passwordData.confirmPassword && (
                  <div className="text-xs font-bold flex items-center gap-2">
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <FaCheckCircle /> Passwords match
                      </span>
                    ) : (
                      <span className="text-amber-600">Passwords do not match yet</span>
                    )}
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-100 transition shadow-sm text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="flex-[2] bg-blue-600 text-white font-black py-3.5 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 disabled:bg-slate-300 disabled:shadow-none inline-flex items-center justify-center transition-all text-sm tracking-wide"
                  >
                    {passwordLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      'Save New Password'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ In-App Delete Confirmation Modal (Iframe Safe) */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">
                <FaTrash />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {deleteTarget.isBulk ? `Delete ${deleteTarget.ids?.length} Items?` : 'Delete Item?'}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Are you sure you want to permanently delete{' '}
                <span className="font-bold text-slate-800">
                  {deleteTarget.title ? `"${deleteTarget.title}"` : 'this record'}
                </span>
                ? This action cannot be reversed.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3.5 px-5 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 shadow-lg shadow-red-600/30 transition text-sm inline-flex items-center justify-center"
                >
                  {isDeleting ? (
                    <span className="inline-flex items-center gap-2">
                      <FaSyncAlt className="animate-spin" /> Deleting...
                    </span>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;