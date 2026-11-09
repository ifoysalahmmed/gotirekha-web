interface LogoProps {
  size: number;
}

const G_ROAD = 'M92.9 41A38 38 0 1 0 98 60H68';

const G_CENTRE_LINE = 'M92.9 41A38 38 0 1 0 98 60H73';

export const LogoMark = ({ size }: LogoProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
    <rect width="120" height="120" rx="28" fill="#0B7A55" />
    <path
      d="M79.5 32.2A34 34 0 1 0 94 60H78"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="16"
    />
    <rect x="42" y="51" width="28" height="18" rx="6" fill="#FFFFFF" />
  </svg>
);

export const LogoFull = ({ size }: LogoProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
    <path
      d={G_ROAD}
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d={G_CENTRE_LINE}
      fill="none"
      stroke="#0B7A55"
      strokeWidth="2.2"
      strokeDasharray="5 4.5"
    />
    <g transform="translate(56 60)">
      <rect
        x="-11.5"
        y="-7"
        width="23"
        height="14"
        rx="4.5"
        fill="#101613"
        stroke="#0B7A55"
        strokeWidth="3"
      />
      <rect x="-7" y="-4.6" width="4" height="9.2" rx="1.5" fill="#9FD9BF" />
    </g>
  </svg>
);

export const LogoRoad = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 120"
    opacity="0.14"
    aria-hidden="true"
  >
    <path d={G_ROAD} fill="none" stroke="#FFFFFF" strokeWidth="16" />
    <path
      d={G_CENTRE_LINE}
      fill="none"
      stroke="#0B7A55"
      strokeWidth="2.2"
      strokeDasharray="5 4.5"
    />
  </svg>
);
