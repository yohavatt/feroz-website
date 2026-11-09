import type { IconProps } from "./types";

// Matches the nav account icon in every FEROZ source page.
export function AccountIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={className}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20c1.5-4.5 5-6 8-6s6.5 1.5 8 6" />
    </svg>
  );
}
