import { formatPrice } from "@/lib/products";
import styles from "./OrderSummary.module.css";

export interface OrderSummaryProps {
  subtotal: number;
  shippingLabel: string;
  hasDiscount: boolean;
  discountAmount: number;
  total: number;
  promoInput: string;
  onPromoInputChange: (value: string) => void;
  onApplyPromo: () => void;
  promoError: boolean;
  onCheckout: () => void;
  shippingNote: string;
  shippingNoteColor: string;
}

export function OrderSummary({
  subtotal,
  shippingLabel,
  hasDiscount,
  discountAmount,
  total,
  promoInput,
  onPromoInputChange,
  onApplyPromo,
  promoError,
  onCheckout,
  shippingNote,
  shippingNoteColor,
}: OrderSummaryProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>ORDER SUMMARY</div>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div className={styles.row}>
          <span>Shipping</span>
          <span>{shippingLabel}</span>
        </div>
        {hasDiscount && (
          <div className={styles.discountRow}>
            <span>Promo (FEROZ10)</span>
            <span>&minus;${formatPrice(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className={styles.promoRow}>
        <input
          type="text"
          placeholder="Promo code"
          value={promoInput}
          onChange={(e) => onPromoInputChange(e.target.value)}
          className={styles.promoInput}
        />
        <button type="button" onClick={onApplyPromo} className={styles.applyBtn}>
          APPLY
        </button>
      </div>
      {promoError && <div className={styles.promoError}>Code not recognized.</div>}

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Estimated Total</span>
        <span className={styles.totalValue}>${formatPrice(total)}</span>
      </div>

      <button type="button" onClick={onCheckout} className={styles.checkoutBtn}>
        PROCEED TO CHECKOUT
      </button>

      <div className={styles.shippingNote} style={{ color: shippingNoteColor }}>
        {shippingNote}
      </div>
    </div>
  );
}
