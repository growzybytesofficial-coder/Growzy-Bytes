// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const token = localStorage.getItem('tv_token') || localStorage.getItem('token');
    setIsAdmin(!!token);
  }, [location.pathname]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin')) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Live Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
  ];

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const mobileMenuVars = {
    initial: { height: 0, opacity: 0 },
    animate: {
      height: '100vh',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.12, 0, 0.39, 0],
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const mobileLinkVars = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const Logo = ({ mobile = false }) => (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`flex items-center gap-3 ${mobile ? 'justify-center' : ''}`}
    >
      {!logoError ? (
        <div
          className={`relative overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm ${
            mobile ? 'h-14 w-14 p-2' : 'h-12 w-12 md:h-14 md:w-14 p-2'
          }`}
        >
          <img
            src="/logo.jpeg"
            alt="GrowzyBytes logo"
            className="h-full w-full object-contain object-center drop-shadow-[0_6px_18px_rgba(37,99,235,0.28)]"
            onError={() => setLogoError(true)}
          />
        </div>
      ) : (
        <div
          className={`font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 ${
            mobile ? 'text-2xl' : 'text-2xl md:text-3xl'
          }`}
        >
          GROWZYBYTES
        </div>
      )}

      {!mobile && (
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-white font-black tracking-[0.18em] text-sm md:text-base">
            GROWZYBYTES
          </span>
          <span className="text-slate-400 text-[11px] md:text-xs tracking-[0.28em] uppercase">
            Digital Growth Studio
          </span>
        </div>
      )}
    </motion.div>
  );

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-lg shadow-2xl py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" onClick={closeMenu} className="relative z-50">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center space-x-1 font-semibold text-sm tracking-wide bg-white/5 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-full">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== '/' && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative px-5 py-2 rounded-full group transition-colors"
              >
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {link.name}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-blue-600/20 border border-blue-500/30 rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/admin/dashboard"
                className="bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 text-blue-400 border border-blue-500/30 px-5 py-2.5 rounded-full font-bold transition duration-300 shadow-lg flex items-center text-sm"
              >
                <FaUserShield className="mr-2" /> Admin
              </Link>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-2.5 rounded-full font-bold transition duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center text-sm"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>

        <button
          className="md:hidden text-slate-200 hover:text-white focus:outline-none z-50 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            {isOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="md:hidden fixed top-0 left-0 w-full bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-center items-center overflow-hidden"
          >
            <div className="flex flex-col items-center mb-10">
              <Logo mobile />
            </div>

            <div className="flex flex-col space-y-6 text-center w-full px-6">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path));

                return (
                  <motion.div key={link.name} variants={mobileLinkVars}>
                    <Link
                      to={link.path}
                      onClick={closeMenu}
                      className={`block text-3xl font-black tracking-tight transition duration-300 ${
                        isActive
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                variants={mobileLinkVars}
                className="pt-8 mt-4 border-t border-slate-800 flex flex-col items-center w-full space-y-4"
              >
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMenu}
                    className="inline-flex justify-center items-center w-full max-w-xs bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 px-8 py-3.5 rounded-full font-bold text-lg transition duration-300 shadow-lg"
                  >
                    <FaUserShield className="mr-3" /> Go to Admin Panel
                  </Link>
                )}

                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="inline-block w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition duration-300 shadow-lg shadow-blue-600/30"
                >
                  Start a Project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;