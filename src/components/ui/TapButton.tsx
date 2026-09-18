import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface TapButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  scale?: number;
}

export function TapButton({ children, scale = 0.95, className, ...props }: TapButtonProps) {
  return (
    <motion.button
      whileTap={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`select-none touch-manipulation ${className || ''}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
