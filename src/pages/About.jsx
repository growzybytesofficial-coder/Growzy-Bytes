import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';
import founderImage from '../assets/bhupendra-founder-2.jpg';
import creativeLeadImage from '../assets/Druhi.jpeg';
import techLeadImage from '../assets/Shiva.png';
import performanceMarketerImage from '../assets/Anisha.png';

import {
  FaCheckCircle,
  FaQuoteLeft,
  FaBullseye,
  FaRocket,
  FaUsers,
  FaChartLine,
  FaLaptopCode,
  FaMobileAlt,
  FaHandshake,
  FaLightbulb,
  FaGlobe,
  FaAward,
  FaArrowRight,
  FaHeadset,
} from 'react-icons/fa';

const fallbackAbout = {
  badge: 'About GROWZYBYTES',
  title: 'We Build Growth Systems, Not Just Websites.',
  subtitle:
    'GROWZYBYTES is a modern digital growth agency helping brands scale with web development, app development, SEO, paid ads, funnels, automation and conversion-focused execution.',
  story:
    'We started GROWZYBYTES with one clear mission: help businesses grow faster with smart strategy, clean design, high-performing code and measurable marketing. Instead of treating development and marketing as separate services, we combine both so your brand gets one unified growth engine.',
  founderNote:
    'Our focus is simple: clarity, speed, execution and real business outcomes. Every project we take on is built around lead generation, user experience and long-term scalability.',
  years: '5+',
  clients: '120+',
  projects: '180+',
  countries: '8+',
};

const fallbackStats = [
  { number: '180+', label: 'Projects Completed' },
  { number: '120+', label: 'Happy Clients' },
  { number: '12M+', label: 'Leads Generated' },
  { number: '5+', label: 'Years Experience' },
];

const fallbackValues = [
  {
    icon: <FaHandshake />,
    title: 'Transparency',
    desc: 'No fake promises, no confusing reports and no hidden work. We keep communication and execution clear.',
  },
  {
    icon: <FaLightbulb />,
    title: 'Innovation',
    desc: 'We mix modern tech, creative thinking and growth strategy to build smarter digital systems.',
  },
  {
    icon: <FaBullseye />,
    title: 'Results First',
    desc: 'Every website, campaign and funnel is built to move real business metrics like leads, sales and retention.',
  },
  {
    icon: <FaHeadset />,
    title: 'Client Support',
    desc: 'We work like an extension of your team and stay available for updates, optimization and support.',
  },
];

const fallbackServices = [
  {
    icon: <FaLaptopCode />,
    title: 'Web Development',
    desc: 'High-converting business websites, landing pages, admin panels and custom web applications.',
  },
  {
    icon: <FaMobileAlt />,
    title: 'App Development',
    desc: 'Modern mobile and web apps built for scale, usability and business automation.',
  },
  {
    icon: <FaRocket />,
    title: 'SEO & Organic Growth',
    desc: 'Technical SEO, content strategy and authority building focused on long-term visibility.',
  },
  {
    icon: <FaChartLine />,
    title: 'Performance Marketing',
    desc: 'Google Ads, Meta Ads and funnel-based campaigns focused on ROI and lead quality.',
  },
];

const fallbackIndustries = [
  'E-commerce & D2C',
  'Real Estate',
  'Education & Coaching',
  'Healthcare',
  'Local Service Businesses',
  'Startups & SaaS',
];

const fallbackProcess = [
  {
    step: '01',
    title: 'Research & Audit',
    desc: 'We study your business, audience, market and current digital gaps.',
  },
  {
    step: '02',
    title: 'Strategy & Planning',
    desc: 'We map goals, pages, funnels, channels, tracking and content direction.',
  },
  {
    step: '03',
    title: 'Build & Launch',
    desc: 'We design, develop, test and deploy with performance and responsiveness in mind.',
  },
  {
    step: '04',
    title: 'Optimize & Scale',
    desc: 'We analyze data, improve conversion points and scale what is working.',
  },
];

const fallbackTimeline = [
  {
    year: '2021',
    title: 'GROWZYBYTES Started',
    desc: 'Began with web development and local business marketing projects.',
  },
  {
    year: '2022',
    title: 'Expanded Services',
    desc: 'Added SEO, paid advertising and conversion-focused landing pages.',
  },
  {
    year: '2024',
    title: 'Full Growth Stack',
    desc: 'Started handling websites, apps, ads, funnels and automations under one roof.',
  },
  {
    year: '2026',
    title: 'Scaling With Systems',
    desc: 'Focused on building dynamic, measurable and admin-controlled client platforms.',
  },
];

const fallbackTeam = [
  {
    name: 'Bhupendra Verma',
    role: 'Founder & Growth Strategist',
    image: founderImage,
    bio: 'Leads strategy, growth planning and client success across development and marketing.',
  },
  {
    name: 'Creative Lead',
    role: 'UI/UX & Brand Design',
    image: creativeLeadImage,
    bio: 'Designs modern interfaces, landing pages and visual systems that improve trust and conversion.',
  },
  {
    name: 'Tech Lead',
    role: 'Web & App Development',
    image: techLeadImage,
    bio: 'Builds fast, scalable products using modern frontend and backend technologies.',
  },
  {
    name: 'Performance Marketer',
    role: 'Ads & Analytics',
    image: performanceMarketerImage,  
    bio: 'Handles paid media, conversion tracking, reporting and campaign optimization.',
  },
];

const fallbackTestimonials = [
  {
    name: 'Ankit Sharma',
    company: 'D2C Brand Founder',
    quote:
      'GROWZYBYTES helped us improve both our website performance and our ad results. It felt like working with one smart in-house growth team.',
  },
  {
    name: 'Neha Gupta',
    company: 'Education Brand',
    quote:
      'The clarity in execution was impressive. From landing pages to lead generation, everything was aligned to business results.',
  },
  {
    name: 'Rahul Verma',
    company: 'Local Services Business',
    quote:
      'Our online presence completely changed after working with GROWZYBYTES. Better design, better leads and better follow-up systems.',
  },
];

const fallbackHeroImage =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80';

const About = () => {
  const [aboutData, setAboutData] = useState(fallbackAbout);
  const [stats, setStats] = useState(fallbackStats);
  const [team, setTeam] = useState(fallbackTeam);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [bannerImg, setBannerImg] = useState('');
  const [loading, setLoading] = useState(true);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const renderStyledTitle = (title) => {
    if (!title?.includes('Not Just')) return title;
    const parts = title.split('Not Just');
    return (
      <>
        {parts[0]}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Not Just{parts[1]}
        </span>
      </>
    );
  };

  useEffect(() => {
    const fetchAboutPageData = async () => {
      try {
        const [aboutRes, teamRes, testimonialRes, pageImagesRes] = await Promise.allSettled([
          api.get('/about'),
          api.get('/team'),
          api.get('/testimonials'),
          api.get('/pageImages'),
        ]);

        if (aboutRes.status === 'fulfilled' && aboutRes.value?.data) {
          const data = aboutRes.value.data;
          setAboutData((prev) => ({ ...prev, ...data }));
          if (Array.isArray(data.stats) && data.stats.length > 0) setStats(data.stats);
        }

        if (teamRes.status === 'fulfilled' && Array.isArray(teamRes.value?.data) && teamRes.value.data.length > 0) {
          setTeam(teamRes.value.data);
        }

        if (testimonialRes.status === 'fulfilled' && Array.isArray(testimonialRes.value?.data) && testimonialRes.value.data.length > 0) {
          setTestimonials(testimonialRes.value.data);
        }

        if (pageImagesRes.status === 'fulfilled' && Array.isArray(pageImagesRes.value?.data)) {
          const aboutBanner = pageImagesRes.value.data.find(
            (img) => img?.title?.toLowerCase() === 'about' || img?.page?.toLowerCase() === 'about'
          );
          if (aboutBanner?.imageUrl) setBannerImg(aboutBanner.imageUrl);
        }
      } catch (error) {
        console.error('About page fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPageData();
  }, []);

  const heroImg = bannerImg || fallbackHeroImage;
  const teamFallback =
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80';

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden selection:bg-blue-600 selection:text-white">
      <section
        className="relative text-white pt-32 pb-24 px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroImg}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/85 to-slate-900/90 z-0"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/25 blur-[100px] rounded-full mix-blend-screen z-0"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/25 blur-[100px] rounded-full mix-blend-screen z-0"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
              {aboutData.badge}
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
              {renderStyledTitle(aboutData.title)}
            </h1>

            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10 max-w-2xl font-light">
              {aboutData.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] group"
              >
                Let’s Work Together
                <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/projects"
                className="inline-flex items-center justify-center border-2 border-slate-500 hover:border-white hover:bg-white hover:text-slate-900 text-white font-bold py-4 px-10 rounded-full transition duration-300"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition duration-500 z-10"></div>
              <img
                src={heroImg}
                alt="GROWZYBYTES workspace and team"
                className="w-full h-[450px] md:h-[600px] object-cover object-center transform group-hover:scale-105 transition duration-700"
                loading="eager"
              />
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-8 left-4 md:left-[-30px] bg-white text-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-100 z-20"
            >
              <h3 className="text-4xl md:text-5xl font-black text-blue-600 mb-1">
                {aboutData.years}
              </h3>
              <p className="text-sm md:text-base text-slate-600 font-bold uppercase tracking-widest">
                Years of Excellence
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-4xl md:text-6xl font-black mb-2">{item.number}</h3>
              <p className="text-blue-200 uppercase tracking-widest text-xs md:text-sm font-bold">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              The Backstory
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
              We are the architects of your digital growth.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
              {aboutData.story}
            </p>
            <p className="text-slate-500 leading-relaxed mb-10">{aboutData.founderNote}</p>

            <ul className="space-y-5">
              {[
                '100% transparency in communication and execution',
                'Result-oriented marketing and development systems',
                'Modern web, app and performance growth stack',
                'Dedicated support for long-term scaling',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start text-slate-800 text-base md:text-lg font-semibold bg-slate-50 p-4 rounded-xl border border-slate-100"
                >
                  <FaCheckCircle className="text-emerald-500 mr-4 mt-1 text-xl flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
                icon: <FaBullseye />,
                title: 'Mission',
                desc: 'To help brands grow faster with strategy, technology and measurable marketing execution.',
              },
              {
                icon: <FaGlobe />,
                title: 'Vision',
                desc: 'To become a trusted digital growth partner for businesses that want systems, not guesswork.',
              },
              {
                icon: <FaAward />,
                title: 'Standard',
                desc: 'We focus on premium execution, fast delivery and solutions that are built to scale.',
              },
              {
                icon: <FaUsers />,
                title: 'Culture',
                desc: 'Collaborative, honest and performance-driven work with clients treated like long-term partners.',
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-6">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Our Core Values</h2>
            <p className="text-slate-500 mt-5 max-w-2xl mx-auto text-lg font-medium">
              The principles that guide every strategy, every design and every campaign we deliver.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {fallbackValues.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="bg-white rounded-3xl border border-slate-200 p-10 shadow-md hover:shadow-xl transition duration-300 group"
              >
                <div className="text-4xl text-blue-600 mb-6 bg-blue-50 w-20 h-20 flex justify-center items-center rounded-full group-hover:scale-110 transition duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-12 lg:gap-16">
          <div className="xl:col-span-3">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                What GROWZYBYTES Brings to the Table
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl font-medium">
                We merge development, design and growth marketing so your brand gets one connected execution team.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {fallbackServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-lg transition group"
                >
                  <div className="text-4xl text-blue-600 mb-5 group-hover:scale-110 transition origin-left">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-2 bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>

            <h3 className="text-3xl font-black mb-6 relative z-10">Industries We Scale</h3>
            <p className="text-slate-400 mb-10 relative z-10 text-lg">
              We work with growth-minded brands that demand better systems, stronger positioning and measurable outcomes.
            </p>

            <div className="flex flex-wrap gap-3 relative z-10">
              {fallbackIndustries.map((industry, index) => (
                <div
                  key={index}
                  className="bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-5 py-2.5 text-sm font-bold text-blue-100 shadow-sm hover:bg-blue-600 transition cursor-pointer"
                >
                  {industry}
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
              <p className="text-sm text-slate-400 mb-5">
                Looking for a team that understands both code and conversions?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center font-black text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full transition shadow-lg shadow-blue-500/30"
              >
                Talk to GROWZYBYTES <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white">How We Work</h2>
            <p className="text-slate-400 mt-5 max-w-2xl mx-auto text-lg">
              Our proven workflow keeps strategy, design, development and growth perfectly aligned from day one.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {fallbackProcess.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition duration-300 relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 text-7xl font-black text-white/5 group-hover:text-blue-500/10 transition duration-300">
                  {item.step}
                </div>
                <div className="text-sm font-black tracking-widest text-blue-400 mb-4 uppercase">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Our Journey</h2>
            <p className="text-slate-500 mt-5 text-lg">
              How GROWZYBYTES evolved from service execution to complete growth systems.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 relative before:absolute before:inset-0 before:ml-5 md:before:ml-[110px] before:-translate-x-px before:w-1 before:bg-gradient-to-b before:from-blue-600 before:to-purple-600"
          >
            {fallbackTimeline.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="hidden md:block w-[110px] shrink-0 text-right pr-8 text-3xl font-black text-blue-600 pt-1">
                  {item.year}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-600 shrink-0 z-10 ml-0 md:ml-0 md:mr-8 md:group-odd:ml-8 md:group-odd:mr-0"></div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-4rem)] bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition -mt-2">
                  <div className="md:hidden text-2xl font-black text-blue-600 mb-2">{item.year}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Meet the Engine</h2>
            <p className="text-slate-500 mt-5 max-w-2xl mx-auto text-lg">
              The strategists, developers, and marketers executing your day-to-day growth.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10"
            >
              {team.map((member, index) => (
                <motion.div
                  key={member._id || index}
                  variants={fadeUp}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group"
                >
                  <div className="relative h-80 bg-slate-200 overflow-hidden">
                    <img
                      src={member.image || member.imageUrl || teamFallback}
                      alt={member.name}
                      className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition duration-500 transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-black text-slate-900">{member.name}</h3>
                    <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mt-2 mb-4">
                      {member.role}
                    </p>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {member.bio || member.description || 'Dedicated to GROWZYBYTES growth-first execution.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">What Clients Say</h2>
            <p className="text-slate-500 mt-5 max-w-2xl mx-auto text-lg">
              Long-term growth comes from trust, execution and outcomes that clients can actually feel.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={item._id || index}
                variants={fadeUp}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition duration-300 relative"
              >
                <FaQuoteLeft className="text-5xl text-blue-100 absolute top-8 right-8" />
                <p className="text-slate-700 leading-relaxed mb-8 relative z-10 text-lg italic font-medium">
                  "{item.quote || item.message}"
                </p>
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-black text-slate-900 text-lg">{item.name}</h4>
                  <p className="text-sm text-blue-600 font-bold uppercase tracking-wide mt-1">
                    {item.company || item.role || 'Client'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
            Ready to trigger your next phase of growth?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Whether you need a high-speed website, a scalable web app, or a data-driven marketing funnel, GROWZYBYTES is fully equipped to build it with you.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-700 font-black py-5 px-10 rounded-full transition duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] text-lg"
            >
              Start Your Project <FaArrowRight className="ml-3" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center border-2 border-slate-500 hover:border-white text-white font-bold py-5 px-10 rounded-full transition duration-300 text-lg"
            >
              Explore Our Services
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;