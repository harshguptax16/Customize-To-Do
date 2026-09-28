import React, { useState } from 'react';

interface Slice {
  label: string;
  value: number; // percentage
  color: string;
  hours: number;
}

const defaultSlices: Slice[] = [
  { label: 'Deep Work / Coding', value: 35, color: '#3b82f6', hours: 4.2 },
  { label: 'Prior Meetings & Sync', value: 20, color: '#8b5cf6', hours: 2.4 },
  { label: 'Meals & Wellness', value: 18, color: '#10b981', hours: 2.1 },
  { label: 'Breaks & Exercise', value: 15, color: '#f59e0b', hours: 1.8 },
  { label: 'Tasks Pending', value: 12, color: '#ef4444', hours: 1.5 },
];

interface Props {
  dateLabel?: string;
  compact?: boolean;
}

export const WorkStatsDonut: React.FC<Props> = ({ dateLabel = '26 Aug', compact = false }) => {
  const [hoveredSlice, setHoveredSlice] = useState<Slice | null>(null);

  // Calculate SVG donut paths
  const radius = compact ? 55 : 65;
  const strokeWidth = compact ? 18 : 22;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={compact ? 150 : 180}
          height={compact ? 150 : 180}
          viewBox="0 0 180 180"
        >
          {defaultSlices.map((slice, i) => {
            const strokeDasharray = `${(slice.value / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += (slice.value / 100) * circumference;

            return (
              <circle
                key={i}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={hoveredSlice?.label === slice.label ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {hoveredSlice ? 'Focus' : 'Log Date'}
          </span>
          <span className="text-base font-bold text-slate-900">
            {hoveredSlice ? `${hoveredSlice.value}%` : dateLabel}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {hoveredSlice ? `${hoveredSlice.hours} hrs` : '12 hrs total'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-3 grid grid-cols-2 gap-1.5 text-xs">
        {defaultSlices.map((slice, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredSlice(slice)}
            onMouseLeave={() => setHoveredSlice(null)}
            className={`flex items-center gap-1.5 p-1 rounded transition-colors cursor-pointer ${
              hoveredSlice?.label === slice.label ? 'bg-slate-100 font-semibold' : 'text-slate-600'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="truncate">{slice.label}</span>
            <span className="ml-auto font-mono text-slate-700 text-[11px]">{slice.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
