import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SpotlightCard({ children, className = '', id }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      id={id}
      className={`group relative rounded-3xl border border-slate-100 bg-white shadow-xs ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 107, 74, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 p-5">{children}</div>
    </div>
  );
}
