import React, { useState } from 'react';
import { Pet } from '../types';
import { Scale, CheckCircle2, TrendingDown, Info } from 'lucide-react';

interface D3WeightChartProps {
  pet: Pet;
}

export function D3WeightChart({ pet }: D3WeightChartProps) {
  const currentWeight = pet.weight || (pet.species === 'Cat' ? 4.5 : 18.2);
  const targetWeight = pet.species === 'Cat' ? 4.2 : 17.5;
  const unit = 'kg';

  // 6-Month weight log points - ensured max 3 decimals
  const history = [
    { month: 'Apr', weight: Number((currentWeight + 1.2).toFixed(3)) },
    { month: 'May', weight: Number((currentWeight + 0.9).toFixed(3)) },
    { month: 'Jun', weight: Number((currentWeight + 0.6).toFixed(3)) },
    { month: 'Jul', weight: Number((currentWeight + 0.3).toFixed(3)) },
    { month: 'Aug', weight: Number((currentWeight + 0.1).toFixed(3)) },
    { month: 'Sep', weight: Number(currentWeight.toFixed(3)) },
  ];

  const weights = history.map((h) => h.weight);
  const minW = Math.min(...weights, targetWeight) - 0.5;
  const maxW = Math.max(...weights, targetWeight) + 0.5;

  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const formattedCurrentWeight = Number(currentWeight.toFixed(3));
  const formattedTargetWeight = Number(targetWeight.toFixed(3));

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className="bg-white/70 backdrop-blur-[12px] p-5 sm:p-6 lg:p-8 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 relative overflow-hidden w-full h-full min-h-[380px] max-w-xl mx-auto flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
    >
      {/* Background ambient glass glows */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Scale className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
              Weight Telemetry &amp; Target
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Body Mass Index &amp; 6-Month Trend
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black font-heading text-slate-900">
            {formattedCurrentWeight} <span className="text-xs text-slate-400 font-normal">{unit}</span>
          </span>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5">
            <TrendingDown className="w-3 h-3" /> Ideal Condition
          </div>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative pt-4 pb-2 z-10 my-auto">
        <svg viewBox="0 0 340 120" className="w-full h-auto overflow-visible select-none">
          {/* Background Grid Lines */}
          {[0.25, 0.5, 0.75].map((pct, idx) => (
            <line
              key={idx}
              x1="30"
              y1={120 * pct}
              x2="330"
              y2={120 * pct}
              stroke="#e2e8f0"
              strokeDasharray="3,3"
            />
          ))}

          {/* Target Weight Dashed Reference Line */}
          {(() => {
            const targetY = 100 - ((formattedTargetWeight - minW) / (maxW - minW)) * 80;
            return (
              <>
                <line
                  x1="30"
                  y1={targetY}
                  x2="330"
                  y2={targetY}
                  stroke="#10b981"
                  strokeDasharray="4,4"
                  strokeWidth="1.5"
                />
                <text
                  x="330"
                  y={targetY - 5}
                  textAnchor="end"
                  fill="#059669"
                  fontSize="9px"
                  fontWeight="800"
                  fontFamily="monospace"
                >
                  Target: {formattedTargetWeight} {unit}
                </text>
              </>
            );
          })()}

          {/* Line & Area Path Generator */}
          {(() => {
            const points = history.map((h, i) => {
              const x = 30 + i * (300 / (history.length - 1));
              const y = 100 - ((h.weight - minW) / (maxW - minW)) * 80;
              return { x, y, ...h };
            });

            const pathD = points.reduce(
              (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
              ''
            );

            const areaD = `${pathD} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;

            return (
              <g>
                <defs>
                  <linearGradient id="weight-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>

                  <filter id="weight-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Area under curve */}
                <path d={areaD} fill="url(#weight-area)" />

                {/* Trend line with glow filter */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#weight-glow)"
                />

                {/* Data point circles & non-overlapping alternating labels */}
                {points.map((p, i) => {
                  // Alternate label position: even above, odd below
                  const isEven = i % 2 === 0;
                  const labelY = isEven ? p.y - 10 : p.y + 15;
                  
                  return (
                    <g key={i}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                      />
                      {/* Subtle white pill backdrop for text label so grid line doesn't strike through */}
                      <rect
                        x={p.x - 14}
                        y={labelY - 7}
                        width="28"
                        height="10"
                        fill="#ffffff"
                        opacity="0.9"
                        rx="2"
                      />
                      <text
                        x={p.x}
                        y={labelY}
                        dy="0.1em"
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize="9px"
                        fontWeight="800"
                      >
                        {p.weight}
                      </text>
                      <text
                        x={p.x}
                        y="118"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9px"
                        fontWeight="700"
                      >
                        {p.month}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50/90 rounded-2xl border border-slate-200/60 text-[11px] text-slate-600 z-10 shadow-2xs">
        <div className="flex items-center gap-1.5 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Body Condition Score: 5/9 (Ideal)</span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">Updated 3 days ago</span>
      </div>
    </div>
  );
}
