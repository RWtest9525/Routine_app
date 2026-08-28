import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string; // hex or Tailwind color
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = '#6366f1',
  height = 'md',
  showLabel = false,
  animate = true,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${heightClasses[height]} border border-slate-700/50`}>
        <div
          className={`${heightClasses[height]} rounded-full ${
            animate ? 'transition-all duration-700 ease-out' : ''
          }`}
          style={{
            width: `${clamped}%`,
            background: color.startsWith('#')
              ? `linear-gradient(90deg, ${color}cc 0%, ${color} 100%)`
              : undefined,
            boxShadow: `0 0 10px ${color}66`,
          }}
        />
      </div>
    </div>
  );
};
