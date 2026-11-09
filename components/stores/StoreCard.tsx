import styles from "./StoreCard.module.css";

export interface StoreCardData {
  name: string;
  city: string;
  address: string;
  distance: string;
  hours: string;
}

export interface StoreCardProps {
  store: StoreCardData;
  selected: boolean;
  onSelect: () => void;
}

// Source's "VIEW STORE" button has no stopPropagation, so a click on it
// also bubbles up and re-fires the card's own onClick — both call the same
// select(store) handler, which is idempotent. Reproduced as-is rather than
// "fixed" with stopPropagation, per the source-fidelity instruction.
//
// "GET DIRECTIONS" has no onClick at all in source — completely inert.
export function StoreCard({ store, selected, onSelect }: StoreCardProps) {
  return (
    <div
      onClick={onSelect}
      className={styles.card}
      style={{
        background: selected ? "var(--color-olive-950)" : "transparent",
        borderColor: selected ? "var(--color-gold-500)" : "rgba(244,239,227,0.15)",
      }}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.name}>{store.name}</div>
          <div className={styles.city}>{store.city}</div>
        </div>
        <span className={styles.distance}>{store.distance}</span>
      </div>
      <div className={styles.address}>{store.address}</div>
      <div className={styles.hours}>{store.hours}</div>
      <div className={styles.actions}>
        <button type="button" onClick={onSelect} className={styles.viewBtn}>
          VIEW STORE
        </button>
        <button type="button" className={styles.directionsBtn}>
          GET DIRECTIONS
        </button>
      </div>
    </div>
  );
}
