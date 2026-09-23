import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import founderImage from '../assets/bhupendra-founder-2.jpg';
import {
  FaRocket,
  FaChartLine,
  FaLaptopCode,
  FaBullseye,
  FaSearch,
  FaFacebookF,
  FaEnvelopeOpenText,
  FaArrowRight,
  FaQuoteLeft,
  FaReact,
  FaNodeJs,
  FaAws,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaChevronDown,
  FaHandshake,
} from 'react-icons/fa';
import {
  SiMongodb,
  SiShopify,
  SiWordpress,
  SiGoogleanalytics,
  SiZapier,
} from 'react-icons/si';

const fallbackHeroImage =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80';

const fallbackProjectImage =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';

const fallbackFounderImage =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80';

const stats = [
  { number: '150+', label: 'Projects Delivered' },
  { number: '98%', label: 'Client Retention' },
  { number: '10M+', label: 'Leads Generated' },
  { number: '5+', label: 'Years Experience' },
];

const services = [
  {
    icon: <FaLaptopCode />,
    title: 'Web Development',
    desc: 'Custom MERN stack websites and landing pages engineered for blazing speed and high conversion rates.',
  },
  {
    icon: <FaSearch />,
    title: 'SEO & Organic Growth',
    desc: 'Technical SEO, high-authority link building, and content strategies to dominate Google search results.',
  },
  {
    icon: <FaChartLine />,
    title: 'Performance Ads',
    desc: 'Data-driven Meta & Google Ads campaigns with rigorous A/B testing to maximize your ROAS.',
  },
  {
    icon: <FaEnvelopeOpenText />,
    title: 'Email Automations',
    desc: 'Advanced email sequences and WhatsApp funnels designed to recover carts and increase LTV.',
  },
];

const tools = [
  { icon: <FaReact />, name: 'React.js', color: 'hover:text-[#61DBFB]' },
  { icon: <FaNodeJs />, name: 'Node.js', color: 'hover:text-[#68A063]' },
  { icon: <SiMongodb />, name: 'MongoDB', color: 'hover:text-[#4DB33D]' },
  { icon: <FaAws />, name: 'AWS', color: 'hover:text-[#FF9900]' },
  { icon: <SiShopify />, name: 'Shopify', color: 'hover:text-[#96bf48]' },
  { icon: <SiWordpress />, name: 'WordPress', color: 'hover:text-[#21759b]' },
  { icon: <SiGoogleanalytics />, name: 'GA4', color: 'hover:text-[#F4B400]' },
  { icon: <FaFacebookF />, name: 'Meta Ads', color: 'hover:text-[#1877F2]' },
  { icon: <SiZapier />, name: 'Zapier', color: 'hover:text-[#FF4A00]' },
];

const pricingPlans = [
  {
    label: 'Starter',
    badge: 'Early-stage',
    desc: 'Testing channels & getting first predictable results.',
    bullets: ['1–2 primary services', 'Landing page optimisation', 'Monthly reporting'],
    highlight: false,
  },
  {
    label: 'Growth',
    badge: 'Most popular',
    desc: 'For brands with product-market fit scaling aggressively.',
    bullets: ['Multi-channel strategy', 'Funnel building & CRM', 'Weekly performance reviews'],
    highlight: true,
  },
  {
    label: 'Scale',
    badge: 'Serious spenders',
    desc: 'For teams spending big needing a dedicated outsourced CMO.',
    bullets: ['Dedicated growth squad', 'Advanced tracking setup', 'Custom CRO roadmap'],
    highlight: false,
  },
];

const faqs = [
  {
    question: 'How soon can we start seeing results?',
    answer:
      'For performance marketing (Ads), you can see initial traction within 7-14 days. For SEO and organic growth, it typically takes 3-6 months to build sustainable momentum.',
  },
  {
    question: 'Do you work with startups or established brands?',
    answer:
      'Both! Our Starter and Growth plans are perfect for funded startups looking for product-market fit, while our Scale plan acts as an outsourced CMO for 7-8 figure brands.',
  },
  {
    question: 'Do you offer custom web development?',
    answer:
      'Yes. We build high-speed, scalable applications using the MERN stack customized entirely to your business needs.',
  },
  {
    question: 'Will I have a dedicated account manager?',
    answer:
      "Absolutely. You won't be passed around. You'll get a dedicated lead strategist and a direct WhatsApp or Slack channel with our core team.",
  },
];

const defaultCaseStudies = [
  {
    title: 'TechNova App Build',
    category: 'App Dev',
    description:
      'Built a scalable MERN stack application for a rising startup, improving load speeds by 60%.',
    imageUrl: fallbackProjectImage,
    liveLink: '',
  },
  {
    title: 'UrbanWear E-Comm',
    category: 'Marketing',
    description:
      'Scaled monthly revenue from ₹5L to ₹25L using Meta dynamic ads and CRO strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
    liveLink: '',
  },
  {
    title: 'GlobalEstates SEO',
    category: 'SEO',
    description:
      'Ranked on page 1 for 15+ highly competitive real estate keywords in just 4 months.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    liveLink: '',
  },
];

const sortByDateDesc = (items = []) =>
  [...items].sort((a, b) => {
    const aDate = new Date(a?.createdAt || 0).getTime();
    const bDate = new Date(b?.createdAt || 0).getTime();
    return bDate - aDate;
  });

const Home = () => {
  const navigate = useNavigate();

  const [bannerImg, setBannerImg] = useState('');
  const [latestProjects, setLatestProjects] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [quickEmail, setQuickEmail] = useState('');
  const [quickSubmitStatus, setQuickSubmitStatus] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [founderSrc, setFounderSrc] = useState(founderImage);

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      },
    }),
    []
  );

  const staggerContainer = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
      },
    }),
    []
  );

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [projectsRes, blogsRes, pageImagesRes] = await Promise.allSettled([
          api.get('/projects'),
          api.get('/blogs'),
          api.get('/pageImages'),
        ]);

        if (projectsRes.status === 'fulfilled') {
          const resVal = projectsRes.value?.data;
          let list = [];
          if (Array.isArray(resVal)) {
            list = resVal;
          } else if (resVal?.data?.projects && Array.isArray(resVal.data.projects)) {
            list = resVal.data.projects;
          } else if (resVal?.projects && Array.isArray(resVal.projects)) {
            list = resVal.projects;
          }
          setLatestProjects(sortByDateDesc(list).slice(0, 3));
        }

        if (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value?.data)) {
          setLatestBlogs(sortByDateDesc(blogsRes.value.data).slice(0, 3));
        }

        if (pageImagesRes.status === 'fulfilled' && Array.isArray(pageImagesRes.value?.data)) {
          const banner = pageImagesRes.value.data.find(
            (img) => img?.title?.toLowerCase() === 'home' || img?.page?.toLowerCase() === 'home'
          );

          if (banner?.imageUrl || banner?.image) {
            setBannerImg(banner.imageUrl || banner.image);
          }
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoadingProjects(false);
        setLoadingBlogs(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    const cleanedEmail = quickEmail.trim();
    if (!cleanedEmail) return;

    setQuickSubmitStatus('submitting');

    try {
      await api.post('/leads', {
        name: 'Quick Roadmap Request',
        email: cleanedEmail,
        phone: 'Not provided',
        company: '',
        website: '',
        service: 'Quick Roadmap Request',
        budget: '',
        timeline: '',
        message: 'Requested from Home Page Top Strip.',
      });

      setQuickSubmitStatus('success');
      setQuickEmail('');
      setTimeout(() => setQuickSubmitStatus(''), 4000);
    } catch (error) {
      console.error('Quick lead submit failed:', error);
      setQuickSubmitStatus('error');
      setTimeout(() => setQuickSubmitStatus(''), 4000);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans overflow-hidden selection:bg-blue-600 selection:text-white">
      <section
        className="relative text-white pt-32 pb-40 px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bannerImg || fallbackHeroImage}')` }}
      >
        <div className="absolute inset-0 bg-slate-950/75 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-950/85 to-slate-900/90 z-0"></div>
        <div className="absolute top-0 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob z-0"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000 z-0"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-blue-200 text-sm font-bold uppercase tracking-widest mb-8 backdrop-blur-sm"
          >
            <FaRocket className="text-blue-400" /> Award Winning Digital Agency
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1]">
            Scale Your Brand With <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              GROWZYBYTES
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            We don&apos;t just build websites; we build{' '}
            <strong className="text-white font-semibold">digital revenue engines</strong>. From
            high-converting Web Development to data-driven Performance Marketing.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] text-lg transition duration-300 flex items-center group"
            >
              Get Your Free Audit
              <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/projects"
              className="bg-transparent border-2 border-slate-600 hover:border-white hover:bg-white hover:text-slate-900 text-white font-bold py-4 px-10 rounded-full text-lg transition duration-300"
            >
              View Case Studies
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg
            className="relative block w-full h-[50px] md:h-[100px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.82,198.39,108.57,239.65,99.55,280.4,80.6,321.39,56.44Z"
              className="fill-[#f8fafc]"
            />
          </svg>
        </div>
      </section>

      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBullseye className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Want a free growth roadmap?</h3>
              <p className="text-slate-500 text-sm">
                Drop your email and our experts will contact you.
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickSubmit} className="flex w-full md:w-auto relative">
            <input
              type="email"
              placeholder="Your work email..."
              required
              value={quickEmail}
              onChange={(e) => setQuickEmail(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm px-5 py-3 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition placeholder-slate-400 font-medium"
            />
            <button
              type="submit"
              disabled={quickSubmitStatus === 'submitting'}
              className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-r-xl text-sm font-bold transition duration-300 disabled:bg-slate-400"
            >
              {quickSubmitStatus === 'submitting' ? 'Sending...' : 'Submit'}
            </button>
            {quickSubmitStatus === 'success' && (
              <span className="absolute -bottom-6 right-2 text-emerald-500 text-xs font-bold">
                Request received successfully!
              </span>
            )}
            {quickSubmitStatus === 'error' && (
              <span className="absolute -bottom-6 right-2 text-red-500 text-xs font-bold">
                Failed. Try Contact Form.
              </span>
            )}
          </form>
        </div>
      </section>

      <section className="py-24 px-6 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
          >
            <h4 className="text-red-500 font-bold tracking-widest uppercase mb-3 text-sm flex items-center">
              <FaExclamationTriangle className="mr-2" /> The Revenue Leak
            </h4>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Are you losing customers because of a poor digital setup?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Most businesses have a fragmented strategy. A beautiful website that doesn&apos;t
              convert, or expensive ads sending traffic to a slow page. This creates a massive
              revenue leak.
            </p>
            <ul className="space-y-4">
              {[
                'Spending thousands on Ads but getting low-quality leads.',
                'Website takes more than 3 seconds to load, killing your SEO.',
                'No retargeting funnel to bring back abandoned visitors.',
                'Working with scattered freelancers instead of a unified team.',
              ].map((point, i) => (
                <li
                  key={i}
                  className="flex items-start bg-white p-3 rounded-lg border border-slate-100 shadow-sm"
                >
                  <div className="mt-0.5 mr-3 text-red-400">
                    <FaExclamationTriangle />
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 rounded-bl-full opacity-20"></div>
            <h3 className="text-3xl font-bold mb-6 flex items-center">
              <FaHandshake className="mr-3 text-blue-400" /> The Techvera Fix
            </h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              We plug the leaks by building a cohesive digital ecosystem. Fast MERN stack code,
              persuasive copy, and laser-targeted media buying all managed under one roof.
            </p>

            <div className="space-y-4">
              <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-xl border border-slate-700 flex justify-between items-center hover:border-blue-500 transition">
                <span className="font-semibold">Average Conversion Lift</span>
                <span className="text-emerald-400 font-bold flex items-center text-xl">
                  +45% <FaChartLine className="ml-2" />
                </span>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-xl border border-slate-700 flex justify-between items-center hover:border-blue-500 transition">
                <span className="font-semibold">Cost Per Acquisition</span>
                <span className="text-emerald-400 font-bold flex items-center text-xl">
                  -30% <FaChartLine className="ml-2 transform scale-y-[-1]" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-5xl md:text-6xl font-black mb-2">{stat.number}</h3>
              <p className="text-blue-200 font-bold uppercase tracking-widest text-xs md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto bg-[#f8fafc]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            End-to-End Digital Solutions
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          <p className="text-slate-500 mt-6 text-lg max-w-2xl mx-auto">
            Everything your brand needs to scale, designed, developed, and managed by one expert
            team.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-2 transition duration-300 border border-slate-100 group flex flex-col items-center text-center"
            >
              <div className="text-4xl text-blue-600 mb-6 bg-blue-50 w-20 h-20 flex items-center justify-center rounded-full group-hover:bg-blue-600 group-hover:text-white transition duration-300 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-extrabold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-slate-900 py-24 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Growth Arsenal</h2>
          <p className="text-slate-400 mb-16 max-w-2xl mx-auto">
            We leverage enterprise-grade technologies to ensure your code is robust and your
            marketing is strictly data-backed.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-slate-400">
            {tools.map((tool, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`flex flex-col items-center justify-center p-5 bg-slate-800 rounded-2xl border border-slate-700 w-28 md:w-36 transition duration-300 cursor-pointer ${tool.color}`}
              >
                <div className="text-4xl mb-3 transition-colors duration-300">{tool.icon}</div>
                <span className="text-xs font-bold tracking-wider">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Our Latest Masterpieces
              </h2>
              <p className="text-slate-500 mt-4 text-lg">
                See the high-converting websites and marketing campaigns we&apos;ve recently
                deployed from our system.
              </p>
            </div>

            <Link
              to="/projects"
              className="text-sm font-bold text-white bg-slate-900 hover:bg-blue-600 px-8 py-4 rounded-full flex items-center transition shadow-lg whitespace-nowrap"
            >
              View Full Portfolio <FaArrowRight className="ml-2" />
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
              {(latestProjects.length > 0 ? latestProjects : defaultCaseStudies).map(
                (project, index) => (
                  <motion.div
                    key={project._id || index}
                    variants={fadeUp}
                    className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden hover:shadow-2xl transition duration-500 flex flex-col group"
                  >
                    <div className="h-60 bg-slate-100 overflow-hidden relative">
                      <img
                        src={project.imageUrl || project.image || fallbackProjectImage}
                        alt={project.title || 'Project'}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackProjectImage;
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg">
                        {project.category || project.tag || 'Digital Campaign'}
                      </div>
                    </div>

                    <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition line-clamp-1">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                        {project.description || project.desc || 'Project details coming soon.'}
                      </p>

                      <div className="mt-auto">
                        {project.liveLink || project?.links?.live ? (
                          <a
                            href={project.liveLink || project?.links?.live}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center w-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold py-3.5 rounded-xl transition duration-300"
                          >
                            <FaExternalLinkAlt className="mr-2 text-sm" /> View Live Project
                          </a>
                        ) : (
                          <div className="flex items-center justify-center w-full bg-emerald-50 text-emerald-700 font-bold py-3.5 rounded-xl border border-emerald-100">
                            <FaCheckCircle className="mr-2" />
                            {project.result || 'Delivered Successfully'}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#165DFF] via-[#246BFD] to-[#155BFF] text-white py-24 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-black/10 blur-3xl rounded-full"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-105"></div>
                <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-full overflow-hidden border-[6px] border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.25)] bg-white/10">
                  <img
                    src={founderSrc}
                    alt="Bhupendra Verma - Founder"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      setFounderSrc(fallbackFounderImage);
                    }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <div className="text-white/20 text-6xl md:text-7xl mb-4 flex justify-center md:justify-start">
                <FaQuoteLeft />
              </div>

              <h3 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
                “Our goal isn&apos;t just to launch campaigns; it&apos;s to build sustainable
                revenue engines.”
              </h3>

              <p className="mt-6 text-blue-100/95 text-lg md:text-xl leading-relaxed max-w-2xl">
                At Techvera, we treat your business like our own. Every line of code we write and
                every ad dollar we spend is aggressively optimized for your bottom-line growth.
              </p>

              <div className="mt-8">
                <h4 className="text-2xl md:text-3xl font-bold text-white">Bhupendra Verma</h4>
                <p className="mt-2 text-sm md:text-base uppercase tracking-[0.25em] text-blue-200 font-semibold">
                  Founder & Lead Strategist
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-24 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Transparent Growth Plans
            </h2>
            <p className="text-slate-500 mt-5 max-w-2xl mx-auto text-lg">
              We customise each engagement around your current metrics, capacity, and aggressive
              future goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: index * 0.15 }}
                className={`rounded-[2rem] p-10 border ${
                  plan.highlight
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 transform md:-translate-y-4 relative'
                    : 'bg-white text-slate-900 border-slate-200 shadow-lg'
                } flex flex-col justify-between`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-black">{plan.label}</h3>
                  </div>

                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide mb-6 ${
                      plan.highlight ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {plan.badge}
                  </span>

                  <p
                    className={`text-sm mb-8 pb-8 border-b ${
                      plan.highlight
                        ? 'text-slate-400 border-slate-700'
                        : 'text-slate-500 border-slate-100'
                    }`}
                  >
                    {plan.desc}
                  </p>

                  <ul className="space-y-5 text-sm font-semibold">
                    {plan.bullets.map((b) => (
                      <li key={b} className="flex items-start">
                        <FaCheckCircle
                          className={`mr-3 mt-1 text-lg flex-shrink-0 ${
                            plan.highlight ? 'text-blue-500' : 'text-emerald-500'
                          }`}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/contact"
                  className={`mt-12 block text-center py-4 rounded-xl font-bold transition duration-300 ${
                    plan.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Request Proposal
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 mt-4">
              Everything you need to know before we start working together.
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
                    ? 'border-blue-500 bg-blue-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-lg pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    className="text-blue-600 bg-blue-50 p-2 rounded-full"
                  >
                    <FaChevronDown />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-slate-600 leading-relaxed overflow-hidden"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-extrabold text-white">Latest Industry Insights</h2>
              <p className="text-slate-400 mt-3">
                Actionable strategies and tips from our growth experts.
              </p>
            </div>

            <Link
              to="/blog"
              className="text-sm font-bold text-blue-400 hover:text-white flex items-center transition group"
            >
              Read all articles
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {loadingBlogs ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
            </div>
          ) : latestBlogs.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-slate-800/50 rounded-3xl border border-slate-700 border-dashed font-medium">
              New articles are being drafted. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id || index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.15 }}
                  className="bg-slate-800 border border-slate-700 shadow-lg rounded-3xl p-8 hover:border-blue-500 transition duration-300 flex flex-col cursor-pointer group"
                  onClick={() => navigate('/blog')}
                >
                  <span className="text-xs font-bold text-blue-400 mb-4 uppercase tracking-widest block">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Latest'}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition leading-tight line-clamp-2">
                    {blog.title || 'Untitled Blog'}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                    {blog.content || 'Blog preview not available.'}
                  </p>
                  <div className="mt-auto pt-5 border-t border-slate-700 flex justify-between items-center text-sm font-bold text-white group-hover:text-blue-400 transition">
                    <span>Read Article</span>
                    <FaArrowRight className="transform group-hover:translate-x-1 transition" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-blue-600 py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400 rounded-full opacity-50"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to turn clicks into clients?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Let&apos;s build a growth system that performs across web, search, paid media, and email.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-blue-700 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition shadow-2xl"
          >
            Start Your Project <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;