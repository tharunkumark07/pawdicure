import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export function GradientText({
  children,
  className = '',
  colors = ['#ff6b4a', '#f59e0b', '#ec4899', '#ff6b4a'],
  animationSpeed = 6,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    backgroundSize: '300% 100%',
    animation: `gradientShift ${animationSpeed}s ease infinite`,
  };

  return (
    <span
      className={`inline-block bg-clip-text text-transparent font-black ${className}`}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
