import React from 'react';
import { LOGO_BASE64 } from '../assets/logoBase64';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  showPtName?: boolean;
  layout?: 'horizontal' | 'vertical';
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const fullImageHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
    '2xl': 'h-20 sm:h-24',
  }[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={LOGO_BASE64}
        alt="PT. Agen Pengadaan Nasional - National Procurement Agent"
        className={`${fullImageHeights} w-auto object-contain transition-transform duration-300 hover:scale-[1.02] drop-shadow-xs`}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};
