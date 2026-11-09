import styles from "./StoreDetailModal.module.css";

export interface StoreDetail {
  name: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  categories: string[];
}

export interface StoreDetailModalProps {
  store: StoreDetail;
  onClose: () => void;
}

// Backdrop click closes; clicking inside the modal card stops propagation
// so it doesn't also close, matching source's onClick/stopProp pair
// exactly. The modal's own GET DIRECTIONS has no onClick in source —
// inert, same as the card's.
export function StoreDetailModal({ store, onClose }: StoreDetailModalProps) {
  return (
    <div onClick={onClose} className={styles.backdrop}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modal}>
        <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div className={styles.city}>{store.city}</div>
        <h2 className={styles.name}>{store.name}</h2>

        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.8} className={styles.infoIcon}>
              <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
              <circle cx="12" cy="9" r="2.3" />
            </svg>
            {store.address}
          </div>
          <div className={styles.infoRow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.8} className={styles.infoIcon}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            {store.hours}
          </div>
          <div className={styles.infoRow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.8} className={styles.infoIcon}>
              <path d="M4 5c0 8 7 15 15 15l2-4-5-3-2 2c-2-1-4-3-5-5l2-2-3-5z" />
            </svg>
            {store.phone}
          </div>
        </div>

        <div className={styles.categoriesLabel}>AVAILABLE CATEGORIES</div>
        <div className={styles.categories}>
          {store.categories.map((cat) => (
            <span key={cat} className={styles.categoryPill}>
              {cat}
            </span>
          ))}
        </div>

        <button type="button" className={styles.directionsBtn}>
          GET DIRECTIONS
        </button>
      </div>
    </div>
  );
}
