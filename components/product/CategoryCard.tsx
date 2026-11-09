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
}

export function CategoryCard({ label, href, image, icon, imageObjectPosition }: CategoryCardProps) {
  const imageFraming = imageObjectPosition
    ? ({ "--card-image-position": imageObjectPosition } as React.CSSProperties)
    : undefined;

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
