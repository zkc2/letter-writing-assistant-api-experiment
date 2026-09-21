import React from 'react';

interface BureauIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

// 1. Intake: Floating Memory Fragment / Whispering Envelope
export const BureauFragmentIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Floating slanted paper fragment with folded corner */}
    <path
      d="M5 4.5C5 3.67 5.67 3 6.5 3H15.5L20 7.5V19.5C20 20.33 19.33 21 18.5 21H6.5C5.67 21 5 20.33 5 19.5V4.5Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M15 3V8H20"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Whisper quill lines on the fragment */}
    <path
      d="M9 12H15M9 15.5H13"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Gentle small spark/moth dust */}
    <circle cx="3.5" cy="7.5" r="1" fill="currentColor" />
  </svg>
);

// 2. Timeline: Thread of Hours / Hourglass Ribbon
export const BureauTimelineIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Bureau hour thread & pendulum / hourglass */}
    <path
      d="M7 4H17M7 20H17"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M8 4C8 9 12 12 12 12C12 12 16 9 16 4"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M8 20C8 15 12 12 12 12C12 12 16 15 16 20"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Falling ink particle */}
    <circle cx="12" cy="14.5" r="1" fill="currentColor" />
    <path
      d="M3 12H5M19 12H21"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray="1 2"
    />
  </svg>
);

// 3. Case File: Bureau Dossier with Wax Cord / Clasp
export const BureauDossierIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Folder back & flap */}
    <path
      d="M3.5 6.5C3.5 5.67 4.17 5 5 5H9.5L11.5 7H19C19.83 7 20.5 7.67 20.5 8.5V18.5C20.5 19.33 19.83 20 19 20H5C4.17 20 3.5 19.33 3.5 18.5V6.5Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Wax tie button & string */}
    <circle cx="12" cy="13.5" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M12 16V19"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <circle cx="12" cy="13.5" r="0.8" fill="currentColor" />
  </svg>
);

// 4. Draft Letter: Parchment Scroll & Ink Quill
export const BureauDraftIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Curled parchment sheet */}
    <path
      d="M19 17V5C19 3.9 18.1 3 17 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M19 17C17.9 17 17 17.9 17 19C17 20.1 17.9 21 19 21C20.1 21 21 20.1 21 19V17H19Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    />
    {/* Letter lines */}
    <path
      d="M8.5 7.5H15M8.5 11H15M8.5 14.5H12.5"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

// 5. Approved: Amber Wax Seal of Safe Passage
export const BureauSealIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Scalloped wax seal edge */}
    <path
      d="M12 2.5L14.2 4.2L16.9 3.8L18.4 6.1L21 6.8L21.4 9.6L23.2 11.7L22.2 14.3L23.1 16.9L21.1 18.8L20.8 21.6L18 22L16.4 24.2L13.8 23.4L11.5 24.8L9.7 22.7L7 22.4L6.1 19.8L3.8 19L3.9 16.2L1.8 14.3L2.6 11.7L1.1 9.3L3.4 7.7L3.9 4.9L6.6 4.7L8.4 2.6L11 3.4L12 2.5Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      opacity="0.9"
    />
    <circle cx="12" cy="13" r="5.5" stroke="currentColor" strokeWidth={strokeWidth} />
    {/* Seal heart / safe crest */}
    <path
      d="M12 11C11.3 9.8 9.5 9.9 8.9 11.2C8.3 12.5 12 15.5 12 15.5C12 15.5 15.7 12.5 15.1 11.2C14.5 9.9 12.7 9.8 12 11Z"
      fill="currentColor"
    />
  </svg>
);

// 6. Ink Moth / Paper Spirit Icon
export const InkMothIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Slender folded paper body */}
    <path
      d="M12 5V19"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Moth antennae curled like ink swirls */}
    <path
      d="M12 5C10.5 3 8 2.5 7 3.5"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M12 5C13.5 3 16 2.5 17 3.5"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Geometric origami upper wings */}
    <path
      d="M12 7L4 9L6 14L12 11Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M12 7L20 9L18 14L12 11Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Soft lower wings */}
    <path
      d="M12 12L7 16L9 19L12 17Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M12 12L17 16L15 19L12 17Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Heart seal dot on chest */}
    <circle cx="12" cy="9.5" r="1.2" fill="currentColor" />
  </svg>
);

// 7. Bureau Archive Vault (Case History)
export const BureauArchiveIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="3" y="4" width="18" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
    <rect x="3" y="14" width="18" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
    <line x1="10" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="10" y1="17" x2="14" y2="17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

// 8. Bureau Ink & Typography (Settings)
export const BureauSettingIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Calligraphy ink bottle / brass nib */}
    <path
      d="M8 4H16V7H8V4Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M5 9C5 7.9 5.9 7 7 7H17C18.1 7 19 7.9 19 9V18C19 19.7 17.7 21 16 21H8C6.3 21 5 19.7 5 18V9Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    />
    <path
      d="M12 10V15M10 12.5L14 12.5"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
  </svg>
);

// 9. Bureau Safe Boundary Lock (Privacy)
export const BureauBoundaryIcon: React.FC<BureauIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M8 10V6.5C8 4.57 9.57 3 11.5 3H12.5C14.43 3 16 4.57 16 6.5V10"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    <path d="M12 16.5V18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);
