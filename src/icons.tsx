import type { CSSProperties } from "react";

const paths = {
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  diagonal: (
    <>
      <path d="M6 18 18 6M6 6h12v12" />
    </>
  ),
  down: (
    <>
      <path d="m6 9 6 6 6-6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  bookmark: (
    <>
      <path d="M6 4h12v17l-6-4-6 4z" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  heart: (
    <>
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4M21 13v3a2 2 0 0 1-2 2H3" />
    </>
  ),
  message: (
    <>
      <path d="M21 11.5A8.5 8.5 0 0 1 12.5 20H4l-2 2v-10A9.5 9.5 0 1 1 21 11.5Z" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  bolt: <path d="m13 2-9 12h7l-1 8 10-12h-7z" />,
  share: (
    <>
      <path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7" />
    </>
  ),
  code: (
    <>
      <path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-17-2 20" />
    </>
  ),
  x: (
    <>
      <path d="M4 3h4l12 18h-4zM20 3 4 21" />
    </>
  ),
};
export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 20,
  style,
  className = "",
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function FrogMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 17C3 8 12 3 18 10c1-.4 3-.4 4 0 6-7 15-2 10 7 8 11 0 19-12 19S0 28 8 17Z"
        fill="currentColor"
      />
      <ellipse cx="13" cy="15" rx="4.4" ry="5.4" fill="#101810" />
      <ellipse cx="27" cy="15" rx="4.4" ry="5.4" fill="#101810" />
      <circle cx="14" cy="15" r="1.8" fill="#c2ed86" />
      <circle cx="26" cy="15" r="1.8" fill="#c2ed86" />
      <path
        d="M9 25c6 5 16 5 22-1"
        stroke="#101810"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
