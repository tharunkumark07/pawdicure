import React from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SpotlightCard({ children, className = '', id }: SpotlightCardProps) {
  return (
    <div
      id={id}
      className={`group relative rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xs transition-all duration-300 hover:border-[var(--primary)] ${className}`}
    >
      <div className="relative z-10 p-5">{children}</div>
    </div>
  );
}
