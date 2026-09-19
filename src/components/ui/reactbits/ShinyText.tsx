import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({ text, className = '' }: ShinyTextProps) {
  return (
    <span
      className={`inline-block font-bold text-[var(--primary)] transition-colors duration-500 ${className}`}
    >
      {text}
    </span>
  );
}
