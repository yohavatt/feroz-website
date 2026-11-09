import Link from "next/link";
import Image from "next/image";
import styles from "./SaleCollectionTile.module.css";

// The full-bleed promo banner used 4x on the Sale page (Men's/Women's/
// Equipment's Sale + Summer's Promotion). Not a product card — these tiles
// carry no product/pricing data, just marketing copy and a CTA.

export interface SaleCollectionTileBadge {
  text: string;
  bg: string;
  color: string;
}

export interface SaleCollectionTileProps {
  id: string;
  image: string;
  imageAlt: string;
  imageObjectPosition: string;
  /** One badge on most tiles; Summer's Promotion has two. */
  badges: SaleCollectionTileBadge[];
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  /** "fill": hover to cream bg / ink text (Men's tile).
   *  "fade": hover to opacity 0.9, bg unchanged (Women's/Equipment's/Summer's). */
  ctaHoverVariant: "fill" | "fade";
}

export function SaleCollectionTile({
  id,
  image,
  imageAlt,
  imageObjectPosition,
  badges,
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
  ctaHoverVariant,
}: SaleCollectionTileProps) {
  return (
    <div id={id} className={styles.tile}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className={styles.image}
        style={{ objectPosition: imageObjectPosition }}
      />
      <div className={styles.overlay} />
      <div className={styles.badges}>
        {badges.map((badge) => (
          <span
            key={badge.text}
            className={styles.badge}
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.text}
          </span>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <Link
          href={ctaHref}
          className={ctaHoverVariant === "fill" ? styles.ctaFill : styles.ctaFade}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
