import type { IconProps } from "./types";

// Matches the wishlist heart icon on product cards.
export function WishlistIcon({
  size = 15,
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
      <path d="M12 20s-7-4.3-9.5-9A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121.5 11c-2.5 4.7-9.5 9-9.5 9z" />
    </svg>
  );
}
