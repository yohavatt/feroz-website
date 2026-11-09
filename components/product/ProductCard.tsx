import Link from "next/link";
import Image from "next/image";
import { RatingStars } from "./RatingStars";
import { WishlistIcon } from "../icons";
import { formatPrice } from "@/lib/products";
import styles from "./ProductCard.module.css";

export interface ProductCardBadge {
  text: string;
  /** CSS color value, e.g. "var(--color-gold-500)" or a literal hex. */
  bg: string;
  color: string;
}

export interface ProductCardSize {
  label: string;
  bg: string;
  color: string;
  border: string;
  onClick: () => void;
}

export interface ProductCardProps {
  name: string;
  href: string;
  image: string;
  price: number;
  compareAt?: number;
  /** Only rendered when compareAt is also set — matches source's Men/Women listing cards. */
  discountPct?: number | null;
  rating: number;
  badge?: ProductCardBadge | null;
  /** When provided, renders the size-chip row (Men/Women listing cards). */
  sizes?: ProductCardSize[];
  /** Home's featured-product cards have a literal empty trailing div
   *  (`margin-top:10px`) after the price row in source, even though it's
   *  never populated. Equipment (and other non-apparel listings) have no
   *  such div at all. This opt-in reproduces Home's spacer exactly without
   *  adding it anywhere it isn't in source. */
  showEmptySpacer?: boolean;
  /** Crops a single card's photo closer when its source image is framed
   *  further out than its siblings. Omitted (undefined) everywhere else,
   *  which leaves every other card's framing exactly as it was. */
  imageScale?: number;
  /** Re-centres that closer crop when the subject sits off-centre in the
   *  source photo. Omitted everywhere else (defaults to the centred crop). */
  imageObjectPosition?: string;
}

export function ProductCard({
  name,
  href,
  image,
  price,
  compareAt,
  discountPct,
  rating,
  badge,
  sizes,
  showEmptySpacer,
  imageScale,
  imageObjectPosition,
}: ProductCardProps) {
  const imageFraming =
    imageScale || imageObjectPosition
      ? ({
          ...(imageScale ? { "--card-image-scale": imageScale } : {}),
          ...(imageObjectPosition ? { "--card-image-position": imageObjectPosition } : {}),
        } as React.CSSProperties)
      : undefined;

  return (
    <div>
      <div className={styles.imageWrap} style={imageFraming}>
        <Link href={href} className={styles.imageLink}>
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={styles.image}
          />
        </Link>
        {badge && (
          <span
            className={styles.badge}
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.text}
          </span>
        )}
        <button type="button" className={styles.wishlistBtn} aria-label="Add to wishlist">
          <WishlistIcon />
        </button>
      </div>
      <div className={styles.info}>
        <RatingStars rating={rating} />
        <Link href={href} className={styles.name}>
          {name}
        </Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>${formatPrice(price)}</span>
          {compareAt != null && (
            <span className={styles.compareAt}>${formatPrice(compareAt)}</span>
          )}
          {compareAt != null && discountPct != null && (
            <span className={styles.discountPct}>&minus;{discountPct}%</span>
          )}
        </div>
        {sizes && sizes.length > 0 ? (
          <div className={styles.sizes}>
            {sizes.map((sz) => (
              <span
                key={sz.label}
                onClick={sz.onClick}
                className={styles.sizeChip}
                style={{ background: sz.bg, color: sz.color, borderColor: sz.border }}
              >
                {sz.label}
              </span>
            ))}
          </div>
        ) : showEmptySpacer ? (
          // Home-only: reproduces its literal empty trailing div.
          <div className={styles.swatches} />
        ) : null}
      </div>
    </div>
  );
}
