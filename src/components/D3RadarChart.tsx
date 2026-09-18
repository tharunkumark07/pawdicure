import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Pet } from '../types';

interface D3RadarChartProps {
  pet: Pet;
}

export function D3RadarChart({ pet }: D3RadarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG elements
    d3.select(svgRef.current).selectAll('*').remove();

    const viewBoxWidth = 400;
    const viewBoxHeight = 350;
    const center = { x: viewBoxWidth / 2, y: viewBoxHeight / 2 + 5 };
    const radius = 95; // Constrain radius to leave generous padding for labels & values

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', `translate(${center.x}, ${center.y})`);

    // 5 Core Pillars Mapping
    const pillars = pet.affinityPillars || [];
    const getPillarLevel = (key: string, fallback: number) => {
      const p = pillars.find((item) => item.name.toLowerCase().includes(key) || item.id.toLowerCase().includes(key));
      return p ? p.level * 10 : fallback; // AffinityPillar levels are typically 1-10
    };

    const hygieneVal = Math.min(100, Math.max(15, getPillarLevel('hygiene', 85)));
    const nutritionVal = Math.min(100, Math.max(15, pet.nutritionPercent ?? getPillarLevel('nutrition', 88)));
    const hydrationVal = Math.min(100, Math.max(15, pet.hydrationPercent ?? getPillarLevel('hydration', 78)));
    const activityVal = Math.min(100, Math.max(15, getPillarLevel('activity', 92)));
    const medicalVal = Math.min(100, Math.max(15, pet.careScore ?? getPillarLevel('medical', 90)));

    const data = [
      { axis: 'Hygiene', value: hygieneVal, icon: '🧼' },
      { axis: 'Nutrition', value: nutritionVal, icon: '🍖' },
      { axis: 'Hydration', value: hydrationVal, icon: '💧' },
      { axis: 'Activity', value: activityVal, icon: '🏃' },
      { axis: 'Medical', value: medicalVal, icon: '🩺' },
    ];

    const totalAxes = data.length;
    const angleSlice = (Math.PI * 2) / totalAxes;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Draw background concentric grid circles
    const levels = 4;
    const gridGroup = svg.append('g').attr('class', 'grid-circles');

    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      gridGroup
        .append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-dasharray', '3,3')
        .attr('stroke-opacity', 0.8);

      gridGroup
        .append('text')
        .attr('x', 4)
        .attr('y', -levelRadius + 3)
        .attr('fill', '#94a3b8')
        .attr('font-size', '8px')
        .attr('font-weight', '700')
        .text(`${i * 25}%`);
    }

    // Draw axis lines & non-overlapping axis labels
    const axisGroup = svg.append('g').attr('class', 'axis-lines');

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const xLine = rScale(100) * Math.cos(angle);
      const yLine = rScale(100) * Math.sin(angle);

      // Axis ray
      axisGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', xLine)
        .attr('y2', yLine)
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', '1.2');

      // Calculate label position with extra clearance
      const labelDistance = radius + 28;
      const xLabel = labelDistance * Math.cos(angle);
      const yLabel = labelDistance * Math.sin(angle);

      // Fine-tune text anchoring based on horizontal quadrant
      let textAnchor: 'start' | 'middle' | 'end' = 'middle';
      if (xLabel > 15) textAnchor = 'start';
      else if (xLabel < -15) textAnchor = 'end';

      let dyOffset = '0.35em';
      if (yLabel < -20) dyOffset = '-0.2em';
      else if (yLabel > 20) dyOffset = '0.8em';

      const labelText = axisGroup
        .append('text')
        .attr('x', xLabel)
        .attr('y', yLabel)
        .attr('dy', dyOffset)
        .attr('text-anchor', textAnchor)
        .attr('fill', '#1e293b')
        .attr('font-size', '11px')
        .attr('font-weight', '700');

      labelText
        .append('tspan')
        .text(`${d.icon} `)
        .attr('font-size', '12px');

      labelText
        .append('tspan')
        .text(d.axis);
    });

    // Radar polygon generator
    const radarLine = d3
      .lineRadial<any>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const initialData = data.map((d) => ({ ...d, value: 0 }));

    // Radial gradient & drop shadow definition
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'radar-gradient-v3')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#ff6b4a').attr('stop-opacity', 0.55);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.25);

    // Filter for glow effect
    const filter = defs.append('filter').attr('id', 'radar-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Filled polygon path
    const polygonPath = svg
      .append('path')
      .datum(initialData)
      .attr('d', radarLine)
      .attr('fill', 'url(#radar-gradient-v3)')
      .attr('stroke', '#ff6b4a')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#radar-glow)');

    polygonPath
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attrTween('d', function () {
        const interpolate = d3.interpolate(initialData, data);
        return function (t) {
          return radarLine(interpolate(t)) || '';
        };
      });

    // Vertex points & value badges
    const pointsGroup = svg.append('g').attr('class', 'radar-points');

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const finalX = rScale(d.value) * Math.cos(angle);
      const finalY = rScale(d.value) * Math.sin(angle);

      // Vertex circle point
      pointsGroup
        .append('circle')
        .attr('cx', finalX)
        .attr('cy', finalY)
        .attr('r', 4.5)
        .attr('fill', '#ffffff')
        .attr('stroke', '#ff6b4a')
        .attr('stroke-width', 2.5);

      // Badge value positioning offset towards polygon center
      const badgeDistance = Math.max(12, rScale(d.value) - 16);
      const badgeX = badgeDistance * Math.cos(angle);
      const badgeY = badgeDistance * Math.sin(angle);

      // Soft pill background for value text
      const rawValue = d.value;
      const valueVal = typeof rawValue === 'number' ? Number(rawValue.toFixed(3)) : rawValue;
      pointsGroup
        .append('rect')
        .attr('x', badgeX - 13)
        .attr('y', badgeY - 8)
        .attr('width', 26)
        .attr('height', 15)
        .attr('rx', 5)
        .attr('fill', '#0f172a')
        .attr('fill-opacity', 0.85);

      pointsGroup
        .append('text')
        .attr('x', badgeX)
        .attr('y', badgeY)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '9px')
        .attr('font-weight', '800')
        .text(`${valueVal}%`);
    });
  }, [pet]);

  const [spotlightPos, setSpotlightPos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col items-center justify-between p-5 sm:p-6 lg:p-8 bg-white/70 backdrop-blur-[12px] rounded-3xl border border-white/50 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 relative overflow-hidden w-full h-full min-h-[380px] max-w-xl mx-auto transition-all duration-300 hover:shadow-xl group"
    >
      {/* Background ambient glass glows */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-orange-400/15 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      {/* ReactBits Spotlight overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 107, 74, 0.09), transparent 80%)`,
          }}
        />
      )}

      <div className="w-full flex items-center justify-between mb-2 z-10">
        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2">
          <span className="p-1 rounded-xl bg-orange-100/80 text-orange-600 shadow-2xs">📊</span>
          <span>Biometric Pillar Balance</span>
        </h4>
        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50/90 border border-emerald-200/60 px-3 py-1 rounded-full shadow-2xs">
          Optimal Care
        </span>
      </div>

      <div className="w-full max-w-[390px] my-auto flex items-center justify-center py-2 z-10">
        <svg ref={svgRef} className="w-full h-auto overflow-visible select-none" />
      </div>

      <p className="text-[11px] text-slate-400 text-center font-medium z-10">
        Live radar matrix derived from {pet.name}'s 5 core wellbeing pillars.
      </p>
    </div>
  );
}
