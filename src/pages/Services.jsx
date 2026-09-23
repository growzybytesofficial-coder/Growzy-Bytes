import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';
import {
  FaSearchDollar,
  FaPenNib,
  FaShareAlt,
  FaCode,
  FaArrowRight,
  FaCheckCircle,
  FaBullseye,
  FaChartLine,
  FaMobileAlt,
  FaGlobe,
  FaUsers,
  FaGoogle,
  FaFacebookF,
  FaWhatsapp,
  FaEnvelopeOpenText,
  FaLaptopCode,
  FaRocket,
  FaChevronDown,
} from 'react-icons/fa';

const fallbackHeroImage =
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80';

const Services = () => {
  const [bannerImg, setBannerImg] = useState('');
  const [dbServices, setDbServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFaq, setActiveFaq] = useState(null);

  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [servicesRes, projectsRes, pageImagesRes] = await Promise.allSettled([
          api.get('/services'),
          api.get('/projects'),
          api.get('/pageImages'),
        ]);

        if (
          servicesRes.status === 'fulfilled' &&
          Array.isArray(servicesRes.value?.data)
        ) {
          setDbServices(servicesRes.value.data);
        }

        if (
          projectsRes.status === 'fulfilled' &&
          Array.isArray(projectsRes.value?.data)
        ) {
          setProjects(projectsRes.value.data.slice(0, 3));
        }

        if (
          pageImagesRes.status === 'fulfilled' &&
          Array.isArray(pageImagesRes.value?.data)
        ) {
          const banner = pageImagesRes.value.data.find(
            (img) =>
              img?.title?.toLowerCase() === 'services' ||
              img?.page?.toLowerCase() === 'services'
          );

          if (banner?.imageUrl) {
            setBannerImg(banner.imageUrl);
          }
        }
      } catch (error) {
        console.error('Services page fetch error:', error);
      } finally {
        setLoadingServices(false);
        setLoadingProjects(false);
      }
    };

    fetchPageData();
  }, []);

  const getServiceIcon = (title = '', category = '') => {
    const text = `${title} ${category}`.toLowerCase();

    if (text.includes('seo') || text.includes('search')) return <FaSearchDollar />;
    if (text.includes('content') || text.includes('copy')) return <FaPenNib />;
    if (
      text.includes('social') ||
      text.includes('meta') ||
      text.includes('instagram')
    )
      return <FaShareAlt />;
    if (
      text.includes('web') ||
      text.includes('development') ||
      text.includes('website')
    )
      return <FaCode />;
    if (text.includes('app') || text.includes('mobile')) return <FaMobileAlt />;
    if (
      text.includes('ads') ||
      text.includes('performance') ||
      text.includes('marketing')
    )
      return <FaChartLine />;
    if (text.includes('email') || text.includes('whatsapp'))
      return <FaEnvelopeOpenText />;

    return <FaBullseye />;
  };

  const coreServices = [
    {
      id: 'core-1',
      icon: <FaSearchDollar />,
      title: 'Search Engine Optimization (SEO)',
      desc: 'Improve your organic rankings and drive high-quality traffic with technical SEO, content strategy and authority building.',
      category: 'SEO',
      points: [
        'Technical SEO audit',
        'On-page optimization',
        'Content strategy',
        'Keyword targeting',
      ],
    },
    {
      id: 'core-2',
      icon: <FaCode />,
      title: 'Full-Stack Development',
      desc: 'Dynamic, fast and responsive websites, portals and web apps built using modern frontend and backend technologies.',
      category: 'Development',
      points: [
        'React / MERN stack',
        'Admin panel integration',
        'Responsive UI',
        'Performance optimization',
      ],
    },
    {
      id: 'core-3',
      icon: <FaShareAlt />,
      title: 'Social Media Management',
      desc: 'Build a loyal community around your brand with engaging content, reels, creatives and platform strategy.',
      category: 'Social Media',
      points: [
        'Content calendars',
        'Brand creatives',
        'Platform management',
        'Audience growth',
      ],
    },
    {
      id: 'core-4',
      icon: <FaPenNib />,
      title: 'Content Marketing',
      desc: 'High-converting website copy, blogs, ad creatives and sales messaging built for authority and conversion.',
      category: 'Content',
      points: [
        'Website copy',
        'Blogs & SEO articles',
        'Campaign content',
        'Brand messaging',
      ],
    },
    {
      id: 'core-5',
      icon: <FaMobileAlt />,
      title: 'App Development',
      desc: 'Modern web and mobile applications with clean UI, scalable architecture and business-focused workflows.',
      category: 'Development',
      points: [
        'Mobile-first builds',
        'Web apps & dashboards',
        'Scalable backend',
        'Fast deployment',
      ],
    },
    {
      id: 'core-6',
      icon: <FaChartLine />,
      title: 'Performance Marketing',
      desc: 'ROI-focused campaigns on Google and Meta with strong tracking, testing and conversion optimization.',
      category: 'Paid Ads',
      points: [
        'Google Ads',
        'Meta Ads',
        'Retargeting funnels',
        'Lead quality improvement',
      ],
    },
  ];

  const mergedServices = useMemo(() => {
    const normalizedDbServices = dbServices.map((service, index) => ({
      id: service._id || `db-${index}`,
      icon: getServiceIcon(service.title, service.category),
      title: service.title || 'Specialized Service',
      desc:
        service.shortDesc ||
        service.description ||
        'Custom service from admin panel.',
      category: service.category || 'Custom',
      points:
        Array.isArray(service.features) && service.features.length > 0
          ? service.features
          : [
              'Custom strategy',
              'Dedicated execution',
              'Performance reporting',
              'Scalable delivery',
            ],
      isDynamic: true,
    }));

    return [...coreServices, ...normalizedDbServices];
  }, [dbServices]);

  const categories = useMemo(() => {
    return ['All', ...new Set(mergedServices.map((s) => s.category || 'Custom'))];
  }, [mergedServices]);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All') return mergedServices;
    return mergedServices.filter((s) => s.category === activeCategory);
  }, [activeCategory, mergedServices]);

  const fallbackProjects = [
    {
      _id: 'p1',
      title: 'D2C Growth Funnel',
      category: 'Performance Marketing',
      description:
        'Built landing pages and ad funnels for a product brand to improve ROAS and lead quality.',
      result: '+3.8x ROAS',
      imageUrl:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      _id: 'p2',
      title: 'Local Business Website Revamp',
      category: 'Web Development',
      description:
        'Created a fast responsive business website with inquiry forms, SEO pages and admin-managed sections.',
      result: '+62% inquiries',
      imageUrl:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    },
    {
      _id: 'p3',
      title: 'Education Lead System',
      category: 'Content + Ads',
      description:
        'Combined ad creatives, landing pages and email nurturing to improve student lead generation.',
      result: '3,000+ leads',
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Audit & Discovery',
      desc: 'We study your business, audience, competitors and current digital gaps before suggesting anything.',
    },
    {
      step: '02',
      title: 'Strategy & Structure',
      desc: 'We plan the right pages, funnels, channels, content, creatives and conversion points for your goals.',
    },
    {
      step: '03',
      title: 'Execution & Launch',
      desc: 'We build, write, design and launch the assets needed to bring traffic, leads and conversions.',
    },
    {
      step: '04',
      title: 'Optimize & Scale',
      desc: 'We review data, improve weak spots and scale what is already working for faster growth.',
    },
  ];

  const industries = [
    'E-commerce & D2C',
    'Education & Coaching',
    'Real Estate',
    'Healthcare',
    'Local Services',
    'Startups & SaaS',
    'Personal Brands',
    'Corporate Businesses',
  ];

  const toolStack = [
    { icon: <FaGoogle />, label: 'Google Ads' },
    { icon: <FaFacebookF />, label: 'Meta Ads' },
    { icon: <FaLaptopCode />, label: 'React / MERN' },
    { icon: <FaGlobe />, label: 'SEO Tools' },
    { icon: <FaEnvelopeOpenText />, label: 'Email Funnels' },
    { icon: <FaWhatsapp />, label: 'WhatsApp API' },
  ];

  const faqs = [
    {
      q: 'Do you provide only marketing or development too?',
      a: 'We handle both. GROWZYBYTES covers web development, app development, SEO, paid ads, social media, content and conversion systems. This ensures your code and marketing are perfectly aligned.',
    },
    {
      q: 'Can I start with one service and scale later?',
      a: 'Yes. Many clients begin with one main service like SEO, ads or a website revamp and expand into full funnels once the base system is profitable.',
    },
    {
      q: 'Are these services dynamic from the admin panel?',
      a: 'Yes! The specialized services section is fully managed from your admin panel. You can add new service offerings anytime.',
    },
    {
      q: 'Do you build custom packages?',
      a: 'Yes. We usually create custom strategy packages based on your business stage, lead goals, funnel requirements and monthly budget.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* --- 1. HERO SECTION --- */}
      <section
        className="relative text-white pt-32 pb-24 px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${bannerImg || fallbackHeroImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/85 to-slate-900/90"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 blur-[100px] rounded-full mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 blur-[100px] rounded-full mix-blend-screen animate-blob animation-delay-2000"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs md:text-sm uppercase tracking-[0.2em] font-bold mb-6 backdrop-blur-sm">
            Services That Build Growth
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
            Digital Marketing, Web Dev &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Growth Systems
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            From websites and apps to SEO, paid ads, content and automations —
            GROWZYBYTES helps brands scale with one unified execution team.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full text-lg transition duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] inline-flex items-center group"
            >
              Get Free Consultation
              <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/projects"
              className="bg-transparent border-2 border-slate-600 hover:border-white hover:bg-white hover:text-slate-900 text-white font-bold py-4 px-10 rounded-full text-lg transition duration-300"
            >
              See Case Studies
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- 2. TRUST STATS STRIP --- */}
      <section className="bg-blue-600 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { number: '180+', label: 'Projects Delivered' },
            { number: '120+', label: 'Clients Served' },
            { number: '12M+', label: 'Leads Generated' },
            { number: '6+', label: 'Core Service Areas' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-3xl md:text-5xl font-black mb-1">
                {item.number}
              </h3>
              <p className="text-blue-200 uppercase tracking-widest text-xs md:text-sm font-bold">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 3. INTRO / WHY US --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              One team for tech, traffic, and conversion.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
              Most brands struggle because their website, ads, content and
              follow-up systems are disconnected. We solve that by building a
              complete digital growth stack under one roof.
            </p>

            <div className="space-y-5">
              {[
                'Custom websites and apps built for speed and conversion.',
                'SEO and content systems for long-term organic growth.',
                'Google and Meta ad campaigns strictly focused on ROI.',
                'Funnels, email and WhatsApp automations for lead nurturing.',
              ].map((point, index) => (
                <div
                  key={index}
                  className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100"
                >
                  <FaCheckCircle className="text-emerald-500 mr-4 mt-1 text-xl flex-shrink-0" />
                  <p className="text-slate-700 font-semibold">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              {
                icon: <FaRocket />,
                title: 'Faster Growth',
                desc: 'Launch campaigns and digital assets faster with one coordinated team.',
              },
              {
                icon: <FaBullseye />,
                title: 'Better Targeting',
                desc: 'Everything is aligned strictly around your audience and business goals.',
              },
              {
                icon: <FaUsers />,
                title: 'Unified Execution',
                desc: 'No need to manage multiple scattered freelancers for dev and marketing.',
              },
              {
                icon: <FaChartLine />,
                title: 'Measurable Results',
                desc: 'Track performance through lead quality, conversion rate and growth metrics.',
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 4. DYNAMIC SERVICES STACK --- */}
      <section className="py-24 px-6 bg-[#f8fafc] border-y border-slate-200 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                Our Service Stack
              </h2>
              <p className="text-slate-500 text-lg font-medium">
                Explore the core systems and specialized services available
                through GROWZYBYTES.
              </p>
            </div>
            <div className="text-sm font-bold bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm text-blue-600">
              Showing {filteredServices.length}{' '}
              {filteredServices.length === 1 ? 'Service' : 'Services'}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10 sticky top-4 z-30">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition duration-300 ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadingServices ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-blue-600 rounded-full"></div>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={fadeUp}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition duration-300 shadow-inner">
                      {service.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded-md">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow font-medium">
                    {service.desc}
                  </p>

                  <div className="space-y-3 mb-8">
                    {service.points?.slice(0, 4).map((point, index) => (
                      <div key={index} className="flex items-start">
                        <FaCheckCircle className="text-blue-500 mr-3 mt-1 text-sm flex-shrink-0" />
                        <p className="text-sm text-slate-700 font-semibold">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <Link
                      to="/contact"
                      className="text-slate-900 hover:text-blue-600 font-black text-sm inline-flex items-center transition"
                    >
                      Discuss This <FaArrowRight className="ml-2" />
                    </Link>

                    {service.isDynamic && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                        Admin Added
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* --- 5. HOW WE DELIVER --- */}
      <section className="py-24 px-6 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black">
              How Our Service Delivery Works
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
              Clear process, faster execution and zero confusion for your team.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {processSteps.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 hover:border-blue-500/50 transition duration-300 relative group overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 text-7xl font-black text-white/5 group-hover:text-blue-500/10 transition duration-300">
                  {item.step}
                </div>
                <div className="text-xs font-black tracking-[0.2em] text-blue-400 mb-4 uppercase">
                  STAGE {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 6. INDUSTRIES + TOOLS --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-2 bg-blue-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
            <h3 className="text-3xl font-black mb-4 relative z-10">
              Industries We Support
            </h3>
            <p className="text-blue-100 mb-10 relative z-10 font-medium">
              Our service frameworks adapt perfectly to different business
              models and complex customer journeys.
            </p>

            <div className="flex flex-wrap gap-3 relative z-10">
              {industries.map((industry, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-bold shadow-sm"
                >
                  {industry}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="xl:col-span-3">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                Tools & Channels We Use
              </h2>
              <p className="text-slate-500 text-lg max-w-xl font-medium">
                We combine advanced development tools, ad platforms and
                communication systems to deliver complete execution.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              {toolStack.map((tool, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center hover:bg-white hover:shadow-lg hover:border-blue-200 transition duration-300"
                >
                  <div className="text-4xl text-slate-700 mb-4 flex justify-center transition-colors duration-300">
                    {tool.icon}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    {tool.label}
                  </h4>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 7. CASE STUDIES --- */}
      <section className="py-24 px-6 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Recent Service Results
              </h2>
              <p className="text-slate-500 mt-4 text-lg font-medium">
                Proof-driven outcomes that show how our services translate into
                real business revenue.
              </p>
            </div>
            <Link
              to="/projects"
              className="text-sm font-bold text-white bg-slate-900 hover:bg-blue-600 px-8 py-4 rounded-full flex items-center transition shadow-lg whitespace-nowrap"
            >
              Explore Portfolio <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-blue-600 rounded-full"></div>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {(projects.length > 0 ? projects : fallbackProjects).map(
                (project, idx) => (
                  <motion.div
                    key={project._id || idx}
                    variants={fadeUp}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-500 flex flex-col group"
                  >
                    <div className="h-60 overflow-hidden bg-slate-100 relative">
                      <img
                        src={
                          project.imageUrl ||
                          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80'
                        }
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition duration-500"></div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <span className="inline-flex w-max bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md mb-4 border border-blue-100">
                        {project.category || 'Project'}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition">
                        {project.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium flex-grow line-clamp-3">
                        {project.description || project.desc}
                      </p>
                      <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <span className="text-sm font-black text-emerald-600 flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                          <FaChartLine className="mr-2" />{' '}
                          {project.result || 'Successful'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* --- 8. PRICING / PACKAGES --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Flexible Engagement Models
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg font-medium">
              Start small, scale later or choose a full-service model based on
              your immediate goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {[
              {
                label: 'Starter',
                badge: 'Small businesses',
                desc: 'Best for brands starting with one main service.',
                items: [
                  'Single service focus',
                  'Basic monthly reporting',
                  'Setup + optimization',
                ],
                featured: false,
              },
              {
                label: 'Growth',
                badge: 'Most popular',
                desc: 'Best for businesses ready to combine dev and marketing.',
                items: [
                  'Multi-service strategy',
                  'Weekly optimization',
                  'Funnels + reporting',
                ],
                featured: true,
              },
              {
                label: 'Scale',
                badge: 'Advanced teams',
                desc: 'Best for brands wanting a dedicated execution partner.',
                items: [
                  'Custom full stack',
                  'Deep analytics setup',
                  'Dedicated growth squad',
                ],
                featured: false,
              },
            ].map((plan, idx) => (
              <motion.div
                key={plan.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: idx * 0.15 }}
                className={`rounded-[2rem] p-10 border ${
                  plan.featured
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/20 transform md:-translate-y-4 relative'
                    : 'bg-white text-slate-900 border-slate-200 shadow-lg'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Recommended
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-black">{plan.label}</h3>
                </div>
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide mb-6 ${
                    plan.featured
                      ? 'bg-slate-800 text-blue-400'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {plan.badge}
                </span>
                <p
                  className={`text-sm mb-8 pb-8 border-b ${
                    plan.featured
                      ? 'text-slate-400 border-slate-700'
                      : 'text-slate-500 border-slate-100'
                  }`}
                >
                  {plan.desc}
                </p>
                <div className="space-y-5 mb-10 font-semibold">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-start">
                      <FaCheckCircle
                        className={`mr-3 mt-1 text-lg flex-shrink-0 ${
                          plan.featured ? 'text-blue-500' : 'text-emerald-500'
                        }`}
                      />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className={`w-full inline-flex justify-center py-4 rounded-xl font-bold transition duration-300 ${
                    plan.featured
                      ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Discuss Plan
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 9. FAQ --- */}
      <section className="py-24 px-6 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 mt-4 text-lg font-medium">
              Everything you need to know about our service models.
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
                transition={{ delay: index * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  activeFaq === index
                    ? 'border-blue-500 bg-blue-50/30 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-lg pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    className="text-blue-600 bg-blue-50 p-2 rounded-full flex-shrink-0"
                  >
                    <FaChevronDown />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-slate-600 leading-relaxed font-medium"
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

      {/* --- 10. FINAL CTA --- */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
            Need a custom mix for your business?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Tell us your goal, current setup and target audience. We’ll map out
            the exact combination of development, marketing and automation
            services you need.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-700 font-black py-5 px-10 rounded-full transition duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-lg"
            >
              Start Your Project <FaArrowRight className="ml-3" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center border-2 border-slate-500 hover:border-white text-white font-bold py-5 px-10 rounded-full transition duration-300 text-lg"
            >
              Learn About GROWZYBYTES
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;
