import Image from "next/image";
import styles from "./ProductGallery.module.css";

// Main image + thumbnail row. Source's one live product has exactly one
// image, so `thumbs` renders a single (already-active) thumbnail — built
// generically here for when more images/products exist.
export interface ProductGalleryThumb {
  src: string;
  active: boolean;
  onClick: () => void;
}

export interface ProductGalleryProps {
  mainImage: string;
  mainImageAlt: string;
  thumbs: ProductGalleryThumb[];
}

export function ProductGallery({ mainImage, mainImageAlt, thumbs }: ProductGalleryProps) {
  return (
    <div>
      <div className={styles.mainWrap}>
        <Image
          src={mainImage}
          alt={mainImageAlt}
          fill
          priority
          sizes="(max-width: 720px) 100vw, 50vw"
          className={styles.mainImage}
        />
      </div>
      <div className={styles.thumbs}>
        {thumbs.map((thumb, i) => (
          <button
            key={thumb.src + i}
            type="button"
            onClick={thumb.onClick}
            className={styles.thumbButton}
            style={{ borderColor: thumb.active ? "var(--color-gold-500)" : "transparent" }}
          >
            <Image src={thumb.src} alt="" width={84} height={84} className={styles.thumbImage} />
          </button>
        ))}
      </div>
    </div>
  );
}
