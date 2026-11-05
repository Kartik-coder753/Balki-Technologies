import React, { useState } from 'react';

interface BalkiLogoProps {
  /**
   * 'full' shows both the peacock 'B' emblem and 'BALKI TECHNOLOGIES' typography.
   * 'icon' shows only the peacock 'B' emblem.
   */
  type?: 'full' | 'icon';
  /**
   * 'light' is optimized for light backgrounds (navbar, modals, white cards).
   * 'dark' is optimized for dark backgrounds (footer, dark hero sections).
   */
  variant?: 'light' | 'dark';
  /**
   * Height class or size in pixels.
   */
  className?: string;
  /**
   * Optional custom image toggle (defaults to true on light mode)
   */
  useImage?: boolean;
}

/**
 * High-precision vector emblem representing the official Balki Technologies
 * Peacock 'B' icon with vibrant cyan, teal, electric blue, and sapphire layers.
 */
export const BalkiEmblem: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Balki Technologies Peacock Emblem"
    >
      <defs>
        {/* Left vertical B spine gradient: Cyan to Deep Navy */}
        <linearGradient id="balki-spine-grad" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00c49f" />
          <stop offset="35%" stopColor="#0284c7" />
          <stop offset="70%" stopColor="#034078" />
          <stop offset="100%" stopColor="#001f3f" />
        </linearGradient>

        {/* Top lobe curve gradient */}
        <linearGradient id="balki-top-lobe" x1="20" y1="10" x2="110" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00d2b4" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Peacock feather layers gradients */}
        <linearGradient id="feather-cyan-1" x1="40" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="30%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        <linearGradient id="feather-teal-2" x1="50" y1="50" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="40%" stopColor="#0ea5e9" />
          <stop offset="85%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        <linearGradient id="feather-deep-3" x1="60" y1="60" x2="115" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="45%" stopColor="#2563eb" />
          <stop offset="90%" stopColor="#172554" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Peacock neck & breast gradient */}
        <linearGradient id="peacock-neck-grad" x1="30" y1="20" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f0fdfa" />
          <stop offset="70%" stopColor="#ccfbf1" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>

        {/* Crest pearls gradient */}
        <radialGradient id="crest-dot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
      </defs>

      {/* Main Base Outer 'B' Shape */}
      {/* Left straight vertical stem */}
      <path
        d="M 12 10 L 32 10 L 32 110 L 12 110 Z"
        fill="url(#balki-spine-grad)"
      />

      {/* Top Outer Lobe of 'B' */}
      <path
        d="M 32 10 C 65 10, 96 16, 96 46 C 96 60, 84 66, 68 68 C 88 72, 108 82, 108 100 C 108 114, 94 110, 72 110 L 32 110 Z"
        fill="url(#balki-top-lobe)"
      />

      {/* Peacock Feather Wing Layer 3 (Deep outer bottom arc) */}
      <path
        d="M 44 65 C 65 65, 106 72, 106 96 C 106 109, 88 110, 68 110 C 85 106, 96 98, 92 88 C 88 78, 68 72, 44 65 Z"
        fill="url(#feather-deep-3)"
      />

      {/* Peacock Feather Wing Layer 2 (Vibrant cyan/cobalt middle fan) */}
      <path
        d="M 40 55 C 62 55, 96 64, 98 84 C 100 96, 82 104, 60 106 C 76 101, 88 92, 85 82 C 81 72, 60 64, 40 55 Z"
        fill="url(#feather-teal-2)"
      />

      {/* Peacock Feather Wing Layer 1 (Bright turquoise upper wing) */}
      <path
        d="M 36 46 C 54 44, 86 50, 88 68 C 90 78, 76 88, 52 92 C 68 86, 78 78, 76 70 C 73 62, 54 54, 36 46 Z"
        fill="url(#feather-cyan-1)"
      />

      {/* Graceful Peacock Body, Curved Neck & Head Profile */}
      <path
        d="M 52 24 C 52 24, 62 21, 69 26 C 75 30, 75 37, 70 41 C 64 45, 50 49, 44 58 C 38 67, 36 78, 38 90 C 39 96, 42 104, 48 110 C 38 106, 32 94, 32 80 C 32 64, 40 50, 48 41 C 55 33, 56 28, 52 24 Z"
        fill="url(#peacock-neck-grad)"
      />

      {/* Head & Beak Detail */}
      <path
        d="M 68 26 C 72 27, 76 29, 80 32 C 77 34, 73 35, 70 36 C 68 34, 67 30, 68 26 Z"
        fill="#ffffff"
      />

      {/* Peacock Eye */}
      <circle cx="65" cy="30" r="1.8" fill="#083344" />

      {/* 3 Royal Crest Feathers (Stems & Dots) */}
      {/* Stem 1 */}
      <path d="M 58 24 Q 54 18 52 13" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="52" cy="12" r="2.8" fill="url(#crest-dot)" />

      {/* Stem 2 (Center) */}
      <path d="M 61 24 Q 60 16 60 10" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="60" cy="9" r="3" fill="url(#crest-dot)" />

      {/* Stem 3 (Right) */}
      <path d="M 64 25 Q 67 18 69 13" stroke="#0ea5e9" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="70" cy="12" r="2.8" fill="url(#crest-dot)" />

      {/* Flowing Lower Tail Plumes / Filaments Accent */}
      <path
        d="M 40 92 Q 35 106 42 116 Q 37 110 37 98 Z"
        fill="#38bdf8"
      />
      <path
        d="M 46 98 Q 42 108 48 118 Q 44 112 44 102 Z"
        fill="#2dd4bf"
      />
    </svg>
  );
};

/**
 * Primary Balki Technologies Logo Component
 */
export const BalkiLogo: React.FC<BalkiLogoProps> = ({
  type = 'full',
  variant = 'light',
  className = '',
  useImage = true
}) => {
  const [imageError, setImageError] = useState(false);
  const isDark = variant === 'dark';

  if (type === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <BalkiEmblem className="w-full h-full drop-shadow-sm" />
      </div>
    );
  }

  // Render official high-res logo image with clean background blending and fallback
  if (useImage && !imageError && !isDark) {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src="/balki-logo-trimmed.png"
          alt="BALKI TECHNOLOGIES"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-7 xs:h-8 sm:h-12 md:h-14 w-auto max-w-[125px] xs:max-w-[160px] sm:max-w-[260px] md:max-w-[320px] object-contain drop-shadow-2xs group-hover:scale-[1.02] transition-transform duration-200"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3.5 select-none ${className}`}>
      {/* Peacock 'B' Emblem */}
      <div className={`w-8 h-8 sm:w-12 sm:h-12 shrink-0 p-0.5 rounded-xl sm:rounded-2xl ${
        isDark ? 'bg-slate-800/95 border-slate-700 shadow-md' : 'bg-white border-slate-200/90 shadow-sm'
      } border flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}>
        <BalkiEmblem className="w-full h-full" />
      </div>

      {/* Official Typography */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-center tracking-tight leading-none">
          {/* Futuristic 'BALKI' with Cyan to Royal Blue gradient */}
          <span className="text-lg sm:text-2xl font-black tracking-wider bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
            BALKI
          </span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          {/* Geometric 'TECHNOLOGIES' */}
          <span className={`text-[8px] sm:text-[10px] font-extrabold tracking-[0.22em] sm:tracking-[0.28em] uppercase ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            TECHNOLOGIES
          </span>
        </div>
      </div>
    </div>
  );
};
