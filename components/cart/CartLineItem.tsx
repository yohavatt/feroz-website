import Image from "next/image";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { formatPrice } from "@/lib/products";
import styles from "./CartLineItem.module.css";

export interface CartLineItemData {
  id: number;
  name: string;
  category: string;
  price: number;
  size: string | null;
  color: string | null;
  colorSwatch: string | null;
  quantity: number;
  image: string;
}

export interface CartLineItemProps {
  item: CartLineItemData;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartLineItem({ item, onIncrement, onDecrement, onRemove }: CartLineItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className={styles.row}>
      <div className={styles.imageWrap}>
        <Image src={item.image} alt={item.name} fill sizes="110px" className={styles.image} />
      </div>
      <div className={styles.info}>
        <div className={styles.topLine}>
          <div>
            <div className={styles.category}>{item.category}</div>
            <div className={styles.name}>{item.name}</div>
          </div>
          <button type="button" onClick={onRemove} className={styles.removeBtn} aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {(item.size || item.color) && (
          <div className={styles.metaLine}>
            {item.size && <span>SIZE {item.size}</span>}
            {item.color && (
              <span className={styles.colorMeta}>
                COLOR
                <span
                  className={styles.colorSwatch}
                  style={{ background: item.colorSwatch ?? undefined }}
                />
              </span>
            )}
          </div>
        )}

        <div className={styles.bottomLine}>
          <QuantityStepper
            quantity={item.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            size="compact"
          />
          <div className={styles.priceGroup}>
            <span className={styles.unitPrice}>${formatPrice(item.price)} ea.</span>
            <span className={styles.lineTotal}>${formatPrice(lineTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
