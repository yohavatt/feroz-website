import type { ReactNode } from "react";
import styles from "./SearchFilterPanel.module.css";

// Search Results' own filter dropdown — wider (260px) than the shared
// FilterPanel (240px) and has 3 checkbox sections (Category/Price/Rating)
// instead of just Category, so it's kept page-scoped rather than bolting
// more one-off props onto FilterPanel for a single consumer.
export interface FilterOption {
  key: string;
  label: string;
  active: boolean;
}

export interface SearchFilterPanelProps {
  open: boolean;
  onToggleOpen: () => void;
  categories: (FilterOption & { count: number })[];
  priceRanges: FilterOption[];
  ratingFilters: FilterOption[];
  hasActiveFilters: boolean;
  onToggleCategory: (key: string) => void;
  onTogglePrice: (key: string) => void;
  onToggleRating: (key: string) => void;
  onClearFilters: () => void;
}

function CheckboxRow({
  option,
  onToggle,
  children,
}: {
  option: FilterOption;
  onToggle: (key: string) => void;
  children: ReactNode;
}) {
  return (
    <label onClick={() => onToggle(option.key)} className={styles.row}>
      <span
        className={styles.checkbox}
        style={{ background: option.active ? "var(--color-ink)" : "transparent" }}
      />
      {children}
    </label>
  );
}

export function SearchFilterPanel({
  open,
  onToggleOpen,
  categories,
  priceRanges,
  ratingFilters,
  hasActiveFilters,
  onToggleCategory,
  onTogglePrice,
  onToggleRating,
  onClearFilters,
}: SearchFilterPanelProps) {
  const activeCount =
    categories.filter((c) => c.active).length +
    priceRanges.filter((p) => p.active).length +
    ratingFilters.filter((r) => r.active).length;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={onToggleOpen}
        className={styles.trigger}
        aria-expanded={open}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={2}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        FILTERS
        {activeCount > 0 && <span className={styles.triggerCount}>{activeCount}</span>}
      </button>
      {open && (
        <>
          <div className={styles.scrim} onClick={onToggleOpen} aria-hidden="true" />
          <div className={styles.panel}>
            <div className={styles.grabber} aria-hidden="true" />
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>CATEGORY</span>
            {hasActiveFilters && (
              <span onClick={onClearFilters} className={styles.clearAll}>
                Clear all
              </span>
            )}
          </div>
          <div className={styles.categoryList}>
            {categories.map((cat) => (
              <CheckboxRow key={cat.key} option={cat} onToggle={onToggleCategory}>
                {cat.label} ({cat.count})
              </CheckboxRow>
            ))}
          </div>

          <div className={styles.panelLabel} style={{ marginBottom: 12 }}>
            PRICE
          </div>
          <div className={styles.list}>
            {priceRanges.map((pr) => (
              <CheckboxRow key={pr.key} option={pr} onToggle={onTogglePrice}>
                {pr.label}
              </CheckboxRow>
            ))}
          </div>

          <div className={styles.panelLabel} style={{ marginBottom: 12 }}>
            RATING
          </div>
          <div className={styles.listLast}>
            {ratingFilters.map((rt) => (
              <CheckboxRow key={rt.key} option={rt} onToggle={onToggleRating}>
                {rt.label}
              </CheckboxRow>
            ))}
          </div>
            <button type="button" onClick={onToggleOpen} className={styles.done}>
              DONE
            </button>
          </div>
        </>
      )}
    </div>
  );
}
