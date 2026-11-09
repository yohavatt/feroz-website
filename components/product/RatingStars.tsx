import { StarIcon } from "../icons";
import styles from "./RatingStars.module.css";

interface RatingStarsProps {
  /** 0-5. Source builds this as [0,1,2,3,4].map(i => i < rating) — same here. */
  rating: number;
  size?: number;
}

export function RatingStars({ rating, size = 12 }: RatingStarsProps) {
  return (
    <div className={styles.stars}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} size={size} filled={i < rating} />
      ))}
    </div>
  );
}
