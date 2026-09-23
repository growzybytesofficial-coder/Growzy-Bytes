// frontend/src/components/Footer.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa';

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Admin pages par footer nahi dikhana hai
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  // --- Animation Variants ---
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-20 pb-10 overflow-hidden font-sans border-t border-slate-800/50">
      
      {/* Top Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30 blur-sm"></div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        
        {/* 1. Brand Section */}
        <motion.div variants={itemVars}>
          <Link to="/" className="inline-block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-wider mb-6">
            GROWZYBYTES
          </Link>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm">
            Your partner in digital growth. We build modern websites, drive traffic, and maximize your online potential through innovative tech solutions.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4">
            {[
              { icon: <FaFacebookF />, color: "hover:bg-blue-600", link: "#" },
              { icon: <FaTwitter />, color: "hover:bg-sky-500", link: "#" },
              { icon: <FaLinkedinIn />, color: "hover:bg-blue-700", link: "#" },
              { icon: <FaInstagram />, color: "hover:bg-pink-600", link: "#" },
            ].map((social, index) => (
              <a 
                key={index} 
                href={social.link} 
                className={`w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white ${social.color} hover:shadow-lg hover:-translate-y-1`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* 2. Quick Links */}
        <motion.div variants={itemVars}>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { name: 'Home', path: '/' },
              { name: 'About Us', path: '/about' },
              { name: 'Our Services', path: '/services' },
              { name: 'Live Projects', path: '/projects' },
              { name: 'Latest Blogs', path: '/blog' }
            ].map((link, index) => (
              <li key={index}>
                <Link to={link.path} className="group flex items-center text-slate-400 hover:text-blue-400 transition-colors duration-300">
                  <span className="w-0 h-[2px] bg-blue-500 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 3. Contact Info (Updated Data) */}
        <motion.div variants={itemVars}>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Get in Touch</h3>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-start">
              <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0 text-lg" />
              <span>Agra, India</span>
            </li>
            <li className="flex items-center">
              <FaPhoneAlt className="text-blue-500 mr-3 flex-shrink-0" />
              <span>+91 8445892456</span>
            </li>
            <li className="flex items-center">
              <FaPhoneAlt className="text-blue-500 mr-3 flex-shrink-0" />
              <span>+91 8433060209</span>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="text-blue-500 mr-3 flex-shrink-0" />
              <span>growzybytesofficial@gmail.com</span>
            </li>
          </ul>
          <Link to="/contact" className="inline-flex items-center mt-6 text-sm font-bold text-white bg-slate-800 hover:bg-blue-600 px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg">
            Let's Talk <FaArrowRight className="ml-2 text-xs" />
          </Link>
        </motion.div>

        {/* 4. Newsletter */}
        <motion.div variants={itemVars}>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Newsletter</h3>
          <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest tech news and updates delivered to your inbox.</p>
          {subscribed ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold text-center">
              ✓ Subscribed successfully! Thank you for joining.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all pr-12"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white w-10 flex items-center justify-center rounded-lg transition-colors"
              >
                <FaArrowRight />
              </button>
            </form>
          )}
        </motion.div>

      </motion.div>

      {/* Bottom Copyright Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500"
      >
        <p>&copy; {new Date().getFullYear()} GROWZYBYTES. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
        </div>
      </motion.div>

    </footer>
  );
};

export default Footer;