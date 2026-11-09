import Link from "next/link";
import Image from "next/image";
import styles from "./CategoryHero.module.css";

// Reproduces the category-page hero pattern shared by Men/Women/Equipment/
// Sale/Search Results in source: full-bleed photo, gradient overlay,
// breadcrumb, H1, and a short description, all anchored bottom-left.
export interface CategoryHeroProps {
  image: string;
  imageAlt: string;
  /** e.g. "MEN" — rendered after "HOME / " in the breadcrumb. */
  breadcrumbLabel: string;
  title: string;
  description: string;
  /** Defaults to Men/Women/Equipment's value; Sale uses "center 60%". */
  imageObjectPosition?: string;
  /** Defaults to Men/Women/Equipment's overlay gradient; Sale uses a
   *  different angle/opacity stops. */
  overlayGradient?: string;
}

const DEFAULT_OBJECT_POSITION = "center 40%";
const DEFAULT_OVERLAY_GRADIENT =
  "linear-gradient(100deg, rgba(21, 21, 15, 0.75) 0%, rgba(21, 21, 15, 0.35) 45%, rgba(21, 21, 15, 0.15) 100%)";

export function CategoryHero({
  image,
  imageAlt,
  breadcrumbLabel,
  title,
  description,
  imageObjectPosition = DEFAULT_OBJECT_POSITION,
  overlayGradient = DEFAULT_OVERLAY_GRADIENT,
}: CategoryHeroProps) {
  return (
    <div className={styles.hero}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={styles.image}
        style={{ objectPosition: imageObjectPosition }}
      />
      <div className={styles.overlay} style={{ background: overlayGradient }} />
      <div className={styles.content}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbHome}>
            HOME
          </Link>{" "}
          / {breadcrumbLabel}
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
