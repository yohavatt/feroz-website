import Link from "next/link";
import Image from "next/image";
import styles from "./CategoryCard.module.css";

export interface CategoryCardProps {
  label: string;
  href: string;
  image: string;
  /** Path to the small icon-sell-*.svg glyph shown next to the label. */
  icon: string;
  /** Re-centres the crop when the product in `image` sits off-centre in the
   *  source photo. Omitted everywhere else (defaults to the centred crop). */
  imageObjectPosition?: string;
  /** "grid" (default): image with the caption beneath.
   *  "slide": Home's carousel card — tall image, large icon and label set
   *  on the photo over a scrim. */
  variant?: "grid" | "slide";
}

export function CategoryCard({ label, href, image, icon, imageObjectPosition, variant = "grid" }: CategoryCardProps) {
  const imageFraming = imageObjectPosition
    ? ({ "--card-image-position": imageObjectPosition } as React.CSSProperties)
    : undefined;

  if (variant === "slide") {
    return (
      <Link href={href} className={styles.slideCard}>
        <div className={styles.slideImageWrap} style={imageFraming}>
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 600px) 80vw, (max-width: 1099px) 45vw, 33vw"
            // Off-screen slides sit sideways inside the scroller, where native
            // lazy-loading only starts once they're swiped into view (a blank
            // card mid-transition). Five small images: load them up front.
            loading="eager"
            className={styles.slideImage}
          />
        </div>
        <div className={styles.slideCaption}>
          <span className={styles.slideIcon}>
            <img src={icon} alt="" width={30} height={30} />
          </span>
          <span className={styles.slideLabel}>{label}</span>
          <span className={styles.slideArrow} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="4" y1="12" x2="20" y2="12" />
              <polyline points="13 5 20 12 13 19" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={styles.card}>
      <div className={styles.imageWrap} style={imageFraming}>
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className={styles.image}
        />
      </div>
      <div className={styles.label}>
        {label} <img src={icon} alt="" width={19} height={19} className={styles.icon} />
      </div>
    </Link>
  );
}
