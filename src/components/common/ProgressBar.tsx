import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  showValues?: boolean;
}

/**
 * Reusable progress bar component
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  showPercentage = false,
  colorClass = 'bg-orange-500',
  size = 'md',
  showValues = false,
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(label || showValues) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-slate-300">{label}</span>
          )}
          {showValues && (
            <span className="text-sm text-slate-400">
              {current.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-slate-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full ${heightClasses[size]} bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className={`${heightClasses[size]} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
