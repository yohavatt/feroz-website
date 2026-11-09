import Image from "next/image";
import styles from "./AboutSplitSection.module.css";

// One of the 4 alternating image/text panels on the About Us page. The text
// panel is a background photo with a flat dark scrim (not CategoryHero's
// gradient) and centered content; the photo panel is a plain cover image.
// Source alternates by literally swapping which panel comes first in the
// markup (Sections 2/4 also carry explicit but functionally redundant
// `order:1`/`order:2` values that match natural DOM order) — reproduced
// here the same way, by swapping JSX position, so reading/DOM order for
// reversed sections matches source exactly rather than only the visuals.
export interface AboutSplitSectionProps {
  eyebrow: string;
  heading: string;
  /** Sections 1–3 use the larger size; Section 4's source value is smaller. */
  headingSize: string;
  body: string;
  photoSrc: string;
  photoAlt: string;
  bgSrc: string;
  /** True when the text panel renders on the left / photo on the right
   *  (Sections 2 and 4 in source). */
  reversed?: boolean;
  /** Section 3 only — top-bordered tags, not pills/badges. */
  tags?: string[];
  /** Section 1 only — source gives the first section (right under the page
   *  title) extra top padding that no other section has. */
  topPadding?: string;
  /** Section 4 only — source's last section (right above the footer) uses a
   *  larger bottom padding than sections 1–3. */
  bottomPadding?: string;
}

export function AboutSplitSection({
  eyebrow,
  heading,
  headingSize,
  body,
  photoSrc,
  photoAlt,
  bgSrc,
  reversed = false,
  tags,
  topPadding = "0",
  bottomPadding = "clamp(72px, 8vw, 110px)",
}: AboutSplitSectionProps) {
  const photoPanel = (
    <div className={styles.photoPanel}>
      <Image src={photoSrc} alt={photoAlt} fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.photo} />
    </div>
  );

  const textPanel = (
    <div className={styles.textPanel}>
      <Image src={bgSrc} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.bg} />
      <div className={styles.scrim} />
      <div className={styles.content}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h2 className={styles.heading} style={{ fontSize: headingSize }}>
          {heading}
        </h2>
        <p className={styles.body}>{body}</p>
        {tags && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.grid} style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}>
      {reversed ? (
        <>
          {textPanel}
          {photoPanel}
        </>
      ) : (
        <>
          {photoPanel}
          {textPanel}
        </>
      )}
    </div>
  );
}
