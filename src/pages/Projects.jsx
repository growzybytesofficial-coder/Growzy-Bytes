import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import {
  FaExternalLinkAlt,
  FaChartLine,
  FaArrowRight,
  FaFilter,
  FaSearch,
  FaCheckCircle,
  FaGithub,
  FaGlobe,
  FaLaptopCode,
  FaRocket,
  FaUsers,
  FaCode,
  FaLayerGroup,
  FaStar,
  FaQuoteLeft,
  FaClock,
  FaServer,
  FaChevronDown,
  FaTimes,
  FaBuilding,
  FaHeartbeat,
  FaGraduationCap,
  FaShoppingCart,
  FaQuestionCircle,
  FaPlus,
  FaMinus,
  FaThLarge,
  FaListUl,
  FaSlidersH,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fallbackHeroImage =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80';

const Projects = () => {
  const [bannerImg, setBannerImg] = useState('');
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedTech, setSelectedTech] = useState('All');
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjectsPageData = async () => {
      try {
        const [projectsRes, pageImagesRes] = await Promise.allSettled([
          api.get('/projects'),
          api.get('/pageImages'),
        ]);

        if (projectsRes.status === 'fulfilled') {
          const resVal = projectsRes.value?.data;
          let projectList = [];
          if (Array.isArray(resVal)) {
            projectList = resVal;
          } else if (resVal?.data?.projects && Array.isArray(resVal.data.projects)) {
            projectList = resVal.data.projects;
          } else if (resVal?.projects && Array.isArray(resVal.projects)) {
            projectList = resVal.projects;
          }
          setDbProjects(projectList);
        }

        if (
          pageImagesRes.status === 'fulfilled' &&
          Array.isArray(pageImagesRes.value?.data)
        ) {
          const banner = pageImagesRes.value.data.find(
            (img) =>
              img?.title?.toLowerCase() === 'projects' ||
              img?.page?.toLowerCase() === 'projects'
          );
          if (banner?.imageUrl) setBannerImg(banner.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching projects page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsPageData();
  }, []);

  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, activeStatus, searchTerm, sortBy, selectedTech, showLiveOnly]);

  const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  const hasValidLink = (url) =>
    typeof url === 'string' && url.trim() !== '' && url.trim() !== '#';

  const truncate = (text, len = 140) =>
    text?.length > len ? `${text.slice(0, len)}...` : text || '';

  const getStatusClasses = (status = '') => {
    const value = status.toLowerCase();
    if (value === 'live' || value === 'published') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (value === 'beta' || value === 'draft') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (value === 'done') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (value === 'plugin') return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const allProjects = useMemo(() => {
    return dbProjects.map((project, index) => {
      const techList = Array.isArray(project?.technologies)
        ? project.technologies.map((t) => (typeof t === 'string' ? t : t.techName || t.technology_name)).filter(Boolean)
        : Array.isArray(project?.tech)
        ? project.tech
        : typeof project?.tech === 'string'
        ? project.tech.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const cover = project?.coverImage || project?.cover_image || project?.image || project?.imageUrl || fallbackHeroImage;
      const live = project?.liveUrl || project?.live_url || project?.liveLink || project?.links?.live || '';
      const repo = project?.githubUrl || project?.github_url || project?.repoLink || project?.links?.repo || '';

      return {
        id: project?.id || project?._id || `db-${index}`,
        title: project?.title || 'Untitled Project',
        slug: project?.slug || '',
        category: project?.category || 'Web Development',
        status: project?.status || 'published',
        img: cover,
        desc:
          project?.shortDesc ||
          project?.short_description ||
          project?.fullDesc ||
          project?.description ||
          'Project details will be available soon.',
        fullDesc: project?.fullDesc || project?.full_description || project?.shortDesc || '',
        tech: techList,
        links: {
          live,
          repo,
        },
        source: 'database',
        createdOrder: 1000 - index,
      };
    });
  }, [dbProjects]);

  const categories = useMemo(
    () => ['All', ...new Set(allProjects.map((project) => project.category))],
    [allProjects]
  );

  const statuses = useMemo(
    () => ['All', ...new Set(allProjects.map((project) => project.status))],
    [allProjects]
  );

  const techOptions = useMemo(() => {
    const techs = allProjects.flatMap((project) => project.tech || []);
    return ['All', ...new Set(techs)].slice(0, 18);
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    let data = [...allProjects];

    data = data.filter((project) => {
      const matchesCategory =
        activeCategory === 'All' || project.category === activeCategory;
      const matchesStatus =
        activeStatus === 'All' || project.status === activeStatus;
      const matchesTech =
        selectedTech === 'All' || project.tech.includes(selectedTech);
      const matchesLive = !showLiveOnly || project.status === 'Live';

      const search = searchTerm.trim().toLowerCase();
      const haystack = `${project.title} ${project.desc} ${project.category} ${project.tech.join(
        ' '
      )}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);

      return (
        matchesCategory &&
        matchesStatus &&
        matchesTech &&
        matchesLive &&
        matchesSearch
      );
    });

    if (sortBy === 'latest') {
      data.sort((a, b) => (b.createdOrder || 0) - (a.createdOrder || 0));
    } else if (sortBy === 'name-asc') {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'name-desc') {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'live-first') {
      data.sort((a, b) => {
        if (a.status === 'Live' && b.status !== 'Live') return -1;
        if (a.status !== 'Live' && b.status === 'Live') return 1;
        return a.title.localeCompare(b.title);
      });
    } else if (sortBy === 'category') {
      data.sort((a, b) => a.category.localeCompare(b.category));
    }

    return data;
  }, [
    allProjects,
    activeCategory,
    activeStatus,
    searchTerm,
    selectedTech,
    showLiveOnly,
    sortBy,
  ]);

  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount]
  );

  const featuredProjects = useMemo(() => {
    return allProjects
      .filter(
        (project) => project.status === 'Live' && hasValidLink(project.links?.live)
      )
      .slice(0, 3);
  }, [allProjects]);

  const spotlightProject = useMemo(() => {
    return (
      filteredProjects.find((p) => hasValidLink(p.links?.live)) ||
      filteredProjects[0] ||
      null
    );
  }, [filteredProjects]);

  const stats = useMemo(() => {
    return [
      { number: allProjects.length, label: 'Total Projects' },
      {
        number: allProjects.filter((p) => p.status === 'Live').length,
        label: 'Live Projects',
      },
      {
        number: new Set(allProjects.map((p) => p.category)).size,
        label: 'Categories',
      },
      {
        number: new Set(allProjects.flatMap((p) => p.tech)).size,
        label: 'Tech Stacks',
      },
      {
        number: allProjects.filter((p) => p.category === 'Client Work').length,
        label: 'Client Works',
      },
    ];
  }, [allProjects]);

  const topTechStacks = useMemo(() => {
    const map = {};
    allProjects.forEach((project) => {
      project.tech.forEach((tech) => {
        map[tech] = (map[tech] || 0) + 1;
      });
    });

    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [allProjects]);

  const industries = [
    {
      icon: <FaHeartbeat />,
      name: 'Healthcare & Medical',
      desc: 'Patient portals, clinic websites, and medical management systems.',
    },
    {
      icon: <FaGraduationCap />,
      name: 'EdTech & E-Learning',
      desc: 'Course platforms, student portals, and institute management products.',
    },
    {
      icon: <FaShoppingCart />,
      name: 'E-Commerce & Retail',
      desc: 'Custom storefronts, inventory systems, and conversion-ready catalog experiences.',
    },
    {
      icon: <FaBuilding />,
      name: 'Corporate & Real Estate',
      desc: 'Business portfolios, listing portals, and lead-generation-focused websites.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sharma',
      role: 'Clinic Owner',
      quote:
        'The medical portal feels fast, professional, and much easier for patients to use than our previous system.',
    },
    {
      name: 'Rajesh V.',
      role: 'Startup Founder',
      quote:
        'Communication stayed smooth throughout the project and the final architecture felt clean and scalable.',
    },
    {
      name: 'Anita K.',
      role: 'E-Commerce Director',
      quote:
        'The frontend performance improved a lot and the user journey became noticeably clearer after launch.',
    },
  ];

  const faqs = [
    {
      q: 'Do you provide post-launch support and maintenance?',
      a: 'Yes, maintenance and ongoing improvement can be planned to keep the application secure, updated, and high-performing after launch.',
    },
    {
      q: 'Can you work with an existing codebase?',
      a: 'Yes, existing MERN, Django, or custom projects can be audited, optimized, redesigned, and scaled as needed.',
    },
    {
      q: 'How long does a typical custom web app take?',
      a: 'A focused MVP can take a few weeks, while larger multi-module systems naturally take longer depending on complexity.',
    },
    {
      q: 'Will the final product be mobile responsive and SEO friendly?',
      a: 'Yes, the build approach stays mobile-first with responsive layouts, clear structure, and technical SEO-friendly practices.',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Planning',
      desc: 'We understand the business goal, user journey, and technical scope before building.',
      icon: <FaRocket />,
    },
    {
      step: '02',
      title: 'Design & Build',
      desc: 'We create responsive interfaces, solid structure, and scalable frontend or backend flows.',
      icon: <FaLaptopCode />,
    },
    {
      step: '03',
      title: 'Testing',
      desc: 'We test responsiveness, navigation, performance, and practical real-world usability.',
      icon: <FaCheckCircle />,
    },
    {
      step: '04',
      title: 'Launch & Improve',
      desc: 'We deploy, monitor, and continue refining based on feedback and project goals.',
      icon: <FaChartLine />,
    },
  ];

  const activeFilterCount = [
    activeCategory !== 'All',
    activeStatus !== 'All',
    selectedTech !== 'All',
    showLiveOnly,
    !!searchTerm.trim(),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setActiveCategory('All');
    setActiveStatus('All');
    setSearchTerm('');
    setSortBy('latest');
    setSelectedTech('All');
    setShowLiveOnly(false);
    setShowMobileFilters(false);
  };

  const openProject = (project) => setSelectedProject(project);
  const closeProject = () => setSelectedProject(null);

  const filterPanel = (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="relative lg:col-span-2 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
          <input
            type="text"
            placeholder="Search by title, tech, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 font-medium rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-blue-500 transition shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              type="button"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 font-medium rounded-2xl py-3.5 px-4 pr-10 focus:outline-none focus:border-blue-500 transition cursor-pointer shadow-inner"
          >
            <option value="latest">Sort: Latest</option>
            <option value="live-first">Sort: Live First</option>
            <option value="name-asc">Sort: A-Z</option>
            <option value="name-desc">Sort: Z-A</option>
            <option value="category">Sort: Category</option>
          </select>
          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <label className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition shadow-inner">
          <input
            type="checkbox"
            checked={showLiveOnly}
            onChange={(e) => setShowLiveOnly(e.target.checked)}
            className="accent-blue-600 w-4 h-4"
          />
          Show Live Only
        </label>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition duration-300 ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
            }`}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition duration-300 ${
              activeStatus === status
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-500'
            }`}
            type="button"
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-hidden pb-24 selection:bg-blue-600 selection:text-white">
      <section
        className="relative text-white py-24 md:py-32 px-6 overflow-hidden border-b-4 border-blue-600 bg-cover bg-center"
        style={{ backgroundImage: `url('${bannerImg || fallbackHeroImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-blue-950/90 to-gray-900/95"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <span className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-6 backdrop-blur-sm">
            Advanced Portfolio Showcase
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
            Live Projects, Client Work{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Real Case Studies
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            Explore MERN stack builds, Django applications and real client websites with advanced filters, smooth browsing, and direct live project access.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#portfolio"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] inline-flex items-center group"
            >
              Explore Portfolio
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition" />
            </a>

            <Link
              to="/contact"
              className="border-2 border-gray-500 hover:border-white hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300"
            >
              Start Your Project
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="bg-blue-600 text-white py-12 px-6 shadow-inner relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
            >
              <h3 className="text-3xl md:text-5xl font-black mb-2">{stat.number}</h3>
              <p className="text-blue-200 uppercase tracking-widest text-xs md:text-sm font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
              Industries We Empower
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg font-medium">
              Tailored product experiences for business use-cases across different domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((ind, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: idx * 0.08 }}
                className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:border-blue-200 transition duration-300 group"
              >
                <div className="text-4xl text-blue-500 mb-6 group-hover:scale-110 transition duration-300">
                  {ind.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{ind.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="py-20 md:py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                  Featured Live Projects
                </h2>
                <p className="text-gray-600 mt-3 max-w-2xl text-lg font-medium">
                  Directly accessible live websites from your portfolio.
                </p>
              </div>

              <div className="inline-flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <FaGlobe className="mr-2" />
                Live Showcase
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 group flex flex-col"
                >
                  <div className="h-64 overflow-hidden bg-gray-100 relative">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between gap-4 mb-4">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md">
                        {project.category}
                      </span>
                      <span
                        className={`border text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md ${getStatusClasses(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                      {truncate(project.desc, 140)}
                    </p>

                    <button
                      onClick={() => openProject(project)}
                      className="mb-4 text-blue-600 font-bold text-sm inline-flex items-center"
                      type="button"
                    >
                      Quick View <FaArrowRight className="ml-2" />
                    </button>

                    {hasValidLink(project.links.live) && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-md mt-auto"
                      >
                        Visit Live Site <FaExternalLinkAlt className="ml-2" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {spotlightProject && (
        <section className="py-20 px-6 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img
                src={spotlightProject.img}
                alt={spotlightProject.title}
                className="w-full h-[320px] md:h-[460px] object-cover"
              />
              <div className="absolute top-5 left-5 bg-gray-900/90 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                Project Spotlight
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {spotlightProject.category}
                </span>
                <span
                  className={`border px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClasses(
                    spotlightProject.status
                  )}`}
                >
                  {spotlightProject.status}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-5">
                {spotlightProject.title}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {spotlightProject.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: <FaLayerGroup />,
                    label: 'Stack',
                    value: spotlightProject.tech.slice(0, 3).join(', ') || 'Custom Stack',
                  },
                  {
                    icon: <FaClock />,
                    label: 'Status',
                    value: spotlightProject.status,
                  },
                  {
                    icon: <FaServer />,
                    label: 'Type',
                    value: spotlightProject.category,
                  },
                  {
                    icon: <FaStar />,
                    label: 'Source',
                    value:
                      spotlightProject.source === 'database'
                        ? 'Admin Managed'
                        : 'Portfolio Listed',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 rounded-2xl border border-gray-100 p-4 shadow-sm"
                  >
                    <div className="text-blue-600 mb-2">{item.icon}</div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {hasValidLink(spotlightProject.links?.live) && (
                  <a
                    href={spotlightProject.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition"
                  >
                    View Live Project <FaExternalLinkAlt className="ml-2" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => openProject(spotlightProject)}
                  className="inline-flex items-center justify-center border border-gray-300 hover:border-gray-500 text-gray-900 font-bold py-4 px-8 rounded-full transition"
                >
                  Quick Preview <FaArrowRight className="ml-2" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section
        id="portfolio"
        className="px-6 py-6 bg-white/90 sticky top-0 z-40 backdrop-blur-md border-y border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center justify-center lg:justify-start text-sm font-bold text-gray-500 uppercase tracking-widest">
              <FaFilter className="mr-2" />
              Dynamic Filters
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">
              <div className="inline-flex bg-gray-100 border border-gray-200 rounded-2xl p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  <FaThLarge className="mr-2" />
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  <FaListUl className="mr-2" />
                  List
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileFilters((prev) => !prev)}
                className="lg:hidden inline-flex items-center bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-sm font-bold"
              >
                <FaSlidersH className="mr-2" />
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-bold text-red-500 hover:text-red-700 underline underline-offset-4 transition"
                  type="button"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block">{filterPanel}</div>

          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-2">{filterPanel}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">All Projects</h2>
            <p className="text-gray-500 mt-2 font-medium">
              Showing {visibleProjects.length} of {filteredProjects.length} results.
            </p>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-600">
                  Search: {searchTerm}
                </span>
              )}
              {activeCategory !== 'All' && (
                <span className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-600">
                  Category: {activeCategory}
                </span>
              )}
              {activeStatus !== 'All' && (
                <span className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-600">
                  Status: {activeStatus}
                </span>
              )}
              {selectedTech !== 'All' && (
                <span className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-600">
                  Tech: {selectedTech}
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-10"
          >
            <div className="text-6xl text-gray-300 flex justify-center mb-6">
              <FaSearch />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">No Projects Found</h3>
            <p className="text-gray-500 mb-8 font-medium">
              We couldn&apos;t find any projects matching your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition"
              type="button"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                  : 'grid grid-cols-1 gap-6'
              }
            >
              <AnimatePresence>
                {visibleProjects.map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group ${
                      viewMode === 'list'
                        ? 'grid grid-cols-1 lg:grid-cols-[340px_1fr]'
                        : 'flex flex-col'
                    }`}
                  >
                    <div
                      className={`bg-gray-200 overflow-hidden relative ${
                        viewMode === 'list' ? 'h-64 lg:h-full' : 'h-56'
                      }`}
                    >
                      <img
                        src={project.img}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-gray-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest backdrop-blur-sm">
                        {project.category}
                      </div>
                      <div
                        className={`absolute top-4 right-4 border text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest backdrop-blur-sm ${getStatusClasses(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </div>
                    </div>

                    <div className="p-6 lg:p-7 flex-grow flex flex-col">
                      <div className="flex items-center gap-3 mb-4 text-xs flex-wrap">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          {project.source === 'database' ? 'Admin Project' : 'Portfolio Project'}
                        </span>
                        {hasValidLink(project.links?.live) && (
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                            Live URL
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition">
                        {project.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow font-medium">
                        {truncate(project.desc, viewMode === 'list' ? 220 : 140)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.slice(0, 5).map((item) => (
                          <button
                            key={item}
                            onClick={() => setSelectedTech(item)}
                            className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 transition"
                            type="button"
                          >
                            {item}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
                        {hasValidLink(project.links?.live) ? (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center bg-gray-900 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition"
                          >
                            Live <FaExternalLinkAlt className="ml-2 text-xs" />
                          </a>
                        ) : (
                          <div className="flex items-center justify-center bg-gray-50 text-gray-500 border border-gray-200 font-bold py-2.5 px-4 rounded-lg text-sm">
                            <FaCheckCircle className="mr-2" />
                            Done
                          </div>
                        )}

                        <button
                          onClick={() => openProject(project)}
                          type="button"
                          className="flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-bold py-2.5 px-4 rounded-lg text-sm transition"
                        >
                          View <FaArrowRight className="ml-2 text-xs" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {visibleCount < filteredProjects.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="inline-flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white font-black py-3 px-8 rounded-full transition shadow-sm"
                  type="button"
                >
                  Load More <FaArrowRight className="ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="py-20 px-6 bg-white mt-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
              Tech Stack Highlights
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-lg font-medium">
              The core technologies powering these applications.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
            {topTechStacks.map((item, index) => (
              <motion.button
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-2xl border border-gray-100 p-5 text-center hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition cursor-pointer group"
                onClick={() => {
                  setSelectedTech(item.name);
                  document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                type="button"
              >
                <div className="text-2xl text-blue-400 group-hover:text-blue-600 flex justify-center mb-3 transition">
                  <FaLayerGroup />
                </div>
                <h3 className="text-sm font-black text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 font-bold mt-1">{item.count} items</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black">How We Build</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-5">
                  {item.icon}
                </div>
                <div className="text-xs font-black tracking-widest text-blue-400 mb-3 uppercase">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">
              What Clients Say
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg font-medium">
              Real feedback from clients who trusted us with their digital products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.08 }}
                className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm relative"
              >
                <FaQuoteLeft className="text-4xl text-blue-200 absolute top-8 right-8" />
                <p className="text-gray-700 italic mb-8 relative z-10">{test.quote}</p>
                <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xl">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{test.name}</h4>
                    <p className="text-sm text-blue-600 font-semibold">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Project FAQs</h2>
            <p className="text-gray-600 mt-4 text-lg font-medium">
              Common questions about the development process and deliverables.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className={`bg-white border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  activeFaq === index
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  type="button"
                >
                  <span className="font-bold text-gray-900 text-lg pr-4 inline-flex items-center">
                    <FaQuestionCircle className="mr-3 text-blue-600" />
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                      activeFaq === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {activeFaq === index ? <FaMinus size={12} /> : <FaPlus size={12} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-gray-600 font-medium"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto text-center mt-20 px-6">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-[2.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to start your project?
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Let&apos;s build a fast, modern and responsive application that solves real business challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-blue-700 hover:bg-gray-50 font-black text-lg py-4 px-10 rounded-full transition shadow-xl inline-flex items-center justify-center"
              >
                Discuss Your Idea <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={closeProject}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
            >
              <div className="relative h-64 md:h-96 bg-gray-100">
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={closeProject}
                  className="absolute top-4 right-4 bg-white text-gray-700 hover:text-red-500 rounded-full w-11 h-11 flex items-center justify-center shadow-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedProject.category}
                  </span>
                  <span
                    className={`border px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusClasses(
                      selectedProject.status
                    )}`}
                  >
                    {selectedProject.status}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedProject.source === 'database' ? 'Admin Project' : 'Portfolio Project'}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  {selectedProject.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-8">
                  {selectedProject.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      icon: <FaCode />,
                      label: 'Tech Used',
                      value: `${selectedProject.tech.length || 0} tools`,
                    },
                    {
                      icon: <FaGlobe />,
                      label: 'Live Access',
                      value: hasValidLink(selectedProject.links?.live) ? 'Available' : 'Not Added',
                    },
                    {
                      icon: <FaServer />,
                      label: 'Project Type',
                      value: selectedProject.category,
                    },
                    {
                      icon: <FaUsers />,
                      label: 'Status',
                      value: selectedProject.status,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-4"
                    >
                      <div className="text-blue-600 text-xl mb-2">{item.icon}</div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.tech.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => {
                        closeProject();
                        setSelectedTech(tech);
                        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-100 transition"
                    >
                      {tech}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {hasValidLink(selectedProject.links?.live) && (
                    <a
                      href={selectedProject.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition"
                    >
                      Visit Live Project <FaExternalLinkAlt className="ml-2" />
                    </a>
                  )}

                  {hasValidLink(selectedProject.links?.repo) ? (
                    <a
                      href={selectedProject.links.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border border-gray-300 hover:border-gray-500 text-gray-900 font-bold py-4 px-8 rounded-full transition"
                    >
                      View Repository <FaGithub className="ml-2" />
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-500 font-bold py-4 px-8 rounded-full">
                      Repository Private
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
