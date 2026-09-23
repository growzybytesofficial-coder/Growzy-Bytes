import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  FaSearch,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTag,
  FaNewspaper,
  FaChartLine,
  FaLaptopCode,
  FaBullhorn,
  FaEnvelopeOpenText,
  FaTimes,
  FaCheckCircle,
  FaFilter,
  FaFire,
  FaLightbulb,
} from 'react-icons/fa';

const fallbackHeroImage =
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1920&q=80';

const fallbackBlogs = [
  {
    id: 'f1',
    title: 'How to Build a High-Converting Business Website in 2026',
    content:
      'A strong business website is no longer just about design. It needs clear messaging, fast loading speed, mobile responsiveness, SEO-friendly structure, trust elements, strategic CTAs and lead capture systems. Businesses that align design with conversion usually get better quality inquiries and stronger brand trust.',
    category: 'Web Development',
    author: 'GROWZYBYTES Team',
    createdAt: '2026-02-10T10:00:00.000Z',
    tags: ['React', 'UI/UX', 'Conversion', 'Business Website'],
  },
  {
    id: 'f2',
    title: 'SEO Basics Every Small Business Should Understand',
    content:
      'SEO helps businesses attract high-intent visitors without depending only on paid ads. The basics include keyword targeting, technical site health, on-page optimization, content clarity, internal linking and user-focused structure. When done correctly, SEO compounds over time and improves long-term visibility.',
    category: 'SEO',
    author: 'GROWZYBYTES Team',
    createdAt: '2026-02-18T09:30:00.000Z',
    tags: ['SEO', 'Organic Growth', 'Keywords', 'Content'],
  },
  {
    id: 'f3',
    title: 'Meta Ads vs Google Ads: Which One Should You Start With?',
    content:
      'Both ad platforms can work, but the better choice depends on buyer intent, product type, sales cycle and creative strength. Google Ads usually captures demand while Meta Ads can help create demand. Businesses should first decide their goal, funnel stage and budget before choosing a platform.',
    category: 'Performance Marketing',
    author: 'GROWZYBYTES Team',
    createdAt: '2026-02-25T12:00:00.000Z',
    tags: ['Meta Ads', 'Google Ads', 'PPC', 'Marketing'],
  },
  {
    id: 'f4',
    title: 'Why Responsive Design Still Matters for Every Brand',
    content:
      'Most users now browse on smaller screens first, which means every page must adapt smoothly across devices. Responsive design improves readability, accessibility, user confidence and engagement. It also reduces friction during navigation, which can positively affect conversion performance.',
    category: 'UI/UX',
    author: 'GROWZYBYTES Team',
    createdAt: '2026-03-01T11:45:00.000Z',
    tags: ['Responsive Design', 'Mobile', 'UX', 'Frontend'],
  },
  {
    id: 'f5',
    title: 'Content Marketing That Actually Supports Sales',
    content:
      'Content works best when it solves buyer questions, builds authority and moves readers toward the next action. Strong content marketing is not only about publishing blogs. It includes strategic landing page copy, thought leadership, educational posts and clear CTAs that connect traffic to business goals.',
    category: 'Content Marketing',
    author: 'GROWZYBYTES Team',
    createdAt: '2026-03-04T08:10:00.000Z',
    tags: ['Content', 'Copywriting', 'Lead Generation', 'Sales'],
  },
  {
    id: 'f6',
    title: 'What Makes a Good Digital Funnel for Service Businesses',
    content:
      'A good digital funnel guides visitors from awareness to action through relevant messaging, landing pages, proof, offers and follow-up systems. Service businesses often improve lead quality by combining ads, trust-building content, conversion-focused pages and WhatsApp or email follow-up automations.',
    category: 'Lead Generation',
    author: 'GROWZYBYTES Team',
    createdAt: '2026-03-06T07:15:00.000Z',
    tags: ['Funnels', 'Lead Generation', 'CRO', 'Automation'],
  },
];

const Blog = () => {
  const [bannerImg, setBannerImg] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  useEffect(() => {
    const fetchBlogPageData = async () => {
      try {
        const [blogsRes, pageImagesRes] = await Promise.allSettled([
          api.get('/blogs'),
          api.get('/pageImages'),
        ]);

        if (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value?.data)) {
          setBlogs(blogsRes.value.data);
        }

        if (
          pageImagesRes.status === 'fulfilled' &&
          Array.isArray(pageImagesRes.value?.data)
        ) {
          const banner = pageImagesRes.value.data.find(
            (img) =>
              img?.title?.toLowerCase() === 'blog' ||
              img?.page?.toLowerCase() === 'blog'
          );

          if (banner?.imageUrl) {
            setBannerImg(banner.imageUrl);
          }
        }
      } catch (error) {
        console.error('Blog page fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPageData();
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [search, selectedCategory, selectedTag, sortBy]);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getReadTime = (content = '') => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 180));
    return `${mins} min read`;
  };

  const normalizeBlogs = useMemo(() => {
    const source = blogs.length > 0 ? blogs : fallbackBlogs;

    return source.map((blog, index) => ({
      id: blog?._id || blog?.id || `blog-${index}`,
      title: blog?.title || 'Untitled Article',
      content: blog?.content || 'Content coming soon.',
      category: blog?.category || 'General',
      author: blog?.author || 'Admin',
      createdAt: blog?.createdAt || new Date().toISOString(),
      image:
        blog?.imageUrl ||
        blog?.image ||
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      tags: Array.isArray(blog?.tags)
        ? blog.tags
        : [blog?.category || 'General'],
      sourceType: blogs.length > 0 ? 'database' : 'fallback',
      readTime: getReadTime(blog?.content || ''),
    }));
  }, [blogs]);

  const categories = useMemo(() => {
    const cats = new Set(normalizeBlogs.map((b) => b.category));
    return ['All', ...Array.from(cats)];
  }, [normalizeBlogs]);

  const tags = useMemo(() => {
    const t = new Set();
    normalizeBlogs.forEach((b) => (b.tags || []).forEach((tag) => t.add(tag)));
    return ['All', ...Array.from(t)].slice(0, 15);
  }, [normalizeBlogs]);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = normalizeBlogs.filter((b) => {
      const matchesCategory =
        selectedCategory === 'All' || b.category === selectedCategory;
      const matchesTag = selectedTag === 'All' || b.tags.includes(selectedTag);
      const haystack = `${b.title} ${b.content} ${b.author} ${b.category} ${b.tags.join(
        ' '
      )}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);

      return matchesCategory && matchesTag && matchesSearch;
    });

    if (sortBy === 'latest') {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'oldest') {
      result.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [normalizeBlogs, search, selectedCategory, selectedTag, sortBy]);

  const featuredBlogs = useMemo(() => {
    return [...normalizeBlogs]
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  }, [normalizeBlogs]);

  const latestBlog = useMemo(() => {
    return featuredBlogs[0] || null;
  }, [featuredBlogs]);

  const visibleBlogs = useMemo(() => {
    return filteredBlogs.slice(0, visibleCount);
  }, [filteredBlogs, visibleCount]);

  const stats = useMemo(() => {
    const uniqueCategories = new Set(normalizeBlogs.map((b) => b.category)).size;
    const uniqueAuthors = new Set(normalizeBlogs.map((b) => b.author)).size;

    return [
      { number: normalizeBlogs.length, label: 'Articles' },
      { number: uniqueCategories, label: 'Categories' },
      { number: uniqueAuthors, label: 'Authors' },
      { number: tags.length - 1 > 0 ? tags.length - 1 : 0, label: 'Topics' },
    ];
  }, [normalizeBlogs, tags]);

  const categoryHighlights = useMemo(() => {
    const map = {};
    normalizeBlogs.forEach((b) => {
      map[b.category] = (map[b.category] || 0) + 1;
    });

    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [normalizeBlogs]);

  const relatedBlogs = useMemo(() => {
    if (!selectedBlog) return [];

    return normalizeBlogs
      .filter(
        (b) =>
          b.id !== selectedBlog.id &&
          (b.category === selectedBlog.category ||
            b.tags.some((tag) => selectedBlog.tags.includes(tag)))
      )
      .slice(0, 3);
  }, [selectedBlog, normalizeBlogs]);

  const openBlog = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setSubscribeMessage('Please enter a valid email.');
      return;
    }

    try {
      setSubmitting(true);
      setSubscribeMessage('');
      // Uncomment when backend route is ready
      // await api.post('/newsletter/subscribe', { email });
      await new Promise((r) => setTimeout(r, 700));
      setSubscribeMessage('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      console.error(err);
      setSubscribeMessage('Subscription failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Hero */}
      <section
        className="relative text-white py-24 md:py-32 px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${bannerImg || fallbackHeroImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/92 via-blue-950/88 to-gray-900/92"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <span className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-6">
            GROWZYBYTES Blog
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Insights on Marketing, SEO, Web Development & Growth
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Practical guides, growth ideas and digital strategies designed for businesses, creators and modern brands.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById('blog-listing')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 inline-flex items-center"
            >
              Explore Articles <FaArrowRight className="ml-2" />
            </button>

            <Link
              to="/contact"
              className="border border-gray-500 hover:border-white text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300"
            >
              Work With GROWZYBYTES
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
            >
              <h3 className="text-3xl md:text-5xl font-extrabold mb-2">{item.number}</h3>
              <p className="text-blue-100 uppercase tracking-wider text-xs md:text-sm font-semibold">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest spotlight */}
      {latestBlog && (
        <section className="py-20 md:py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img
                src={latestBlog.image}
                alt={latestBlog.title}
                className="w-full h-[320px] md:h-[460px] object-cover"
              />
              <div className="absolute top-5 left-5 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                Latest Spotlight
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
                  {latestBlog.category}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                  {new Date(latestBlog.createdAt).toLocaleDateString()}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                  {latestBlog.readTime}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
                {latestBlog.title}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {latestBlog.content.slice(0, 260)}...
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {latestBlog.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openBlog(latestBlog)}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition"
              >
                Read Featured Article <FaArrowRight className="ml-2" />
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured */}
      {!loading && featuredBlogs.length > 0 && (
        <section className="pb-10 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  Featured Articles
                </h2>
                <p className="text-gray-600 mt-2">
                  Latest hand-picked reads from GROWZYBYTES Insights.
                </p>
              </div>

              <div className="text-sm text-gray-500 font-medium">
                Fresh picks for growth-focused readers
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((b, idx) => (
                <motion.button
                  key={b.id || idx}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  onClick={() => openBlog(b)}
                  className="text-left bg-gray-50 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                        {b.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-900 mt-3">{b.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {b.content.slice(0, 120)}...
                    </p>

                    <div className="mt-4 text-sm font-semibold text-blue-600 inline-flex items-center">
                      Read now <FaArrowRight className="ml-2" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Topic cards */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              Explore by Topic
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-lg">
              Content areas built around practical business growth and modern digital execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLaptopCode />,
                title: 'Web Development',
                desc: 'Frontend, backend, responsive design, performance and business websites.',
              },
              {
                icon: <FaChartLine />,
                title: 'SEO Growth',
                desc: 'Organic traffic, search intent, content structure and visibility strategies.',
              },
              {
                icon: <FaBullhorn />,
                title: 'Performance Marketing',
                desc: 'Google Ads, Meta campaigns, lead generation and ad funnel improvements.',
              },
              {
                icon: <FaLightbulb />,
                title: 'Content Strategy',
                desc: 'Copywriting, content systems, brand messaging and conversion thinking.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section id="blog-listing" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-[2rem] shadow-sm border border-gray-100 p-5 md:p-6 mb-10">
            <div className="flex items-center justify-center text-sm font-semibold text-gray-500 mb-5">
              <FaFilter className="mr-2" /> Search & Filter Articles
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2 relative">
                <label className="text-sm font-semibold text-gray-700">Search blogs</label>
                <FaSearch className="absolute left-4 top-[54px] text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, content, author..."
                  className="w-full mt-2 pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Popular tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition ${
                      selectedTag === tag
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white text-purple-700 border border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold">{filteredBlogs.length}</span> results
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedTag('All');
                  setSortBy('latest');
                }}
                className="text-sm font-semibold text-gray-700 hover:text-blue-600"
              >
                Clear filters
              </button>
            </div>
          </div>

          {/* Category summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
            {categoryHighlights.map((item, index) => (
              <motion.div
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                    <FaNewspaper />
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{item.count}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Articles in this category</p>
              </motion.div>
            ))}
          </div>

          {/* Blog grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 rounded-full border-t-4 border-blue-600 animate-spin"></div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No blogs found</h3>
              <p className="text-gray-600 mb-6">
                Try different keywords, category or topic filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedTag('All');
                  setSortBy('latest');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {visibleBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition flex flex-col"
                  >
                    <div className="h-52 bg-gray-100 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-7 flex flex-col flex-grow">
                      <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                        <span className="font-bold text-blue-600 uppercase tracking-widest">
                          {blog.category}
                        </span>
                        <span className="text-gray-400 inline-flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{blog.title}</h3>

                      <p className="text-gray-600 mb-5 leading-relaxed flex-grow">
                        {blog.content.slice(0, 150)}...
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t pt-4 mt-auto">
                        <div className="text-sm text-gray-500">
                          <span className="font-semibold text-gray-700">By {blog.author}</span>
                          <div className="text-xs mt-1">{blog.readTime}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openBlog(blog)}
                          className="text-blue-600 font-bold hover:text-blue-700 inline-flex items-center"
                        >
                          Read More <FaArrowRight className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {visibleCount < filteredBlogs.length && (
                <div className="text-center mt-12">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition"
                  >
                    Load More Articles <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-[2rem] p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center text-sm font-semibold text-blue-200 bg-white/10 px-4 py-2 rounded-full mb-5">
                  <FaEnvelopeOpenText className="mr-2" /> Newsletter
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold">
                  Get weekly growth tips
                </h2>

                <p className="text-white/80 mt-3 max-w-xl">
                  Join our newsletter for practical marketing, SEO, web development and content strategy insights.
                </p>

                <div className="mt-6 space-y-3 text-sm text-white/85">
                  <div className="flex items-start">
                    <FaCheckCircle className="mr-3 mt-1 text-emerald-300" />
                    Actionable digital growth ideas.
                  </div>
                  <div className="flex items-start">
                    <FaCheckCircle className="mr-3 mt-1 text-emerald-300" />
                    Short, useful and business-focused updates.
                  </div>
                  <div className="flex items-start">
                    <FaCheckCircle className="mr-3 mt-1 text-emerald-300" />
                    SEO, content, UI and conversion insights in one place.
                  </div>
                </div>
              </div>

              <div>
                <form
                  onSubmit={handleSubscribe}
                  className="bg-white/10 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm"
                >
                  <label className="block text-sm font-semibold mb-3">
                    Subscribe to updates
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Enter your email..."
                      className="flex-1 p-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <button
                      disabled={submitting}
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold disabled:opacity-60"
                    >
                      {submitting ? 'Joining...' : 'Join'}
                    </button>
                  </div>

                  {subscribeMessage && (
                    <p className="mt-4 text-sm text-white/90">{subscribeMessage}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why follow */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaChartLine />,
              title: 'Growth-Focused Content',
              desc: 'Articles are written around real business visibility, traffic, lead generation and conversion topics.',
            },
            {
              icon: <FaLaptopCode />,
              title: 'Tech + Marketing Mix',
              desc: 'The page supports content across web development, SEO, UX, ads and digital strategy.',
            },
            {
              icon: <FaFire />,
              title: 'Always Discoverable',
              desc: 'Search, category filters, tags and featured sections make browsing much easier for readers.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: index * 0.07 }}
              className="bg-gray-50 rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition"
            >
              <div className="text-3xl text-blue-600 mb-5">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Common questions about this blog page setup.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is this page dynamic?',
                a: 'Yes. It fetches blogs from your blogs API endpoint and falls back to sample content if the database is empty.',
              },
              {
                q: 'Can I search and filter articles?',
                a: 'Yes. The page includes search, category filters, tag filters and sorting options.',
              },
              {
                q: 'Can I open full article content in a modal?',
                a: 'Yes. Clicking a blog card opens the full blog details in a responsive modal.',
              },
              {
                q: 'Can I connect newsletter subscribe to backend later?',
                a: 'Yes. You only need to uncomment and connect the newsletter API route in handleSubscribe.',
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
              >
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-bold text-gray-900">
                  <span>{faq.q}</span>
                  <span className="text-blue-600 text-xl">+</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 text-white rounded-[2rem] p-10 md:p-16 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Want content like this for your brand?
          </h2>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            We help businesses with content strategy, SEO, web development and full digital growth systems.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 px-10 rounded-full transition shadow-xl"
            >
              Book a Strategy Call <FaArrowRight className="ml-3" />
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center border border-gray-500 hover:border-white text-white font-bold text-lg py-4 px-10 rounded-full transition"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedBlog && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
            >
              <div className="relative h-64 md:h-80 bg-gray-100">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white text-gray-700 hover:text-red-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
                  <span className="font-bold text-blue-600 uppercase tracking-widest">
                    {selectedBlog.category}
                  </span>
                  <span className="text-gray-500 inline-flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(selectedBlog.createdAt).toLocaleString()}
                  </span>
                  <span className="text-gray-500 inline-flex items-center">
                    <FaUser className="mr-1" />
                    {selectedBlog.author}
                  </span>
                  <span className="text-gray-500 inline-flex items-center">
                    <FaClock className="mr-1" />
                    {selectedBlog.readTime}
                  </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900">
                  {selectedBlog.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {selectedBlog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center"
                    >
                      <FaTag className="mr-2" /> {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedBlog.content}
                </p>

                {relatedBlogs.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h4 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedBlogs.map((blog) => (
                        <button
                          key={blog.id}
                          type="button"
                          onClick={() => openBlog(blog)}
                          className="text-left bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:shadow-md transition"
                        >
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                            {blog.category}
                          </p>
                          <h5 className="text-sm font-bold text-gray-900 mb-2">{blog.title}</h5>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {blog.content.slice(0, 80)}...
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
