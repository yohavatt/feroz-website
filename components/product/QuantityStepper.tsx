import styles from "./QuantityStepper.module.css";

// The −/count/+ pill control from Product Detail, also used (at a smaller
// size) by Cart's line items. Kept generic/dumb (no built-in min/max) —
// the consuming page owns any clamping.
export interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** "default" matches Product Detail's dimensions (unchanged, and the
   *  default here so existing usage is unaffected). "compact" matches
   *  Cart's smaller inline dimensions. */
  size?: "default" | "compact";
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  size = "default",
}: QuantityStepperProps) {
  const buttonClass = size === "compact" ? styles.buttonCompact : styles.button;
  const valueClass = size === "compact" ? styles.valueCompact : styles.value;

  return (
    <div className={styles.wrap}>
      <button type="button" onClick={onDecrement} className={buttonClass} aria-label="Decrease quantity">
        &minus;
      </button>
      <span className={valueClass}>{quantity}</span>
      <button type="button" onClick={onIncrement} className={buttonClass} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
