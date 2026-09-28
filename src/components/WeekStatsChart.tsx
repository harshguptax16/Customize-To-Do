import React, { useState } from 'react';

interface DataPoint {
  day: string;
  tasksCompleted: number;
  hoursWorked: number;
  efficiency: number;
}

const weekData: DataPoint[] = [
  { day: '23', tasksCompleted: 4, hoursWorked: 6.2, efficiency: 75 },
  { day: '24', tasksCompleted: 6, hoursWorked: 7.5, efficiency: 82 },
  { day: '25', tasksCompleted: 5, hoursWorked: 6.8, efficiency: 78 },
  { day: '26', tasksCompleted: 8, hoursWorked: 8.5, efficiency: 94 },
  { day: '27', tasksCompleted: 7, hoursWorked: 7.9, efficiency: 88 },
  { day: '28', tasksCompleted: 9, hoursWorked: 9.0, efficiency: 96 },
];

export const WeekStatsChart: React.FC = () => {
  const [activePoint, setActivePoint] = useState<DataPoint | null>(null);

  const maxVal = 10;
  const height = 120;
  const width = 280;
  const paddingX = 25;
  const paddingY = 20;

  const getX = (index: number) => paddingX + (index * (width - 2 * paddingX)) / (weekData.length - 1);
  const getY = (val: number) => height - paddingY - (val / maxVal) * (height - 2 * paddingY);

  const points = weekData.map((d, i) => `${getX(i)},${getY(d.tasksCompleted)}`).join(' ');

  // Gradient area path
  const areaPath = `M ${getX(0)},${height - paddingY} L ${points} L ${getX(weekData.length - 1)},${height - paddingY} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Week Stats (23 - 28 Aug)
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          ▲ +28% Productivity
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id="weekTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={getY(2)}
            x2={width - paddingX}
            y2={getY(2)}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={getY(5)}
            x2={width - paddingX}
            y2={getY(5)}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={getY(8)}
            x2={width - paddingX}
            y2={getY(8)}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />

          {/* Area fill */}
          <path d={areaPath} fill="url(#weekTrendGradient)" />

          {/* Trend line */}
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Dots */}
          {weekData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.tasksCompleted);
            const isHovered = activePoint?.day === d.day;

            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setActivePoint(d)} onMouseLeave={() => setActivePoint(null)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200"
                />
                {/* X-axis labels */}
                <text
                  x={cx}
                  y={height - 2}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-medium font-mono"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {activePoint && (
          <div className="absolute top-0 right-2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg pointer-events-none transition-all">
            <div className="font-bold">Aug {activePoint.day}</div>
            <div className="text-slate-300">Tasks: {activePoint.tasksCompleted} done</div>
            <div className="text-indigo-300">Time: {activePoint.hoursWorked} hrs</div>
          </div>
        )}
      </div>
    </div>
  );
};
