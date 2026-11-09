"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, type ProductCardBadge } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/product/EmptyState";
import { CartLineItem, type CartLineItemData } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { CartIcon } from "@/components/icons";
import styles from "./page.module.css";

// Source (FEROZ Cart.dc.html) seeds the cart with exactly these 3 items,
// entirely local component state — not persisted, and not connected to
// Product Detail's "Add to Cart" (which itself doesn't touch any shared
// store). This page owns its own mock seed data the same way.
const INITIAL_ITEMS: CartLineItemData[] = [
  { id: 1, name: "Summit Shell Jacket", category: "Men / Jackets", price: 249.99, size: "M", color: null, colorSwatch: null, quantity: 1, image: "/assets/men-summit-shell.jpg" },
  { id: 2, name: "Glacier Storm Pant", category: "Men / Pants", price: 159.99, size: "L", color: null, colorSwatch: null, quantity: 1, image: "/assets/men-pant-snow.jpg" },
  { id: 3, name: "Ridgeline Tech Tee", category: "Men / T-Shirts", price: 49.99, size: "M", color: "Olive", colorSwatch: "#3E4A30", quantity: 2, image: "/assets/men-tee-mountain.jpg" },
];

const NEW_BADGE: ProductCardBadge = { text: "NEW", bg: "var(--color-gold-500)", color: "var(--color-ink)" };
const BESTSELLER_BADGE: ProductCardBadge = { text: "BEST SELLER", bg: "var(--color-ink)", color: "var(--color-cream-100)" };

const RECOMMENDED = [
  { slug: "ridge-softshell", name: "Ridge Softshell", price: 199.99, rating: 5, image: "/assets/men-ridge-softshell.jpg", badge: null },
  { slug: "storm-parka", name: "Storm Parka", price: 349.99, rating: 4, image: "/assets/men-storm-parka.jpg", badge: NEW_BADGE },
  { slug: "canopy-trail-tee", name: "Canopy Trail Tee", price: 49.99, rating: 4, image: "/assets/men-tee-forest.jpg", badge: BESTSELLER_BADGE },
  { slug: "mesa-trail-pant", name: "Mesa Trail Pant", price: 159.99, rating: 4, image: "/assets/men-pant-desert.jpg", badge: null },
];

const FREE_SHIPPING_THRESHOLD = 150;
const PROMO_CODE = "FEROZ10";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartLineItemData[]>(INITIAL_ITEMS);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);

  function inc(id: number) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: Math.min(9, it.quantity + 1) } : it)));
  }
  function dec(id: number) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it)));
  }
  function remove(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (code === PROMO_CODE) {
      setPromoCode(PROMO_CODE);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoCode(null);
    }
  }

  function handlePromoInputChange(value: string) {
    setPromoInput(value);
    setPromoError(false);
  }

  const isEmpty = items.length === 0;
  const hasItems = items.length > 0;
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12;
  const discountAmount = promoCode === PROMO_CODE ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discountAmount;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <>
      <Nav cartCount={hasItems ? itemCount : undefined} />

      {isEmpty && (
        <EmptyState
          icon={<CartIcon size={56} color="var(--color-gold-500)" strokeWidth={1.4} />}
          title="YOUR CART IS EMPTY"
          description="Looks like you haven’t added any gear yet. Explore the collection and find what’s built for your next route."
          ctaHref="/men"
          ctaLabel="CONTINUE SHOPPING"
        />
      )}

      {hasItems && (
        <>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>YOUR CART</h1>
            <div className={styles.itemCount}>{itemCount} ITEM(S) IN YOUR CART</div>
          </div>

          <div className={styles.contentGrid}>
            <div>
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onIncrement={() => inc(item.id)}
                  onDecrement={() => dec(item.id)}
                  onRemove={() => remove(item.id)}
                />
              ))}
              <div className={styles.continueShoppingWrap}>
                <Link href="/men" className={styles.continueShopping}>
                  &larr; CONTINUE SHOPPING
                </Link>
              </div>
            </div>

            <OrderSummary
              subtotal={subtotal}
              shippingLabel={shipping === 0 ? "FREE" : `$${shipping}`}
              hasDiscount={discountAmount > 0}
              discountAmount={discountAmount}
              total={total}
              promoInput={promoInput}
              onPromoInputChange={handlePromoInputChange}
              onApplyPromo={applyPromo}
              promoError={promoError}
              onCheckout={() => router.push("/checkout")}
              shippingNote={
                remaining > 0 ? `ADD $${remaining} MORE FOR FREE SHIPPING` : "FREE SHIPPING $150+ APPLIED"
              }
              shippingNoteColor={remaining > 0 ? "rgba(244,239,227,0.5)" : "var(--color-gold-500)"}
            />
          </div>
        </>
      )}

      <div className={styles.recommendedSection}>
        <div className={styles.recommendedHeader}>
          <h2 className={styles.recommendedHeading}>YOU MAY ALSO LIKE</h2>
          <Link href="/men" className={styles.viewAll}>
            VIEW ALL &rarr;
          </Link>
        </div>
        <div className={styles.recommendedGrid}>
          {RECOMMENDED.map((p) => (
            <ProductCard
              key={p.slug}
              name={p.name}
              href={`/product/${p.slug}`}
              image={p.image}
              price={p.price}
              rating={p.rating}
              badge={p.badge}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
