import { SlidersIcon } from "../icons";
import styles from "./FilterPanel.module.css";

// Reproduces the "FILTERS" button + category-checkbox dropdown shared by
// Men/Women/Equipment listing pages. Purely controlled — the consuming
// page owns open/active state and filtering logic.
//
// At <=600px the same panel is restyled into a bottom sheet: the scrim and
// the Done button below are display:none on desktop, so the approved
// dropdown is untouched there. They exist because a sheet pinned to the
// bottom of the viewport can outlive its trigger scrolling away, and
// without them there would be no way to dismiss it.
export interface FilterPanelCategory {
  key: string;
  label: string;
  count: number;
  active: boolean;
}

export interface FilterPanelProps {
  categories: FilterPanelCategory[];
  open: boolean;
  onToggleOpen: () => void;
  onToggleCategory: (key: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  categories,
  open,
  onToggleOpen,
  onToggleCategory,
  onClearFilters,
}: FilterPanelProps) {
  const hasActiveFilters = categories.some((c) => c.active);
  const activeCount = categories.filter((c) => c.active).length;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={onToggleOpen}
        className={styles.trigger}
        aria-expanded={open}
      >
        <SlidersIcon color="var(--color-gold-500)" />
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
                <label
                  key={cat.key}
                  onClick={() => onToggleCategory(cat.key)}
                  className={styles.categoryRow}
                >
                  <span
                    className={styles.checkbox}
                    style={{ background: cat.active ? "var(--color-ink)" : "transparent" }}
                  />
                  {cat.label} ({cat.count})
                </label>
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
