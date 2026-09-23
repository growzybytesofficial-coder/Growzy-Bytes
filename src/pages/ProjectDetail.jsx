import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaExternalLinkAlt,
  FaGithub,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaGlobe,
  FaCode,
  FaCheckCircle,
  FaLayerGroup,
  FaFolder,
} from 'react-icons/fa';
import { getProjectBySlug } from '../services/api';

const fallbackHeroImage =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProjectBySlug(slug);
        const data = res?.data || res;
        if (data && (data.id || data.slug || data.title)) {
          setProject(data);
          const images = data.images || [];
          const primaryImage = data.coverImage || data.image || (images[0] || fallbackHeroImage);
          setActiveImage(primaryImage);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error loading project detail:', err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-semibold text-lg">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 py-32 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-black text-blue-600 mb-4">Project Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          The requested project might have been removed, renamed, or is currently unavailable.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-full transition shadow-lg"
        >
          <FaArrowLeft className="mr-2" /> Back to Projects
        </Link>
      </div>
    );
  }

  const techList = Array.isArray(project.technologies)
    ? project.technologies.map((t) => (typeof t === 'string' ? t : t.techName || t.technology_name))
    : typeof project.tech === 'string'
    ? project.tech.split(',').map((t) => t.trim())
    : Array.isArray(project.tech)
    ? project.tech
    : [];

  const imageList = Array.isArray(project.images)
    ? project.images.map((img) => (typeof img === 'string' ? img : img.imageUrl || img.image_url))
    : [];

  const liveUrl = project.liveUrl || project.live_url || project.liveLink || '';
  const githubUrl = project.githubUrl || project.github_url || project.repoLink || '';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Header Banner */}
      <section className="relative bg-gray-900 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-blue-950 to-gray-900 opacity-95"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center text-blue-400 hover:text-white font-bold text-sm mb-6 transition"
          >
            <FaArrowLeft className="mr-2" /> Back to All Projects
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-blue-600/90 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              {project.category || 'Web Development'}
            </span>
            {project.featured && (
              <span className="bg-amber-500 text-gray-950 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                Featured Project
              </span>
            )}
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              {project.status || 'Published'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">{project.title}</h1>

          {project.shortDesc && (
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
              {project.shortDesc}
            </p>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Images & Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Viewer */}
            <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-xl overflow-hidden">
              <div className="h-80 md:h-[460px] rounded-2xl overflow-hidden bg-gray-100 relative mb-4">
                <img
                  src={activeImage || fallbackHeroImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackHeroImage;
                  }}
                />
              </div>

              {imageList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {imageList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activeImage === img ? 'border-blue-600 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg space-y-6">
              <h2 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">
                Project Overview
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line text-base font-medium">
                {project.fullDesc || project.shortDesc || project.description || 'Full project details coming soon.'}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Sidebar */}
          <div className="space-y-6">
            {/* CTA Box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg space-y-4">
              <h3 className="text-xl font-black text-gray-900 mb-2">Links & Actions</h3>

              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition shadow-md group"
                >
                  <FaExternalLinkAlt className="mr-2" /> Visit Live Project
                </a>
              ) : (
                <div className="w-full text-center bg-gray-100 text-gray-500 font-bold py-3.5 px-6 rounded-2xl text-sm">
                  Live link not available
                </div>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md"
                >
                  <FaGithub className="mr-2 text-lg" /> View GitHub Repository
                </a>
              )}
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg space-y-5">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3">
                Project Specifications
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 font-semibold flex items-center">
                    <FaFolder className="mr-2 text-blue-500" /> Category
                  </span>
                  <span className="font-bold text-gray-900">{project.category || 'Web App'}</span>
                </div>

                {project.clientName && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500 font-semibold flex items-center">
                      <FaUser className="mr-2 text-purple-500" /> Client
                    </span>
                    <span className="font-bold text-gray-900">{project.clientName}</span>
                  </div>
                )}

                {project.completedDate && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500 font-semibold flex items-center">
                      <FaCalendarAlt className="mr-2 text-emerald-500" /> Date Completed
                    </span>
                    <span className="font-bold text-gray-900">{project.completedDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 font-semibold flex items-center">
                    <FaCheckCircle className="mr-2 text-blue-500" /> Source
                  </span>
                  <span className="font-bold text-emerald-600">MySQL Database</span>
                </div>
              </div>
            </div>

            {/* Tech Stack Card */}
            {techList.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg space-y-4">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                  <FaLayerGroup className="mr-2 text-blue-600" /> Technologies Used
                </h3>

                <div className="flex flex-wrap gap-2 pt-1">
                  {techList.map((t, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
