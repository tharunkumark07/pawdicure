import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Calendar, Activity } from 'lucide-react';

interface AnimatedChartProps {
  data: { label: string; value: number; secondary?: string }[];
  title: string;
  subtitle?: string;
  color?: 'orange' | 'rose' | 'indigo' | 'emerald';
  icon?: React.ReactNode;
  unit?: string;
  goalValue?: number;
}

export function AnimatedChart({
  data,
  title,
  subtitle,
  color = 'orange',
  icon,
  unit = '',
  goalValue,
}: AnimatedChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const colorThemes = {
    orange: {
      stroke: '#ff6b4a',
      glow: 'rgba(249, 115, 22, 0.2)',
      bg: 'bg-orange-50/50',
      text: 'text-orange-600',
      badge: 'bg-orange-50/90 text-orange-700 border-orange-200/60',
    },
    rose: {
      stroke: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.2)',
      bg: 'bg-rose-50/50',
      text: 'text-rose-600',
      badge: 'bg-rose-50/90 text-rose-700 border-rose-200/60',
    },
    indigo: {
      stroke: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.2)',
      bg: 'bg-indigo-50/50',
      text: 'text-indigo-600',
      badge: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/60',
    },
    emerald: {
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.2)',
      bg: 'bg-emerald-50/50',
      text: 'text-emerald-600',
      badge: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/60',
    },
  };

  const currentTheme = colorThemes[color];

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, goalValue ?? 0, 1) * 1.1;
  const minVal = Math.min(...values, goalValue ?? 0, 0) * 0.9;

  // Render variables & curve math
  const width = 340;
  const height = 140;
  const paddingX = 25;
  const paddingY = 20;

  const getCoordinates = () => {
    const pointsCount = data.length;
    return data.map((d, i) => {
      const x = paddingX + (i / (pointsCount - 1)) * (width - paddingX * 2);
      // Prevent division by zero if max === min
      const denominator = maxVal === minVal ? 1 : maxVal - minVal;
      const y = height - paddingY - ((d.value - minVal) / denominator) * (height - paddingY * 2);
      return { x, y, value: Number(d.value.toFixed(3)), label: d.label, secondary: d.secondary };
    });
  };

  const points = getCoordinates();

  // Create SVG Bezier Curved Path
  const getBezierPath = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathD = getBezierPath();
  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z` : '';

  // Calculate goal coordinate
  const goalY = goalValue !== undefined
    ? height - paddingY - ((goalValue - minVal) / (maxVal - minVal === 0 ? 1 : maxVal - minVal)) * (height - paddingY * 2)
    : 0;

  const avgValue = Number((values.reduce((acc, curr) => acc + curr, 0) / (values.length || 1)).toFixed(3));
  const peakValue = Number((Math.max(...values)).toFixed(3));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-7 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/30 ring-1 ring-slate-900/5 relative overflow-hidden w-full h-full min-h-[370px] flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
    >
      {/* Background ambient glass glows */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-orange-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      {/* Header Info */}
      <div className="flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            {icon ? (
              <span className={`p-1.5 rounded-xl ${currentTheme.bg} ${currentTheme.text} shadow-2xs`}>
                {icon}
              </span>
            ) : (
              <span className="p-1.5 rounded-xl bg-slate-100 text-slate-600 shadow-2xs">
                <TrendingUp className="w-4 h-4" />
              </span>
            )}
            <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/60 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-700 shrink-0 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Timeline</span>
        </div>
      </div>

      {/* Interactive SVG Render Area */}
      <div className="relative pt-4 pb-2 z-10 my-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <filter id="curved-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid reference ticks */}
          {[0.25, 0.5, 0.75].map((pct, idx) => (
            <line
              key={idx}
              x1={paddingX}
              y1={(height - paddingY * 2) * pct + paddingY}
              x2={width - paddingX}
              y2={(height - paddingY * 2) * pct + paddingY}
              stroke="#e2e8f0"
              strokeOpacity="0.55"
              strokeDasharray="4,4"
            />
          ))}

          {/* Goal Value Guide Line */}
          {goalValue !== undefined && (
            <g>
              <line
                x1={paddingX}
                y1={goalY}
                x2={width - paddingX}
                y2={goalY}
                stroke={currentTheme.stroke}
                strokeWidth="1.5"
                strokeOpacity="0.75"
                strokeDasharray="3,3"
              />
              <rect
                x={width - paddingX - 60}
                y={goalY - 14}
                width="55"
                height="11"
                fill="#ffffff"
                stroke={currentTheme.stroke}
                strokeWidth="1"
                strokeOpacity="0.4"
                rx="3"
              />
              <text
                x={width - paddingX - 32}
                y={goalY - 6}
                textAnchor="middle"
                fill={currentTheme.stroke}
                fontSize="8px"
                fontWeight="800"
              >
                Goal: {Number(goalValue.toFixed(3))}
              </text>
            </g>
          )}

          {/* Render Area Mask fill */}
          {points.length > 0 && (
            <motion.path
              d={areaD}
              fill={currentTheme.stroke}
              fillOpacity={0.12}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Render Curved Trendline with drawing effect */}
          {points.length > 0 && (
            <motion.path
              d={pathD}
              fill="none"
              stroke={currentTheme.stroke}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#curved-line-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          )}

          {/* Active Hover point connector */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              y1={paddingY}
              x2={points[hoveredIndex].x}
              y2={height - paddingY}
              stroke={currentTheme.stroke}
              strokeWidth="1.5"
              strokeOpacity="0.5"
              strokeDasharray="2,2"
            />
          )}

          {/* Nodes list */}
          {points.map((p, idx) => {
            const isPointHovered = hoveredIndex === idx;
            // Alternating labels to guarantee zero overlap under dense views
            const labelOffsetY = idx % 2 === 0 ? p.y - 12 : p.y + 16;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Clean hover bubble background for non-overlapping labels */}
                {isPointHovered && (
                  <rect
                    x={p.x - 22}
                    y={labelOffsetY - 8}
                    width="44"
                    height="12"
                    fill="#1e293b"
                    rx="4"
                    className="shadow-md"
                  />
                )}
                
                {/* Floating Value text labels constrained to 3 decimals */}
                <text
                  x={p.x}
                  y={labelOffsetY}
                  dy="0.1em"
                  textAnchor="middle"
                  fill={isPointHovered ? '#ffffff' : '#1e293b'}
                  fontSize={isPointHovered ? '8px' : '9px'}
                  fontWeight="800"
                  className="transition-colors duration-150"
                >
                  {p.value}
                </text>

                {/* Outer ring on hover */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isPointHovered ? '8' : '0'}
                  fill={currentTheme.stroke}
                  fillOpacity="0.25"
                  className="transition-all duration-200"
                />

                {/* Primary Data dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isPointHovered ? '5' : '3.5'}
                  fill="#ffffff"
                  stroke={currentTheme.stroke}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />

                {/* Horizontal x-axis label */}
                <text
                  x={p.x}
                  y={height - 4}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8px"
                  fontWeight="700"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip overlay panel */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div className="absolute left-1/2 -translate-x-1/2 top-0 mt-1 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white text-[10px] py-1.5 px-3 rounded-2xl shadow-xl pointer-events-none animate-in zoom-in-95 duration-100">
            <div className="font-bold text-slate-100">{points[hoveredIndex].label} Metrics:</div>
            <div className={`${currentTheme.text} font-black text-xs mt-0.5`}>
              {points[hoveredIndex].value} {unit}
            </div>
            {points[hoveredIndex].secondary && (
              <div className="text-slate-300 text-[9px] mt-0.5">
                {points[hoveredIndex].secondary}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary metrics section */}
      <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-200/60 text-center z-10">
        <button
          onMouseEnter={() => setActiveSegment('Average')}
          onMouseLeave={() => setActiveSegment(null)}
          className={`bg-slate-50/90 border p-2.5 rounded-2xl shadow-2xs transition ${activeSegment === 'Average' ? 'border-indigo-200 bg-slate-100' : 'border-slate-100'}`}
        >
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Average</div>
          <div className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">
            {avgValue} {unit}
          </div>
        </button>

        <button
          onMouseEnter={() => setActiveSegment('Peak')}
          onMouseLeave={() => setActiveSegment(null)}
          className={`bg-slate-50/90 border p-2.5 rounded-2xl shadow-2xs transition ${activeSegment === 'Peak' ? 'border-orange-200 bg-slate-100' : 'border-slate-100'}`}
        >
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Peak Point</div>
          <div className="text-xs sm:text-sm font-black text-[#ff6b4a] mt-0.5">
            {peakValue} {unit}
          </div>
        </button>

        <button
          onMouseEnter={() => setActiveSegment('Status')}
          onMouseLeave={() => setActiveSegment(null)}
          className={`bg-slate-50/90 border p-2.5 rounded-2xl shadow-2xs transition ${activeSegment === 'Status' ? 'border-emerald-200 bg-slate-100' : 'border-slate-100'}`}
        >
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Condition</div>
          <div className="text-xs sm:text-sm font-black text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> Optimal
          </div>
        </button>
      </div>
    </div>
  );
}
