"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RatingStars } from "@/components/product/RatingStars";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SizeSelector } from "@/components/product/SizeSelector";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { Accordion } from "@/components/product/Accordion";
import { CartIcon } from "@/components/icons";
import { getRelatedProducts, formatPrice, type Product } from "@/lib/products";
import styles from "./ProductDetailView.module.css";

// Data-driven version of the approved Product Detail template. The JSX/CSS
// below is unchanged from the original Summit-only implementation — only
// the data source changed, from hardcoded module constants to this
// component's `product` prop (see lib/products.ts for the catalog).

const SIZE_LABELS = ["S", "M", "L", "XL", "XXL"];

// Feature-strip items carry no icon in source (empty icon string) — text only.
const MINI_FEATURES = ["FREE SHIPPING $150+", "30-DAY RETURNS", "2-YEAR WARRANTY"];

// The 4 feature-card icons are a fixed part of the approved visual design
// (same shapes for every product, per slot) — only each slot's title/desc
// text comes from product data.
const FEATURE_ICONS = [
  <svg key="0" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.6}>
    <path d="M12 3C8 7 6 11 12 21c6-10 4-14 0-18z" />
  </svg>,
  <svg key="1" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.6}>
    <path d="M12 3l4 6h-3v5h-2v-5H8z" />
    <path d="M12 8l4 6h-3v5h-2v-5H8z" />
  </svg>,
  <svg key="2" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.6}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="16" r="3" />
    <line x1="10" y1="10" x2="14" y2="14" />
  </svg>,
  <svg key="3" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.6}>
    <circle cx="7" cy="6" r="2" />
    <path d="M7 8v5l-3 8m3-8l3 8m-3-8l4-3 3 2 3-1" />
  </svg>,
];

const UNAVAILABLE_SIZES_DEFAULT: string[] = [];

export interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  // Source starts with the first accordion item already open.
  const [openTab, setOpenTab] = useState(0);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  // Phone-only sticky buy bar: revealed once the real Add to Cart row has
  // scrolled above the viewport, so the primary action stays reachable
  // through the accordion, features and related-products sections.
  const addRowRef = useRef<HTMLDivElement>(null);
  const [showBuyBar, setShowBuyBar] = useState(false);

  const IMAGES = [product.image];
  const unavailableSizes = product.unavailableSizes ?? UNAVAILABLE_SIZES_DEFAULT;
  const related = getRelatedProducts(product);

  const canAdd = !(product.hasSizes && !selectedSize);

  function handleSelectSize(label: string) {
    setSelectedSize(label);
    setShowSizeWarning(false);
  }

  function handleToggleTab(i: number) {
    setOpenTab((prev) => (prev === i ? -1 : i));
  }

  function handleAddToCart() {
    if (product.hasSizes && !selectedSize) {
      setShowSizeWarning(true);
      return;
    }
    router.push("/cart");
  }

  useEffect(() => {
    const row = addRowRef.current;
    if (!row) return;
    // Measured per frame rather than via IntersectionObserver: a jump in
    // scroll position (anchor link, restored position, fast fling) can go
    // from "below the viewport" straight to "above" it, crossing no
    // threshold, and the observer would never fire.
    let frame = 0;
    const measure = () => {
      frame = 0;
      setShowBuyBar(row.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const thumbs = IMAGES.map((src, i) => ({
    src,
    active: i === activeImage,
    onClick: () => setActiveImage(i),
  }));

  const sizes = SIZE_LABELS.map((label) => ({
    label,
    disabled: unavailableSizes.includes(label),
  }));

  return (
    <>
      <Nav />

      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbText}>
          <Link href="/" className={styles.breadcrumbLink}>
            HOME
          </Link>{" "}
          /{" "}
          <Link href={product.sectionHref} className={styles.breadcrumbLink}>
            {product.section}
          </Link>{" "}
          / <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </div>

      <div className={styles.main}>
        <ProductGallery mainImage={IMAGES[activeImage] ?? IMAGES[0]!} mainImageAlt={product.name} thumbs={thumbs} />

        <div className={styles.info}>
          <div className={styles.category}>{product.category}</div>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <RatingStars rating={product.rating} size={14} />
            <span className={styles.reviewCount}>{product.reviewCount} reviews</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.priceRow}>
            <span className={styles.price}>${formatPrice(product.price)}</span>
            {product.compareAt != null && (
              <span className={styles.compareAt}>${formatPrice(product.compareAt)}</span>
            )}
            {product.compareAt != null && product.discountPct != null && (
              <span className={styles.discountBadge}>&minus;{product.discountPct}%</span>
            )}
          </div>

          <div className={styles.divider} />

          {product.hasSizes && (
            <SizeSelector sizes={sizes} selected={selectedSize} onSelect={handleSelectSize} />
          )}

          <div className={styles.qtyAddRow} ref={addRowRef}>
            <QuantityStepper
              quantity={quantity}
              onIncrement={() => setQuantity((q) => Math.min(9, q + 1))}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <button
              type="button"
              onClick={handleAddToCart}
              className={styles.addToCart}
              style={{
                background: canAdd ? "var(--color-ink)" : "rgba(244,239,227,0.12)",
                color: canAdd ? "var(--color-cream-100)" : "rgba(244,239,227,0.5)",
              }}
            >
              <CartIcon size={16} strokeWidth={2} />
              ADD TO CART
            </button>
          </div>
          {showSizeWarning && (
            <div className={styles.sizeWarning}>Select a size to continue.</div>
          )}

          <div className={styles.featureStrip}>
            {MINI_FEATURES.map((label) => (
              <div key={label} className={styles.featureItem}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.accordionSection}>
        <div className={styles.accordionInner}>
          <Accordion items={product.tabs} openIndex={openTab} onToggle={handleToggleTab} />
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.featuresHeading}>BUILT FOR THE WILD</h2>
        <div className={styles.featuresGrid}>
          {product.features.map((feat, i) => (
            <div key={feat.title} className={styles.featureCard}>
              <div className={styles.featureCardIcon}>{FEATURE_ICONS[i]}</div>
              <div className={styles.featureCardTitle}>{feat.title}</div>
              <div className={styles.featureCardDesc}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedHeading}>COMPLETE YOUR GEAR</h2>
            <Link href={product.sectionHref} className={styles.viewAll}>
              VIEW ALL &rarr;
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((p) => (
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
      )}

      {/* Phone-only; display:none above 720px. */}
      <div
        className={showBuyBar ? styles.buyBarVisible : styles.buyBar}
        aria-hidden={!showBuyBar}
      >
        <div className={styles.buyBarInfo}>
          <span className={styles.buyBarName}>{product.name}</span>
          <span className={styles.buyBarPrice}>${formatPrice(product.price)}</span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className={styles.buyBarBtn}
          tabIndex={showBuyBar ? undefined : -1}
        >
          <CartIcon size={16} strokeWidth={2} />
          ADD TO CART
        </button>
      </div>

      <Footer />
      <div className={styles.buyBarSpacer} aria-hidden="true" />
    </>
  );
}
