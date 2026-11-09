import styles from "./SizeSelector.module.css";

// Product Detail's size grid — visually distinct from the inline size
// chips used on Men/Women listing cards (different dimensions/radius),
// so it's its own component rather than a reuse of that pattern.
export interface SizeSelectorOption {
  label: string;
  disabled?: boolean;
}

export interface SizeSelectorProps {
  sizes: SizeSelectorOption[];
  selected: string | null;
  onSelect: (label: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>
          SIZE {!selected && <span className={styles.required}>(required)</span>}
        </span>
        {/* Decorative only in source — no href, no click handler. */}
        <span className={styles.sizeGuide}>Size Guide</span>
      </div>
      <div className={styles.options}>
        {sizes.map((sz) => {
          const isSelected = sz.label === selected;
          const className = sz.disabled
            ? styles.optionDisabled
            : isSelected
              ? styles.optionSelected
              : styles.option;
          return (
            <button
              key={sz.label}
              type="button"
              disabled={sz.disabled}
              onClick={sz.disabled ? undefined : () => onSelect(sz.label)}
              className={className}
            >
              {sz.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
