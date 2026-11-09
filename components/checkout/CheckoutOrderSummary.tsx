import Image from "next/image";
import { formatPrice } from "@/lib/products";
import styles from "./CheckoutOrderSummary.module.css";

// Deliberately not a reuse of Cart's OrderSummary/CartLineItem — source's
// Checkout summary is read-only (no qty controls, no remove), uses a
// different shipping model (flat delivery-option cost, not a $150
// threshold), and never shows a discount row (hasDiscount is hardcoded
// false in source, so that row doesn't exist here at all).
export interface CheckoutSummaryItem {
  name: string;
  price: number;
  size: string | null;
  quantity: number;
  image: string;
  /** Present in the approved frozen snapshot but never rendered here —
   *  Checkout's own source data/markup has no color/swatch field or UI
   *  at all (unlike Cart). Kept as data only, for fidelity to the
   *  snapshot, not surfaced visually since source doesn't show it. */
  color?: string | null;
  colorSwatch?: string | null;
}

export interface CheckoutOrderSummaryProps {
  items: CheckoutSummaryItem[];
  subtotal: number;
  shippingLabel: string;
  total: number;
  requiredOk: boolean;
  onPlaceOrder: () => void;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingLabel,
  total,
  requiredOk,
  onPlaceOrder,
}: CheckoutOrderSummaryProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>ORDER SUMMARY</div>

      <div className={styles.items}>
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;
          return (
            <div key={item.name} className={styles.item}>
              <div className={styles.thumbWrap}>
                <Image src={item.image} alt={item.name} fill sizes="52px" className={styles.thumb} />
                <span className={styles.qtyBadge}>{item.quantity}</span>
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                {item.size && <div className={styles.itemSize}>SIZE {item.size}</div>}
              </div>
              <div className={styles.itemTotal}>${formatPrice(lineTotal)}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.divider} />

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div className={styles.row}>
          <span>Shipping</span>
          <span>{shippingLabel}</span>
        </div>
        {/* Discount row intentionally never rendered — source's
            hasDiscount is hardcoded false and there is no promo UI on
            Checkout at all. */}
      </div>

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>${formatPrice(total)}</span>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        className={styles.placeOrderBtn}
        style={{
          background: requiredOk ? "var(--color-ink)" : "rgba(244,239,227,0.12)",
          color: requiredOk ? "var(--color-cream-100)" : "rgba(244,239,227,0.55)",
        }}
      >
        PLACE ORDER
      </button>

      <div className={styles.note}>FREE SHIPPING $150+ &middot; SECURE CHECKOUT</div>
    </div>
  );
}
