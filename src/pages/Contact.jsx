import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaLock,
  FaArrowRight, FaClock, FaGlobe, FaBullseye, FaRocket, FaWhatsapp,
  FaHeadset, FaShieldAlt, FaChartLine, FaLaptopCode, FaSearch,
  FaPaperPlane, FaBuilding, FaUserTie, FaQuestionCircle,
} from 'react-icons/fa';

const fallbackHeroImage = 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80';

const Contact = () => {
  const initialForm = {
    name: '', email: '', phone: '', company: '', website: '',
    service: '', budget: '', timeline: '', message: '',
  };

  const [bannerImg, setBannerImg] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [activeService, setActiveService] = useState('All');

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await api.get('/pageImages');
        const banner = Array.isArray(res.data)
          ? res.data.find(
              (img) => img?.title?.toLowerCase() === 'contact' || img?.page?.toLowerCase() === 'contact'
            )
          : null;

        if (banner?.imageUrl) {
          setBannerImg(banner.imageUrl);
        }
      } catch (error) {
        console.error('Contact banner fetch error:', error);
      }
    };
    fetchBanner();
  }, []);

  const services = [
    { title: 'Website Development', icon: <FaLaptopCode />, desc: 'Business websites, landing pages, responsive portals and modern frontend experiences.' },
    { title: 'SEO Growth', icon: <FaSearch />, desc: 'Technical SEO, content structure, keyword visibility and local search optimization.' },
    { title: 'Performance Marketing', icon: <FaChartLine />, desc: 'Google Ads, Meta Ads, lead generation funnels and conversion-focused campaign strategy.' },
    { title: 'Business Audit', icon: <FaBullseye />, desc: 'Website, funnel, traffic and brand growth audit with practical recommendations.' },
  ];

  const contactCards = [
    {
      title: 'Email Us',
      value: 'growzybytesofficial@gmail.com', // Changed to your real email
      sub: 'Best for detailed project discussions',
      icon: <FaEnvelope />,
      href: 'mailto:growzybytesofficial@gmail.com',
    },
    {
      title: 'Call Us',
      value: '+91 8445892456', // Update this to your real phone number!
      sub: 'For direct project consultation',
      icon: <FaPhoneAlt />,
      href: 'tel:+91 8445892456',
    },
    {
      title: 'WhatsApp',
      value: '+91 8445892456', // Update this to your real phone number!
      sub: 'Quick support and follow-up',
      icon: <FaWhatsapp />,
      href: 'https://wa.me/918445892456',
    },
    {
      title: 'Office Location',
      value: 'GROWZYBYTES, Agra, India',
      sub: 'Serving brands across India',
      icon: <FaMapMarkerAlt />,
      href: '#',
    },
  ];

  const processSteps = [
    { step: '01', title: 'Submit Your Request', desc: 'Share your business details, current bottleneck and project goals through the form.', icon: <FaPaperPlane /> },
    { step: '02', title: 'We Review Your Case', desc: 'We analyze your website, growth channels, offer positioning and conversion opportunities.', icon: <FaSearch /> },
    { step: '03', title: 'Strategy Discussion', desc: 'We connect with you for a focused consultation and recommend the right next steps.', icon: <FaUserTie /> },
    { step: '04', title: 'Execution Plan', desc: 'You receive a practical direction for website, SEO, ads or complete growth implementation.', icon: <FaRocket /> },
  ];

  const benefits = [
    { title: 'Fast Response', desc: 'We aim to review and respond to serious project inquiries quickly.', icon: <FaClock /> },
    { title: 'Confidential Discussion', desc: 'Your business data, goals and challenges stay private and secure.', icon: <FaShieldAlt /> },
    { title: 'Multi-Service Support', desc: 'Web development, SEO, ads and business growth support in one place.', icon: <FaHeadset /> },
  ];

  const trustStats = [
    { number: '24h', label: 'Typical Response Window' },
    { number: '1:1', label: 'Consultation Focus' },
    { number: '100%', label: 'Confidential Discussion' },
    { number: '4+', label: 'Growth Service Areas' },
  ];

  const faqs = [
    { q: 'What happens after I submit the form?', a: 'We review your information, understand the requirement and reach out with the next step or consultation schedule.' },
    { q: 'Can I contact you for website development only?', a: 'Yes, you can contact us for websites, SEO, ads, audits or complete digital growth support.' },
    { q: 'Do I need to have a website already?', a: 'No, you can contact us even if you are starting from scratch and need strategy plus development.' },
    { q: 'Is my information safe?', a: 'Yes, the page clearly communicates confidentiality and your submitted details are meant only for project communication.' },
  ];

  const quickTopics = [
    'Need a new business website', 'Website redesign and speed improvement', 'Want more leads from Google',
    'Need SEO support', 'Running ads but poor ROI', 'Need complete digital strategy',
  ];

  const officeHours = [
    { day: 'Monday - Friday', time: '10:00 AM - 7:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', time: 'By appointment only' },
  ];

  const filteredServices = useMemo(() => {
    if (activeService === 'All') return services;
    return services.filter((item) => item.title === activeService);
  }, [activeService]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const selectQuickTopic = (topic) => {
    setFormData((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${topic}` : topic,
    }));
  };

  const chooseService = (serviceName) => {
    setActiveService(serviceName);
    setFormData((prev) => ({ ...prev, service: serviceName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // Primary leads capture & notification endpoint
      await api.post('/leads', formData);
      setStatus({
        type: 'success',
        msg: 'Audit request received successfully! One of our growth experts will contact you shortly.',
      });
      setFormData(initialForm);
      setActiveService('All');
      setTimeout(() => {
        setStatus({ type: '', msg: '' });
      }, 5000);
    } catch (error) {
      console.warn('Primary /leads submission error, attempting fallback:', error?.message || error);
      try {
        // Fallback to /contact endpoint
        await api.post('/contact', formData);
        setStatus({
          type: 'success',
          msg: 'Audit request received successfully! One of our growth experts will contact you shortly.',
        });
        setFormData(initialForm);
        setActiveService('All');
        setTimeout(() => {
          setStatus({ type: '', msg: '' });
        }, 5000);
      } catch (fallbackError) {
        console.error('Contact submission final error:', fallbackError);
        const serverMsg =
          fallbackError?.response?.data?.message ||
          error?.response?.data?.message ||
          fallbackError?.response?.data?.error ||
          error?.response?.data?.error;
        setStatus({
          type: 'error',
          msg: serverMsg || 'Something went wrong. Please check your network or call us directly.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-hidden pb-24">
      {/* Hero */}
      <section
        className="relative text-white py-24 md:py-32 px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bannerImg || fallbackHeroImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/92 via-blue-950/88 to-gray-900/92"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-6">
            Contact GROWZYBYTES
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Apply For Your <span className="text-blue-400">Free Audit</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Tell us about your business, current growth bottleneck and project goals. We will review your case and guide you toward the right digital solution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              type="button"
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg transition inline-flex items-center"
            >
              Start Your Request <FaArrowRight className="ml-2" />
            </button>
            <a href="tel:+919000000000" className="border border-gray-500 hover:border-white text-white font-bold py-4 px-8 rounded-full text-lg transition">
              Call Directly
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {trustStats.map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }}>
              <h3 className="text-3xl md:text-5xl font-extrabold mb-2">{item.number}</h3>
              <p className="text-blue-100 uppercase tracking-wider text-xs md:text-sm font-semibold">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact methods */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">Multiple Ways to Reach Us</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-lg">Pick the communication method that fits your project urgency and style.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {contactCards.map((item, index) => (
              <motion.a key={item.title} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.06 }} className="bg-gray-50 rounded-3xl border border-gray-100 p-7 shadow-sm hover:shadow-xl transition block">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-900 font-semibold break-words">{item.value}</p>
                <p className="text-sm text-gray-600 mt-2">{item.sub}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">What Can We Help With?</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg">Select a service area to quickly align your form with the right requirement.</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button type="button" onClick={() => { setActiveService('All'); setFormData((prev) => ({ ...prev, service: '' })); }} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${activeService === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'}`}>All</button>
              {services.map((service) => (
                <button key={service.title} type="button" onClick={() => chooseService(service.title)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${activeService === service.title ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'}`}>{service.title}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {filteredServices.map((item, index) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.08 }} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.desc}</p>
                <button type="button" onClick={() => chooseService(item.title)} className="text-blue-600 font-bold inline-flex items-center">Choose this service <FaArrowRight className="ml-2" /></button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main area */}
      <section className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">What happens next?</h3>
            <ul className="space-y-5 text-gray-700 font-medium">
              {processSteps.map((step) => (
                <li key={step.step} className="flex items-start">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0">{step.icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-1">Step {step.step}</p>
                    <p className="font-bold text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-blue-400">Why businesses contact us</h3>
            <div className="space-y-5">
              {benefits.map((item) => (
                <div key={item.title} className="flex items-start">
                  <div className="bg-gray-800 p-3 rounded-2xl mr-4 text-white">{item.icon}</div>
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-gray-300 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Office hours</h3>
            <div className="space-y-4">
              {officeHours.map((item) => (
                <div key={item.day} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                  <span className="font-semibold text-gray-800">{item.day}</span>
                  <span className="text-sm text-gray-600">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right form */}
        <motion.div id="lead-form" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute -top-5 right-8 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold flex items-center border border-emerald-200">
              <FaLock className="mr-2" /> 100% Confidential
            </div>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Tell us about your business</h2>
              <p className="text-gray-600">Fill out the form and we will review your growth requirements, website needs or marketing goals.</p>
            </div>

            {status.msg && (
              <div className={`mb-8 p-4 rounded-xl font-semibold border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                {status.msg}
              </div>
            )}

            <div className="mb-8">
              <p className="text-sm font-bold text-gray-700 mb-3">Quick topic shortcuts</p>
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <button key={topic} type="button" onClick={() => selectQuickTopic(topic)} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-2 rounded-full text-xs font-semibold hover:bg-blue-100 transition">{topic}</button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Work Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" placeholder="john@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company / Brand Name</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" placeholder="Your company name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Website URL</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" placeholder="https://yourbrand.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Service Interested In</label>
                  <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition text-gray-700 font-medium">
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.title} value={service.title}>{service.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Monthly Budget</label>
                  <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition text-gray-700 font-medium">
                    <option value="">Select an option</option>
                    <option value="Under ₹50,000 / month">Under ₹50,000 / month</option>
                    <option value="₹50k - ₹2 Lakhs / month">₹50k - ₹2 Lakhs / month</option>
                    <option value="₹2 Lakhs - ₹10 Lakhs / month">₹2 Lakhs - ₹10 Lakhs / month</option>
                    <option value="Scale (Above ₹10 Lakhs)">Scale (Above ₹10 Lakhs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Project Timeline</label>
                  <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition text-gray-700 font-medium">
                    <option value="">Select timeline</option>
                    <option value="ASAP">ASAP</option>
                    <option value="Within 2 weeks">Within 2 weeks</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="Flexible / Planning stage">Flexible / Planning stage</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">What is the biggest bottleneck in your growth right now? *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition resize-none" placeholder="e.g. We have a website but no traffic, or our ads are burning money with no strong ROI..." />
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start">
                <FaLock className="text-emerald-600 mt-1 mr-3" />
                <p className="text-sm text-gray-600">Your information is used only to review your request and contact you about relevant solutions.</p>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition duration-300 disabled:bg-blue-400 flex justify-center items-center">
                {loading ? <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-white rounded-full mr-3"></div> : <FaPaperPlane className="mr-3" />}
                {loading ? 'Sending Request...' : 'Submit Application & Request Audit'}
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Trust / expectations */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <FaGlobe />, title: 'Built for Modern Brands', desc: 'Suitable for businesses needing websites, landing pages, SEO growth and performance campaigns.' },
            { icon: <FaCheckCircle />, title: 'Clarity Before Execution', desc: 'We first understand goals, bottlenecks and current digital gaps before suggesting execution.' },
            { icon: <FaBuilding />, title: 'Business-Oriented Communication', desc: 'The page is structured to collect meaningful project details, not just basic contact information.' },
          ].map((item, index) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.08 }} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition">
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
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-3 text-lg">Quick answers before you submit your request.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details key={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-bold text-gray-900">
                  <span className="inline-flex items-center"><FaQuestionCircle className="mr-3 text-blue-600" />{faq.q}</span>
                  <span className="text-blue-600 text-xl">+</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 text-white rounded-[2rem] p-10 md:p-16 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to discuss your growth strategy?</h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">Share your business challenge today and start with a practical conversation around website, SEO, ads or digital growth.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button type="button" onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 px-10 rounded-full transition shadow-xl">
              Request Free Audit <FaArrowRight className="ml-3" />
            </button>
            <a href="mailto:GROWZYBYTES@gmail.com" className="inline-flex items-center justify-center border border-gray-500 hover:border-white text-white font-bold text-lg py-4 px-10 rounded-full transition">
              Email Us Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;