import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  onClick?: () => void;
}

export function TiltedCard({
  children,
  className = '',
  id,
  onClick,
}: TiltedCardProps) {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200);
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      id={id}
      onClick={handleTap}
      whileTap={{ scale: 0.94, y: 1.5 }}
      animate={{
        boxShadow: isTapped 
          ? '0 10px 25px -5px rgba(255, 107, 74, 0.2), 0 8px 10px -6px rgba(255, 107, 74, 0.2)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative rounded-3xl cursor-pointer select-none active:brightness-95 transition-all duration-150 ${className}`}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
      
      {/* Subtle mobile tap indicator ripple backdrop */}
      {isTapped && (
        <span className="absolute inset-0 bg-orange-500/5 rounded-3xl pointer-events-none animate-ping duration-150" />
      )}
    </motion.div>
  );
}
