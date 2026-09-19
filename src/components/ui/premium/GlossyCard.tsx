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
      className={`relative overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${className}`}
    >
      <div className="relative z-10 p-5">
        {children}
      </div>
    </motion.div>
  );
}
