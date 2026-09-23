import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const phoneNumber = '918445892456';
  const defaultMessage = encodeURIComponent('Hello GROWZYBYTES! I would like to inquire about your software development and agency services.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center cursor-pointer transition-colors"
    >
      <FaWhatsapp className="text-2xl" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs pl-0">
      </span>
    </motion.a>
  );
}
