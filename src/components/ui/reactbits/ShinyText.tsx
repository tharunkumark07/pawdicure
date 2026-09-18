import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({ text, disabled = false, speed = 3, className = '' }: ShinyTextProps) {
  return (
    <span
      className={`inline-block font-bold bg-clip-text text-transparent bg-[length:200%_100%] animate-shine ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #1e293b 0%, #ff6b4a 50%, #1e293b 100%)',
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
