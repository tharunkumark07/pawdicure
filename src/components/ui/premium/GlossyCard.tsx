import React from 'react';
import { motion } from 'motion/react';

interface GlossyCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlossyCard({ children, className = '', onClick }: GlossyCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
      <div className="relative z-10 p-5">
        {children}
      </div>
    </motion.div>
  );
}
