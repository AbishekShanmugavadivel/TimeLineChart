import React from 'react';

const ProgressBar = ({ progress = 0, color = 'blue', height = 'h-2.5', showLabel = true }) => {
  const colorMap = {
    blue: 'bg-blue-600',
    green: 'bg-emerald-500',
    purple: 'bg-purple-600',
    orange: 'bg-amber-500',
    pink: 'bg-pink-500',
    cyan: 'bg-cyan-500',
    indigo: 'bg-indigo-600'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold">
          <span className="text-slate-500">Progress</span>
          <span className="text-slate-900 font-bold">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${colorMap[color] || 'bg-blue-600'} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
