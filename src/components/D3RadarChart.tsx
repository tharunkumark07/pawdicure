import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Pet } from '../types';

interface D3RadarChartProps {
  pet: Pet;
  width?: number;
  height?: number;
}

export function D3RadarChart({ pet, width = 320, height = 320 }: D3RadarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(chartWidth, chartHeight) / 2;
    const center = { x: width / 2, y: height / 2 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${center.x}, ${center.y})`);

    // Define metrics data
    const healthVal = Math.min(100, Math.max(20, pet.careScore || 90));
    const energyVal = Math.min(100, Math.max(20, pet.activityLevel === 'High' ? 92 : pet.activityLevel === 'Moderate' ? 78 : 65));
    const happinessVal = Math.min(100, Math.max(20, 88));
    const hungerVal = Math.min(100, Math.max(20, pet.nutritionPercent ?? 82));

    const data = [
      { axis: 'Health', value: healthVal },
      { axis: 'Energy', value: energyVal },
      { axis: 'Happiness', value: happinessVal },
      { axis: 'Hunger (Satiety)', value: hungerVal },
    ];

    const totalAxes = data.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Scale for radius (0 to 100)
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Draw background grid circles (levels: 25%, 50%, 75%, 100%)
    const levels = 4;
    const gridGroup = svg.append('g').attr('class', 'grid-circles');

    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      gridGroup
        .append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', '#cbd5e1')
        .attr('stroke-dasharray', '4,4')
        .attr('stroke-opacity', 0.6);

      // Level percentage labels
      gridGroup
        .append('text')
        .attr('x', 4)
        .attr('y', -levelRadius + 2)
        .attr('fill', '#94a3b8')
        .attr('font-size', '9px')
        .attr('font-weight', '600')
        .text(`${i * 25}%`);
    }

    // Draw axis lines
    const axisGroup = svg.append('g').attr('class', 'axis-lines');

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const xLine = rScale(100) * Math.cos(angle);
      const yLine = rScale(100) * Math.sin(angle);

      axisGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', xLine)
        .attr('y2', yLine)
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', '1.5');

      // Axis labels
      const labelRadius = radius + 22;
      const xLabel = labelRadius * Math.cos(angle);
      const yLabel = labelRadius * Math.sin(angle);

      const textAnchor = Math.abs(xLabel) < 5 ? 'middle' : xLabel < 0 ? 'end' : 'start';

      axisGroup
        .append('text')
        .attr('x', xLabel)
        .attr('y', yLabel)
        .attr('dy', '0.35em')
        .attr('text-anchor', textAnchor)
        .attr('fill', '#1e293b')
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .text(d.axis);
    });

    // Radar line generator
    const radarLine = d3
      .lineRadial<any>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    // Initial zero data for entry animation
    const initialData = data.map((d) => ({ ...d, value: 0 }));

    // Draw filled polygon with gradient
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'radar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#ff6b4a').attr('stop-opacity', 0.65);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.4);

    const polygonPath = svg
      .append('path')
      .datum(initialData)
      .attr('d', radarLine)
      .attr('fill', 'url(#radar-gradient)')
      .attr('stroke', '#ff6b4a')
      .attr('stroke-width', 2.5);

    // Animate polygon to actual values on mount
    polygonPath
      .transition()
      .duration(1200)
      .ease(d3.easeElasticOut.amplitude(1).period(0.6))
      .attrTween('d', function () {
        const interpolate = d3.interpolate(initialData, data);
        return function (t) {
          return radarLine(interpolate(t)) || '';
        };
      });

    // Draw data points with animation
    const pointsGroup = svg.append('g').attr('class', 'radar-points');

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const finalX = rScale(d.value) * Math.cos(angle);
      const finalY = rScale(d.value) * Math.sin(angle);
      const initX = rScale(0) * Math.cos(angle);
      const initY = rScale(0) * Math.sin(angle);

      const circle = pointsGroup
        .append('circle')
        .attr('cx', initX)
        .attr('cy', initY)
        .attr('r', 5)
        .attr('fill', '#ffffff')
        .attr('stroke', '#ff6b4a')
        .attr('stroke-width', 2.5);

      circle
        .transition()
        .duration(1200)
        .delay(i * 100)
        .ease(d3.easeBounceOut)
        .attr('cx', finalX)
        .attr('cy', finalY);

      // Value badge / tooltip near point
      pointsGroup
        .append('text')
        .attr('x', finalX * 1.15)
        .attr('y', finalY * 1.15)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#0f172a')
        .attr('font-size', '10px')
        .attr('font-weight', '800')
        .text(`${Math.round(d.value)}%`);
    });
  }, [pet, width, height]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-3xl border border-slate-100 shadow-xs relative overflow-hidden">
      <div className="w-full flex items-center justify-between mb-2">
        <h4 className="font-heading font-bold text-xs text-slate-700 flex items-center gap-1.5">
          <span>🐾</span> Biometric Balance Radar
        </h4>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          Optimal
        </span>
      </div>
      <div className="relative">
        <svg ref={svgRef} className="overflow-visible" />
      </div>
      <p className="text-[11px] text-slate-400 mt-2 text-center">
        Realtime composite telemetry across health, energy, happiness &amp; hunger.
      </p>
    </div>
  );
}
