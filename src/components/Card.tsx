import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  id?: string;
}

export function Card({ children, className = '', padding = 'md', id }: CardProps) {
  const paddings = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  };

  return (
    <div id={id} className={`bg-white rounded-3xl border border-slate-100 shadow-xs ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
