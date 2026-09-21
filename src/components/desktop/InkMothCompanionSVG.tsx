import React from 'react';

interface InkMothCompanionSVGProps {
  mood?: 'welcome' | 'conflict' | 'missing' | 'ready' | 'approved';
  className?: string;
  size?: number;
}

export const InkMothCompanionSVG: React.FC<InkMothCompanionSVGProps> = ({
  mood = 'welcome',
  className = '',
  size = 56,
}) => {
  // Wing color tint based on chapter/mood
  const getWingGradient = () => {
    switch (mood) {
      case 'approved':
        return {
          topA: '#B2D8C6',
          topB: '#4E8B72',
          lowA: '#E7F3ED',
          lowB: '#74AFA0',
          heartFill: '#E6A54F',
          glow: '#4E8B72',
        };
      case 'conflict':
        return {
          topA: '#DCA9B8',
          topB: '#B35858',
          lowA: '#FBEFEF',
          lowB: '#C87878',
          heartFill: '#B35858',
          glow: '#B35858',
        };
      case 'ready':
        return {
          topA: '#F4CE94',
          topB: '#E6A54F',
          lowA: '#FDF8F0',
          lowB: '#D89B48',
          heartFill: '#E6A54F',
          glow: '#E6A54F',
        };
      case 'missing':
        return {
          topA: '#D8CCE4',
          topB: '#9EBDCB',
          lowA: '#F5F0FB',
          lowB: '#6F6587',
          heartFill: '#E6A54F',
          glow: '#9EBDCB',
        };
      case 'welcome':
      default:
        return {
          topA: '#D8CCE4',
          topB: '#6F6587',
          lowA: '#F7F1E5',
          lowB: '#B8A9C9',
          heartFill: '#E6A54F',
          glow: '#6F6587',
        };
    }
  };

  const colors = getWingGradient();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-flutter drop-shadow-md select-none ${className}`}
    >
      <defs>
        {/* Upper wing linear gradient */}
        <linearGradient id={`moth-grad-upper-${mood}`} x1="16" y1="10" x2="48" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.topA} />
          <stop offset="100%" stopColor={colors.topB} />
        </linearGradient>
        {/* Lower wing linear gradient */}
        <linearGradient id={`moth-grad-lower-${mood}`} x1="20" y1="28" x2="44" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.lowA} />
          <stop offset="100%" stopColor={colors.lowB} />
        </linearGradient>
        {/* Soft aura blur */}
        <filter id="moth-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Gentle soft glow background aura */}
      <circle cx="32" cy="32" r="22" fill={colors.glow} opacity="0.15" />

      {/* LOWER WINGS (Origami paper fan fold) */}
      <g opacity="0.95">
        {/* Left lower wing */}
        <path
          d="M32 32L16 44C13 47 15 52 20 51L32 42Z"
          fill={`url(#moth-grad-lower-${mood})`}
          stroke="#262433"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Inner paper crease line left */}
        <path d="M32 34L19 46" stroke="#262433" strokeWidth="0.8" opacity="0.4" strokeDasharray="1 1" />

        {/* Right lower wing */}
        <path
          d="M32 32L48 44C51 47 49 52 44 51L32 42Z"
          fill={`url(#moth-grad-lower-${mood})`}
          stroke="#262433"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Inner paper crease line right */}
        <path d="M32 34L45 46" stroke="#262433" strokeWidth="0.8" opacity="0.4" strokeDasharray="1 1" />
      </g>

      {/* UPPER WINGS (Broad Origami Fold with Ink-tipped edges) */}
      <g>
        {/* Left upper wing */}
        <path
          d="M32 20L8 16C5 15.5 4 19 6.5 21L14 36L32 28Z"
          fill={`url(#moth-grad-upper-${mood})`}
          stroke="#262433"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* Geometric facet fold crease */}
        <path d="M32 24L11 20L18 34" stroke="#262433" strokeWidth="0.9" opacity="0.35" />

        {/* Right upper wing */}
        <path
          d="M32 20L56 16C59 15.5 60 19 57.5 21L50 36L32 28Z"
          fill={`url(#moth-grad-upper-${mood})`}
          stroke="#262433"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* Geometric facet fold crease */}
        <path d="M32 24L53 20L46 34" stroke="#262433" strokeWidth="0.9" opacity="0.35" />
      </g>

      {/* MOTH SLENDER BODY (Folded Paper Quill / Ink Pen tip) */}
      <g>
        {/* Body spine */}
        <path
          d="M32 14L34 26L33.5 48L32 52L30.5 48L30 26L32 14Z"
          fill="#262433"
          stroke="#353043"
          strokeWidth="1"
        />
        {/* Fold crease highlight down spine */}
        <path d="M32 16V49" stroke="#D8CCE4" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />

        {/* Small observant eyes */}
        <circle cx="30" cy="18" r="1.1" fill="#FCFAF6" />
        <circle cx="34" cy="18" r="1.1" fill="#FCFAF6" />
        <circle cx="30" cy="18" r="0.6" fill="#262433" />
        <circle cx="34" cy="18" r="0.6" fill="#262433" />

        {/* Long Feathery Calligraphy Antennae */}
        <path
          d="M31 14C29 10 24 7 19 8C17 8.5 16 10 18 10.5C21 11 25 12 29 13.5"
          stroke="#262433"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M33 14C35 10 40 7 45 8C47 8.5 48 10 46 10.5C43 11 39 12 35 13.5"
          stroke="#262433"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>

      {/* HEART-SHAPED WAX SEAL (Chest talisman of Safe Passage) */}
      <g>
        <circle cx="32" cy="27" r="4.5" fill="#262433" />
        <circle cx="32" cy="27" r="3.8" fill={colors.heartFill} />
        {/* Crisp little heart impression */}
        <path
          d="M32 25.8C31.5 24.8 29.8 24.8 29.3 25.8C28.8 26.8 32 29 32 29C32 29 35.2 26.8 34.7 25.8C34.2 24.8 32.5 24.8 32 25.8Z"
          fill="#262433"
        />
      </g>
    </svg>
  );
};
