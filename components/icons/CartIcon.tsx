import type { IconProps } from "./types";

// Matches the nav cart icon and the Home hero "SHOP NOW" icon — same path,
// used at two different sizes/colors in source.
export function CartIcon({
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
      <path d="M3 5h2l2 12h11l2-8H7" />
      <circle cx="9" cy="20" r="1.4" fill={color} />
      <circle cx="17" cy="20" r="1.4" fill={color} />
    </svg>
  );
}
