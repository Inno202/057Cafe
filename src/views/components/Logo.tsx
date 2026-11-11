/** The 057 roundel: flame over a crossed fork and spatula, drawn as one SVG. */
export const Logo = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 56 56" className={`size-12 shrink-0 ${className}`} role="img" aria-label="057 Cafè logo">
    <circle cx="28" cy="28" r="27" fill="#fff" stroke="#000" strokeWidth="2" />
    <circle cx="28" cy="28" r="24" fill="#000" />
    <circle cx="28" cy="28" r="21" fill="none" stroke="#fff" strokeOpacity="0.25" />
    <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M17.5 43.5 38 23" />
      <path d="M38.5 43.5 18 23" />
      <path d="M14.5 21.5 18 25M16.5 19.5 20 23M18.5 17.5 22 21" />
      <rect x="35.6" y="16.2" width="6" height="7.5" rx="1" transform="rotate(45 38.6 20)" />
    </g>
    <path
      fill="#fff"
      d="M28 11c.6 2.6 2.2 4.2 3.5 5.7 1.3 1.5 2.3 3 2.3 5a5.8 5.8 0 0 1-11.6 0c0-1.5.6-2.8 1.6-3.9.3 1.3 1 2.1 1.9 2.5-.3-3.200 .6-6.800 2.300-9.300Z"
    />
  </svg>
);
