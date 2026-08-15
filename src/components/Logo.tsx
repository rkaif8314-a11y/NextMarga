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
        <div className="w-full h-full border border-white/30 rotate-45 flex items-center justify-center bg-white/5 transition-all duration-300 group-hover:border-white/60">
          <div className="w-2 h-2 bg-[#F5F2ED] rotate-45 shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
        </div>
      </div>

      {showText && (
        <span className={`font-serif-luxury font-medium text-[#F5F2ED] ${textSizes[size]}`}>
          NEXT<span className="font-light text-white/50">MARGA</span>
        </span>
      )}
    </div>
  );
};
