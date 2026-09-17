import React from 'react';
import { motion } from 'motion/react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline';
}

export function PremiumButton({ children, onClick, className = '', variant = 'primary' }: PremiumButtonProps) {
  const baseClasses = "relative px-6 py-3 rounded-2xl font-bold text-xs transition duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-xs";
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-[#ff6b4a] to-[#ae3115] text-white hover:shadow-orange-500/30"
    : "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition duration-300" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
