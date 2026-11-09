import styles from "./SortSelect.module.css";

// The 4-option sort dropdown shared by every listing page in source.
export interface SortOption {
  value: string;
  label: string;
}

export interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  /** Search Results has its own 5-option list in a different order
   *  (source has no "rating" sort anywhere else). Omitted everywhere
   *  else, which keeps every other page's option list unchanged. */
  options?: SortOption[];
}

const DEFAULT_OPTIONS: SortOption[] = [
  { value: "featured", label: "Sort: Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export function SortSelect({ value, onChange, options = DEFAULT_OPTIONS }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
