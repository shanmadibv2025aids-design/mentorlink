import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconContainerSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Silicon Valley Style Flat Vector Logomark: Solid Blue Square with White Geometric AI-Mentorship M Icon */}
      <div
        className={`${iconContainerSizes[size]} shrink-0 flex items-center justify-center bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Learner Node (Left) */}
          <circle cx="8" cy="9" r="2.5" fill="white" />
          <path
            d="M8 12.5V23"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Mentor Node (Right) */}
          <circle cx="24" cy="9" r="2.5" fill="white" />
          <path
            d="M24 12.5V23"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* AI Connection Bridge (Forms 'M' vertex with AI Spark Node) */}
          <path
            d="M8 12.5L16 18.5L24 12.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* AI Core Diamond Sparkle at Connection Point */}
          <path
            d="M16 14.5L17.5 18.5L16 22.5L14.5 18.5Z"
            fill="white"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-extrabold tracking-tight text-white leading-none ${textSizes[size]}`}
          >
            Mentor<span className="text-blue-500">Link</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
            AI Mentorship
          </span>
        </div>
      )}
    </div>
  );
};
