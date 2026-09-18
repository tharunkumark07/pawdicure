import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Flame, Droplet, ShieldCheck, Zap } from 'lucide-react';

interface GaugeProps {
  value: number; // 0 to 100
  label: string;
  sublabel?: string;
  color?: 'orange' | 'rose' | 'sky' | 'emerald' | 'indigo';
  unit?: string;
  icon?: React.ReactNode;
}

export function Gauge({
  value,
  label,
  sublabel,
  color = 'orange',
  unit = '%',
  icon,
}: GaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hoveredRange, setHoveredDay] = useState<string | null>(null);

  // Smooth entry / update value simulation
  useEffect(() => {
    const start = animatedValue;
    const end = Math.min(100, Math.max(0, value));
    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const current = start + (end - start) * easedProgress;
      setAnimatedValue(Number(current.toFixed(3)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const colorThemes = {
    orange: {
      stroke: 'url(#gauge-grad-orange)',
      glow: 'rgba(249, 115, 22, 0.25)',
      bg: 'bg-orange-50/50',
      text: 'text-orange-600',
      badge: 'bg-orange-100/70 border-orange-200/60 text-orange-800',
    },
    rose: {
      stroke: 'url(#gauge-grad-rose)',
      glow: 'rgba(244, 63, 94, 0.25)',
      bg: 'bg-rose-50/50',
      text: 'text-rose-600',
      badge: 'bg-rose-100/70 border-rose-200/60 text-rose-800',
    },
    sky: {
      stroke: 'url(#gauge-grad-sky)',
      glow: 'rgba(14, 165, 233, 0.25)',
      bg: 'bg-sky-50/50',
      text: 'text-sky-600',
      badge: 'bg-sky-100/70 border-sky-200/60 text-sky-800',
    },
    emerald: {
      stroke: 'url(#gauge-grad-emerald)',
      glow: 'rgba(16, 185, 129, 0.25)',
      bg: 'bg-emerald-50/50',
      text: 'text-emerald-600',
      badge: 'bg-emerald-100/70 border-emerald-200/60 text-emerald-800',
    },
    indigo: {
      stroke: 'url(#gauge-grad-indigo)',
      glow: 'rgba(99, 102, 241, 0.25)',
      bg: 'bg-indigo-50/50',
      text: 'text-indigo-600',
      badge: 'bg-indigo-100/70 border-indigo-200/60 text-indigo-800',
    },
  };

  const currentTheme = colorThemes[color];

  // SVG Gauge Math
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc length is 3/4 circle (270 degrees)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (animatedValue / 100) * arcLength;

  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const formattedValue = Number(animatedValue.toFixed(3));

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col items-center justify-between p-5 sm:p-6 lg:p-7 bg-white/70 backdrop-blur-[12px] rounded-3xl border border-white/50 shadow-lg shadow-slate-200/30 ring-1 ring-slate-900/5 relative overflow-hidden w-full h-full min-h-[350px] transition-all duration-300 hover:shadow-xl group"
    >
      {/* Dynamic spotlight hover glow */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100 z-0"
          style={{
            background: `radial-gradient(300px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${currentTheme.glow}, transparent 80%)`,
          }}
        />
      )}

      {/* Title block */}
      <div className="w-full flex items-center justify-between z-10">
        <h4 className="font-heading font-black text-xs sm:text-sm text-slate-800 flex items-center gap-2">
          {icon ? (
            <span className={`p-1.5 rounded-xl ${currentTheme.bg} ${currentTheme.text} shadow-2xs`}>
              {icon}
            </span>
          ) : (
            <span className="p-1.5 rounded-xl bg-slate-100 text-slate-600 shadow-2xs">📊</span>
          )}
          <span>{label}</span>
        </h4>
        <span className={`text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full shadow-2xs ${currentTheme.badge}`}>
          {formattedValue >= 85 ? 'Peak' : formattedValue >= 50 ? 'Optimal' : 'Needs Care'}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center z-10 my-4 select-none">
        <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-225">
          <defs>
            <linearGradient id="gauge-grad-orange" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff6b4a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="gauge-grad-rose" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
            <linearGradient id="gauge-grad-sky" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="gauge-grad-emerald" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
            <linearGradient id="gauge-grad-indigo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>

            <filter id="gauge-shadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Arc track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Animated Active Arc */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke={currentTheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gauge-shadow)"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Text Panel */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
          <span className="text-3xl font-black font-heading tracking-tight text-slate-800 flex items-baseline">
            {formattedValue}
            <span className="text-xs text-slate-400 font-medium ml-0.5">{unit}</span>
          </span>
          {sublabel && (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {/* Ranges footer description - clean & spaced, no overlaps */}
      <div className="w-full grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100/80 text-center z-10">
        <button
          onMouseEnter={() => setHoveredDay('Low')}
          onMouseLeave={() => setHoveredDay(null)}
          className={`p-1.5 rounded-xl transition ${hoveredRange === 'Low' ? 'bg-slate-50 scale-102 border border-slate-200' : 'border border-transparent'}`}
        >
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Inadequate</div>
          <div className="text-[10px] font-black text-slate-700 mt-0.5">&lt;50%</div>
        </button>
        <button
          onMouseEnter={() => setHoveredDay('Optimal')}
          onMouseLeave={() => setHoveredDay(null)}
          className={`p-1.5 rounded-xl transition ${hoveredRange === 'Optimal' ? 'bg-slate-50 scale-102 border border-slate-200' : 'border border-transparent'}`}
        >
          <div className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider">Optimal</div>
          <div className="text-[10px] font-black text-emerald-600 mt-0.5">50%-85%</div>
        </button>
        <button
          onMouseEnter={() => setHoveredDay('Peak')}
          onMouseLeave={() => setHoveredDay(null)}
          className={`p-1.5 rounded-xl transition ${hoveredRange === 'Peak' ? 'bg-slate-50 scale-102 border border-slate-200' : 'border border-transparent'}`}
        >
          <div className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-wider">Peak Care</div>
          <div className="text-[10px] font-black text-indigo-600 mt-0.5">&gt;85%</div>
        </button>
      </div>
    </div>
  );
}
