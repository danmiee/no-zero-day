export default function MethodIcon({ id, color, size = 22 }) {
  const c = color || 'var(--accentInk)';
  const common = { fill: 'none', stroke: c, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {id === 'a' && (
        <g {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M12 4v16M4 12h16" />
        </g>
      )}
      {id === 'b' && (
        <g {...common}>
          <circle cx="8"  cy="9" r="2.6" />
          <circle cx="16" cy="9" r="2.6" />
          <path d="M3.5 18.5c0-2.8 2-4.3 4.5-4.3s4.5 1.5 4.5 4.3" />
          <path d="M11.5 18.5c0-2.8 2-4.3 4.5-4.3s4.5 1.5 4.5 4.3" />
        </g>
      )}
      {id === 'c' && (
        <g {...common}>
          <circle cx="12" cy="13.5" r="7" />
          <path d="M12 6.5v-3M9.5 3.5h5M12 13.5l3.2-2.6" />
        </g>
      )}
    </svg>
  );
}
