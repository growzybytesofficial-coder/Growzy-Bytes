import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, FileCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <Scale size={16} /> Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Agreement governing professional software engineering, digital consulting, and creative services provided by GROWZYBYTES.
          </p>
        </motion.div>

        <div className="space-y-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <FileCheck className="text-purple-400" size={20} /> 1. Scope of Services
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              GROWZYBYTES provides full-stack web development, custom software architectures, cloud deployment, UI/UX design, and digital marketing consulting. Project scopes, timelines, and deliverables are specified in respective statements of work (SOW).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Cpu className="text-purple-400" size={20} /> 2. Intellectual Property
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Upon final settlement of project payments, full ownership of custom codebases and designs transfers to the client. GROWZYBYTES retains the right to display project highlights, screenshots, and live links in portfolio showcases unless bound by a strict non-disclosure agreement (NDA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldAlert className="text-purple-400" size={20} /> 3. Warranties & SLA
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              All delivered software solutions undergo rigorous quality assurance. We offer standard post-launch support and bug resolution windows as defined in your contract agreement.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-800 flex justify-between items-center flex-wrap gap-4">
            <Link to="/" className="text-sm font-bold text-blue-400 hover:text-blue-300">
              ← Return to Home
            </Link>
            <Link to="/contact" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-full transition">
              Discuss a Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
