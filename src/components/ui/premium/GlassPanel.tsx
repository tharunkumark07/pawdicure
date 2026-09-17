import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'high';
}

export function GlassPanel({ children, className = '', intensity = 'medium' }: GlassPanelProps) {
  const intensities = {
    light: 'bg-white/10 border-white/10',
    medium: 'bg-white/30 border-white/20',
    high: 'bg-white/60 border-white/30'
  };

  return (
    <div className={`backdrop-blur-lg border rounded-3xl shadow-lg ${intensities[intensity]} ${className}`}>
      {children}
    </div>
  );
}
