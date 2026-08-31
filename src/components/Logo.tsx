import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base tracking-[0.15em]',
    md: 'text-lg tracking-[0.2em]',
    lg: 'text-2xl tracking-[0.25em]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sleek Minimalist Geometric Monogram */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        <div className="w-full h-full border border-sky-200 rotate-45 flex items-center justify-center bg-sky-50 transition-all duration-300 group-hover:border-white/60">
          <div className="w-2 h-2 bg-sky-700 rotate-45 shadow-sm"></div>
        </div>
      </div>

      {showText && (
        <span className={`font-serif-luxury font-medium text-slate-950 ${textSizes[size]}`}>
          NEXT<span className="font-light text-slate-500">MARGA</span>
        </span>
      )}
    </div>
  );
};
