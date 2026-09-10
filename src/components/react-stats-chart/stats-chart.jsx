import React from 'react';

export function StatsChart({ total, completed, pending }) {
  const completedPercent =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const radius = 80;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const completedOffset =
    circumference - (completedPercent / 100) * circumference;

  return (
    <div className="stats-chart">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--color-grey-mid)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--color-aqua)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={completedOffset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
        <text
          x="100"
          y="95"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill="var(--color-blue-dark)"
        >
          {completedPercent}%
        </text>
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fontSize="12"
          fill="var(--color-grey)"
        >
          completed
        </text>
      </svg>

      <div className="stats-chart__legend">
        <div className="stats-chart__legend-item">
          <span className="stats-chart__dot stats-chart__dot--completed" />
          Completed: {completed}
        </div>
        <div className="stats-chart__legend-item">
          <span className="stats-chart__dot stats-chart__dot--pending" />
          Pending: {pending}
        </div>
        <div className="stats-chart__legend-item stats-chart__legend-item--total">
          Total: {total}
        </div>
      </div>
    </div>
  );
}

export default StatsChart;
