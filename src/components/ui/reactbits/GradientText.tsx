import React from 'react';
import { useApp } from '../../../context/AppContext';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export function GradientText({
  children,
  className = '',
}: GradientTextProps) {
  return (
    <span
      className={`inline-block text-[var(--primary)] font-black transition-colors duration-500 ${className}`}
    >
      {children}
    </span>
  );
}
