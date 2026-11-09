import type { IconProps } from "./types";

// Matches the "FILTERS" button icon on category/listing pages.
export function SlidersIcon({
  size = 13,
  color = "currentColor",
  strokeWidth = 2,
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
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}
