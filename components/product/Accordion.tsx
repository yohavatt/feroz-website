import styles from "./Accordion.module.css";

// Generic single-open accordion. Fully controlled/dumb — the caller
// decides what "open" means, including the source's toggle-closes-self
// behavior (openIndex === i ? -1 : i), so all items can end up collapsed.
export interface AccordionItemData {
  label: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  openIndex: number;
  onToggle: (index: number) => void;
}

export function Accordion({ items, openIndex, onToggle }: AccordionProps) {
  return (
    <div className={styles.wrap}>
      {items.map((item, i) => {
        const open = i === openIndex;
        return (
          <div key={item.label} className={styles.item}>
            <button type="button" onClick={() => onToggle(i)} className={styles.header}>
              {item.label}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth={2}
                className={styles.chevron}
                style={{ transform: open ? "rotate(180deg)" : undefined }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {open && <div className={styles.content}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
