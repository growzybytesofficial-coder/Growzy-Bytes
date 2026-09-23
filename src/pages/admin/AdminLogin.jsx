// frontend/src/pages/admin/AdminLogin.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWifi,
  FaSyncAlt,
} from 'react-icons/fa';

const statusMessages = [
  'Secure admin access for your business',
  'Manage projects, blogs, leads and content',
  'Fast, protected and responsive control panel',
];

const showDevCredentials = import.meta.env.DEV;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeMessage, setActiveMessage] = useState(0);

  useEffect(() => {
    const savedEmail = localStorage.getItem('adminRememberEmail');
    const token = localStorage.getItem('token');

    if (savedEmail) {
      setCredentials((prev) => ({ ...prev, email: savedEmail }));
    }

    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % statusMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const formValid = useMemo(() => {
    return (
      credentials.email.trim().length > 4 &&
      credentials.password.trim().length >= 6
    );
  }, [credentials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handlePasswordKey = (e) => {
    setCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isOnline) {
      setError('You are offline. Please check your internet connection.');
      return;
    }

    if (!formValid) {
      setError('Please enter a valid email and password.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: credentials.email.trim(),
        password: credentials.password,
      };

      const res = await api.post('/auth/login', payload);

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);

        if (res.data?.user) {
          localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        }

        if (rememberMe) {
          localStorage.setItem('adminRememberEmail', credentials.email.trim());
        } else {
          localStorage.removeItem('adminRememberEmail');
        }

        setSuccess('Login successful. Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 900);
      } else {
        setError('Login failed. Token not received.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.15),_transparent_30%)]" />
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-blue-600/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-white/10 bg-white/5 backdrop-blur-xl">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-200 text-sm font-semibold"
            >
              <FaShieldAlt className="text-blue-400" />
              GROWZYBYTES Admin Security
            </motion.div>

            <div className="mt-10">
              <h1 className="text-4xl xl:text-5xl font-black leading-tight">
                Welcome back to your control center
              </h1>
              <p className="text-slate-300 mt-5 text-lg leading-relaxed max-w-xl">
                Sign in to manage projects, blog posts, leads, services and your
                complete admin workflow from one place.
              </p>
            </div>

            <div className="mt-10 p-6 rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400 mb-4">
                Live system note
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMessage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="text-2xl font-bold text-white min-h-[72px]"
                >
                  {statusMessages[activeMessage]}
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-slate-400 text-sm">Security</p>
                  <p className="text-xl font-bold mt-1">JWT Protected</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-slate-400 text-sm">Experience</p>
                  <p className="text-xl font-bold mt-1">Responsive UI</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <span className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <FaWifi className="text-emerald-400" />
                  System online
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="text-red-400" />
                  No internet connection
                </>
              )}
            </span>
            <span>Protected Admin Access</span>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            <div className="rounded-[28px] border border-white/10 bg-white/95 text-slate-900 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
                      Admin Portal
                    </p>
                    <h2 className="text-3xl font-black mt-2">Secure Login</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                    <FaShieldAlt className="text-2xl" />
                  </div>
                </div>

                <p className="mt-4 text-blue-100">
                  Access your dashboard and manage your business efficiently.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-slate-500">
                    Sign in with your admin credentials
                  </div>
                  <div
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isOnline
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                        : 'text-red-600 bg-red-50 border-red-200'
                    }`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
                    >
                      <FaExclamationTriangle className="mt-1 shrink-0" />
                      <span className="text-sm font-semibold">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
                    >
                      <FaCheckCircle className="mt-1 shrink-0" />
                      <span className="text-sm font-semibold">{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {showDevCredentials && (
                <div className="mb-5 p-3.5 bg-blue-50/80 border border-blue-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Development Admin Credentials</p>
                    <p className="text-slate-600 font-medium text-[11px] truncate mt-0.5">
                      <span className="font-mono text-slate-800">growzybytesofficial@gmail.com</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Pass: <span className="font-mono font-bold text-slate-700">Growzybytes@2026</span> <span className="text-slate-400">or</span> <span className="font-mono text-slate-500">Druhi@2011</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCredentials({
                        email: 'growzybytesofficial@gmail.com',
                        password: 'Growzybytes@2026',
                      });
                      setError('');
                    }}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    Quick Fill
                  </button>
                </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        placeholder="growzybytesofficial@gmail.com"
                        className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-2xl bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <FaLock />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        onKeyUp={handlePasswordKey}
                        onKeyDown={handlePasswordKey}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3.5 border border-slate-300 rounded-2xl bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {capsLockOn && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="mt-2 text-xs font-semibold text-amber-600"
                        >
                          Caps Lock is on.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe((prev) => !prev)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Remember email
                    </label>

                    <span className="text-slate-400">
                      {formValid ? 'Ready to login' : 'Enter valid details'}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    disabled={loading || !formValid}
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-lg transition duration-300"
                  >
                    {loading ? (
                      <>
                        <FaSyncAlt className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Secure Login
                        <FaArrowRight />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Protected by  auth GROWZYBYTES flow</span>
                  <span>Admin only</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
