import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const textClass =
    variant === 'light'
      ? 'text-white'
      : 'text-[#171C3A]';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lifedrop-grad" x1="6" y1="4" x2="34" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="55%" stopColor="#FF647C" />
            <stop offset="100%" stopColor="#FF4D9D" />
          </linearGradient>
        </defs>
        <path
          d="M20 3.5C20 3.5 7.5 16.4 7.5 25.1C7.5 31.95 13.1 37.5 20 37.5C26.9 37.5 32.5 31.95 32.5 25.1C32.5 16.4 20 3.5 20 3.5Z"
          fill="url(#lifedrop-grad)"
        />
        <path
          d="M20 29.6C20 29.6 13.6 25.4 13.6 21.1C13.6 19.1 15.1 17.6 17 17.6C18.2 17.6 19.3 18.2 20 19.2C20.7 18.2 21.8 17.6 23 17.6C24.9 17.6 26.4 19.1 26.4 21.1C26.4 25.4 20 29.6 20 29.6Z"
          fill="#FFFFFF"
        />
      </svg>
      <span className={`font-display text-xl font-extrabold tracking-tight ${textClass}`}>
        Life<span className="text-[#E63946]">Drop</span>
      </span>
    </span>
  );
};
