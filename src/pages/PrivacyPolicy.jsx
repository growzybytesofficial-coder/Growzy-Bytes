import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <ShieldCheck size={16} /> Privacy & Trust
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Last Updated: August 2026. How GROWZYBYTES collects, uses, protects, and handles your digital information.
          </p>
        </motion.div>

        <div className="space-y-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Lock className="text-blue-400" size={20} /> 1. Information We Collect
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              When you contact GROWZYBYTES, request an agency quote, or interact with our platform, we may collect information including your name, corporate email address, contact phone number, company name, project requirements, and technical specifications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Eye className="text-blue-400" size={20} /> 2. How We Use Your Data
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We process your data strictly to:
            </p>
            <ul className="space-y-2 text-slate-300 text-sm pl-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-400 flex-shrink-0" size={16} /> Deliver tailored web engineering, digital marketing, and design proposals.</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-400 flex-shrink-0" size={16} /> Communicate project milestones, sprint updates, and technical deliverables.</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-blue-400 flex-shrink-0" size={16} /> Comply with legal obligations and safeguard against unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <FileText className="text-blue-400" size={20} /> 3. Data Protection & Security
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We implement industry-standard encryption, tokenized authentication, secure database clusters, and strict role-based access controls to safeguard your proprietary business information. We never sell, rent, or lease client data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Contact Our Privacy Officer</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              If you have any questions regarding our data practices or wish to request data modification/deletion, email us directly at{' '}
              <a href="mailto:growzybytesofficial@gmail.com" className="text-blue-400 hover:underline font-semibold">
                growzybytesofficial@gmail.com
              </a>.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-800 flex justify-between items-center flex-wrap gap-4">
            <Link to="/" className="text-sm font-bold text-blue-400 hover:text-blue-300">
              ← Return to Home
            </Link>
            <Link to="/contact" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-full transition">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
