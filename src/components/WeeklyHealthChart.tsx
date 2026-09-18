import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Droplet, Sparkles, Heart } from 'lucide-react';

interface HealthTrendPoint {
  day: string;
  wellnessScore: number;
  activityMins: number;
  hydrationMl: number;
}

interface WeeklyHealthChartProps {
  petName: string;
  species: string;
}

export function WeeklyHealthChart({ petName, species }: WeeklyHealthChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 260 });
  const [activeTab, setActiveTab] = useState<'wellness' | 'activity' | 'hydration'>('wellness');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(6); // Default to latest day

  // Generate species-appropriate mock health data for the past week
  const isCat = species === 'Cat';
  const data: HealthTrendPoint[] = [
    { day: 'Mon', wellnessScore: 78.4, activityMins: isCat ? 25 : 55, hydrationMl: isCat ? 150 : 480 },
    { day: 'Tue', wellnessScore: 82.1, activityMins: isCat ? 35 : 65, hydrationMl: isCat ? 180 : 520 },
    { day: 'Wed', wellnessScore: 80.5, activityMins: isCat ? 30 : 45, hydrationMl: isCat ? 160 : 450 },
    { day: 'Thu', wellnessScore: 88.9, activityMins: isCat ? 50 : 80, hydrationMl: isCat ? 210 : 610 },
    { day: 'Fri', wellnessScore: 84.2, activityMins: isCat ? 40 : 70, hydrationMl: isCat ? 190 : 560 },
    { day: 'Sat', wellnessScore: 92.6, activityMins: isCat ? 55 : 95, hydrationMl: isCat ? 240 : 680 },
    { day: 'Sun', wellnessScore: 86.3, activityMins: isCat ? 42 : 75, hydrationMl: isCat ? 200 : 590 },
  ];

  // Observe container size for flawless responsive layout (as required by instructions)
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 280),
          height: 260
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Determine active metric info
  const getMetricDetails = () => {
    switch (activeTab) {
      case 'activity':
        return {
          key: 'activityMins' as const,
          label: 'Active Playtime',
          unit: 'mins',
          color: '#f43f5e',
          gradientId: 'rose-area-grad',
          icon: <Activity className="w-4 h-4 text-rose-500" />
        };
      case 'hydration':
        return {
          key: 'hydrationMl' as const,
          label: 'Hydration Intake',
          unit: 'ml',
          color: '#0284c7',
          gradientId: 'sky-area-grad',
          icon: <Droplet className="w-4 h-4 text-sky-500" />
        };
      default:
        return {
          key: 'wellnessScore' as const,
          label: 'Wellness Quotient',
          unit: '%',
          color: '#10b981',
          gradientId: 'emerald-area-grad',
          icon: <Sparkles className="w-4 h-4 text-emerald-500" />
        };
    }
  };

  const metric = getMetricDetails();
  const values = data.map(d => d[metric.key]);
  const maxVal = Math.max(...values, 1) * 1.1;
  const minVal = Math.min(...values, 0) * 0.9;

  // Render variables & curve math using standard D3 formulas manually for robust SSR/Client sync
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = dimensions.width - paddingX * 2;
  const chartHeight = dimensions.height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const denominator = maxVal === minVal ? 1 : maxVal - minVal;
    const y = paddingY + chartHeight - ((d[metric.key] - minVal) / denominator) * chartHeight;
    return { x, y, ...d };
  });

  // SVG Area path generator
  const getAreaPath = () => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${paddingY + chartHeight}`;
    
    // Draw bezier curves to each point (like standard elegant D3 spline curves)
    points.forEach((p, i) => {
      if (i === 0) {
        path += ` L ${p.x} ${p.y}`;
      } else {
        const prev = points[i - 1];
        const cpX1 = prev.x + (p.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (p.x - prev.x) / 2;
        const cpY2 = p.y;
        path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
      }
    });

    path += ` L ${points[points.length - 1].x} ${paddingY + chartHeight} Z`;
    return path;
  };

  // SVG Line path generator
  const getLinePath = () => {
    if (points.length === 0) return '';
    let path = '';
    points.forEach((p, i) => {
      if (i === 0) {
        path += `M ${p.x} ${p.y}`;
      } else {
        const prev = points[i - 1];
        const cpX1 = prev.x + (p.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (p.x - prev.x) / 2;
        const cpY2 = p.y;
        path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
      }
    });
    return path;
  };

  const selectedPoint = selectedPointIndex !== null ? points[selectedPointIndex] : null;

  return (
    <div className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-7 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff6b4a]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
        <div>
          <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
            {metric.icon}
            <span>Weekly Vital &amp; Conditioning Trends</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
            Interactive area mapping for {petName}'s latest active cycle
          </p>
        </div>

        {/* Filter Navigation (Not compact, touch friendly targets) */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/40 self-start sm:self-auto shadow-2xs">
          {[
            { id: 'wellness', label: 'Wellness', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
            { id: 'activity', label: 'Playtime', color: 'text-rose-700 bg-rose-50 border-rose-100' },
            { id: 'hydration', label: 'Hydration', color: 'text-sky-700 bg-sky-50 border-sky-100' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedPointIndex(6); // Default to last day on tab switch
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                activeTab === tab.id
                  ? `${tab.color} shadow-2xs border scale-102`
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main SVG Area Chart Canvas */}
      <div ref={containerRef} className="w-full h-[180px] sm:h-[200px] relative mt-2 select-none">
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            {/* Soft area color gradients */}
            <linearGradient id="emerald-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="rose-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="sky-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const lineY = paddingY + p * chartHeight;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={lineY}
                x2={dimensions.width - paddingX}
                y2={lineY}
                stroke="#f1f5f9"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Glowing Area Fill */}
          <path
            d={getAreaPath()}
            fill={metric.gradientId ? `url(#${metric.gradientId})` : 'none'}
            className="transition-all duration-350 ease-out"
          />

          {/* Curved Stroke Line */}
          <path
            d={getLinePath()}
            fill="none"
            stroke={metric.color}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-350 ease-out"
          />

          {/* Dynamic Interactive Hotspot click nodes */}
          {points.map((p, i) => (
            <g
              key={i}
              onClick={() => setSelectedPointIndex(i)}
              className="cursor-pointer group"
            >
              {/* Invisible touch extender target */}
              <circle
                cx={p.x}
                cy={p.y}
                r="18"
                fill="transparent"
              />
              
              {/* Visible node circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={selectedPointIndex === i ? '7' : '5.5'}
                fill={selectedPointIndex === i ? metric.color : '#ffffff'}
                stroke={metric.color}
                strokeWidth={selectedPointIndex === i ? '3' : '2'}
                className="transition-all duration-200"
              />

              {/* Day Axis labels at bottom */}
              <text
                x={p.x}
                y={dimensions.height - 8}
                textAnchor="middle"
                className={`text-[10px] sm:text-xs font-black transition-all ${
                  selectedPointIndex === i ? 'fill-slate-900 scale-105' : 'fill-slate-400'
                }`}
              >
                {p.day}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip displaying current stats (Always active and visible above active selection) */}
        <AnimatePresence mode="wait">
          {selectedPoint && (
            <motion.div
              key={`${activeTab}-${selectedPointIndex}`}
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="absolute bg-slate-950/95 backdrop-blur-md text-white text-[11px] p-2.5 rounded-2xl shadow-xl border border-white/10 z-20 pointer-events-none flex flex-col gap-1 w-32 font-medium"
              style={{
                left: `calc(${(selectedPointIndex / 6) * 100}% - 64px)`,
                top: '-45px',
              }}
            >
              <div className="flex items-center justify-between font-bold border-b border-white/10 pb-1 mb-0.5">
                <span className="text-white/80">{selectedPoint.day} Report</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.color }} />
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-white/60">Val:</span>
                <span className="font-bold text-white">
                  {Number(selectedPoint[metric.key].toFixed(3))}{metric.unit}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insight banner matching selected tab */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-2.5 z-10 relative">
        <span className="text-xl shrink-0">📊</span>
        <div className="text-[11px] sm:text-xs text-slate-600 leading-normal font-semibold">
          {activeTab === 'wellness' && `High score on Sat (${data[5].wellnessScore}%) indicates optimal alignment of care & cardiac metrics.`}
          {activeTab === 'activity' && `Daily average playtime sits at ${Number((data.reduce((acc, d) => acc + d.activityMins, 0) / 7).toFixed(3))} minutes of cardiac agitation/exercise.`}
          {activeTab === 'hydration' && `Average intracellular intake is ${Number((data.reduce((acc, d) => acc + d.hydrationMl, 0) / 7).toFixed(3))} ml across the cycle.`}
        </div>
      </div>
    </div>
  );
}
