import styles from "./DeliveryOption.module.css";

export interface DeliveryOptionProps {
  title: string;
  eta: string;
  priceLabel: string;
  selected: boolean;
  onSelect: () => void;
}

export function DeliveryOption({ title, eta, priceLabel, selected, onSelect }: DeliveryOptionProps) {
  return (
    <label
      onClick={onSelect}
      className={styles.option}
      style={{ borderColor: selected ? "var(--color-gold-500)" : "rgba(244,239,227,0.15)" }}
    >
      <div className={styles.left}>
        <span className={styles.radio}>
          {selected && <span className={styles.radioDot} />}
        </span>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.eta}>{eta}</div>
        </div>
      </div>
      <div className={styles.price}>{priceLabel}</div>
    </label>
  );
}
