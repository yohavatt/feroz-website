"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CategoryHero } from "@/components/layout/CategoryHero";
import { ProductCard, type ProductCardBadge, type ProductCardSize } from "@/components/product/ProductCard";
import { FilterPanel } from "@/components/product/FilterPanel";
import { SortSelect } from "@/components/product/SortSelect";
import styles from "./page.module.css";

// Data mirrors FEROZ Women.dc.html's `productsData` / `groupsDef` exactly.
// Note this is NOT the same badge/product mix as Men — e.g. here it's
// "Ridgeline Tech Tee" that carries BEST SELLER (Men's version has no
// badge; Men's BEST SELLER sits on "Canopy Trail Tee" instead) — and no
// Women product has a compareAt, so the discount-percent UI never shows.

type Group = "jackets" | "layers" | "pants" | "tshirts";

interface WomenProduct {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  rating: number;
  group: Group;
  image: string;
  badge?: ProductCardBadge | null;
}

const NEW_BADGE: ProductCardBadge = { text: "NEW", bg: "var(--color-gold-500)", color: "var(--color-ink)" };
const BESTSELLER_BADGE: ProductCardBadge = { text: "BEST SELLER", bg: "var(--color-ink)", color: "var(--color-cream-100)" };

// Slugs prefixed "womens-" wherever the product name also exists in Men's
// own catalog (Ridge Softshell, Storm Parka, etc.) — Men's own page keeps
// the bare slug it already used, so the two never collide on the same
// Product Detail route. "Mesa Trail Tee" has no Men's equivalent name, so
// it keeps its bare slug.
const PRODUCTS: WomenProduct[] = [
  { slug: "womens-ridge-softshell", name: "Ridge Softshell", price: 199.99, rating: 5, group: "jackets", image: "/assets/women-ridge-softshell.jpg", badge: null },
  { slug: "womens-storm-parka", name: "Storm Parka", price: 349.99, rating: 4, group: "jackets", image: "/assets/women-storm-parka.jpg", badge: NEW_BADGE },
  { slug: "womens-ridgelight-softshell", name: "Ridgelight Softshell", price: 199.99, rating: 4, group: "jackets", image: "/assets/women-ridgelight-softshell.jpg", badge: null },
  { slug: "womens-alpine-long-sleeve", name: "Alpine Long Sleeve", price: 69.99, rating: 5, group: "layers", image: "/assets/women-layer-mountain.jpg", badge: null },
  { slug: "womens-canopy-long-sleeve", name: "Canopy Long Sleeve", price: 69.99, rating: 4, group: "layers", image: "/assets/women-layer-forest.jpg", badge: null },
  { slug: "womens-mesa-long-sleeve", name: "Mesa Long Sleeve", price: 69.99, rating: 4, group: "layers", image: "/assets/women-layer-desert.jpg", badge: null },
  { slug: "womens-alpine-trail-pant", name: "Alpine Trail Pant", price: 159.99, rating: 4, group: "pants", image: "/assets/women-pant-mountain.jpg", badge: null },
  { slug: "womens-glacier-storm-pant", name: "Glacier Storm Pant", price: 159.99, rating: 5, group: "pants", image: "/assets/women-pant-snow.jpg", badge: NEW_BADGE },
  { slug: "womens-ridgeline-tech-tee", name: "Ridgeline Tech Tee", price: 49.99, rating: 5, group: "tshirts", image: "/assets/women-tee-mountain.jpg", badge: BESTSELLER_BADGE },
  { slug: "mesa-trail-tee", name: "Mesa Trail Tee", price: 49.99, rating: 4, group: "tshirts", image: "/assets/women-tee-desert.jpg", badge: null },
];

const GROUPS: { key: Group; label: string }[] = [
  { key: "jackets", label: "Jackets" },
  { key: "layers", label: "Trail Layers" },
  { key: "pants", label: "Pants" },
  { key: "tshirts", label: "T-Shirts" },
];

const SIZE_LABELS = ["S", "M", "L", "XL", "XXL"];

function buildSizes(
  productName: string,
  selectedSizes: Record<string, string>,
  onSelect: (name: string, size: string) => void,
): ProductCardSize[] {
  const selected = selectedSizes[productName] || "M";
  return SIZE_LABELS.map((label) => {
    const isSelected = label === selected;
    return {
      label,
      bg: isSelected ? "var(--color-ink)" : "transparent",
      color: isSelected ? "var(--color-cream-100)" : "rgba(244,239,227,0.75)",
      border: isSelected ? "var(--color-ink)" : "rgba(244,239,227,0.3)",
      onClick: () => onSelect(productName, label),
    };
  });
}

export default function WomenPage() {
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("featured");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const passGroup = (g: string) => activeCats.length === 0 || activeCats.includes(g);

  // Source only ever sorts the Jackets list — same quirk as Men, preserved
  // exactly as found, not "fixed".
  const jackets = PRODUCTS.filter((p) => p.group === "jackets" && passGroup(p.group));
  if (sort === "price-asc") jackets.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") jackets.sort((a, b) => b.price - a.price);
  else if (sort === "newest") {
    jackets.sort((a, b) => (b.badge?.text === "NEW" ? 1 : 0) - (a.badge?.text === "NEW" ? 1 : 0));
  }

  const layers = PRODUCTS.filter((p) => p.group === "layers" && passGroup("layers"));
  const pants = PRODUCTS.filter((p) => p.group === "pants" && passGroup("pants"));
  const tshirts = PRODUCTS.filter((p) => p.group === "tshirts" && passGroup("tshirts"));

  const shownCount = jackets.length + layers.length + pants.length + tshirts.length;

  const categories = GROUPS.map((g) => ({
    key: g.key,
    label: g.label,
    count: PRODUCTS.filter((p) => p.group === g.key).length,
    active: activeCats.includes(g.key),
  }));

  function toggleCategory(key: string) {
    setActiveCats((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }

  function selectSize(name: string, size: string) {
    setSelectedSizes((prev) => ({ ...prev, [name]: size }));
  }

  function renderSection(title: string, eyebrow: string, products: WomenProduct[], withMarginBottom: boolean) {
    if (products.length === 0) return null;
    return (
      <div className={withMarginBottom ? styles.section : undefined}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <span className={styles.sectionEyebrow}>{eyebrow}</span>
        </div>
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              name={p.name}
              href={`/product/${p.slug}`}
              image={p.image}
              price={p.price}
              compareAt={p.compareAt}
              discountPct={p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : null}
              rating={p.rating}
              badge={p.badge}
              sizes={buildSizes(p.name, selectedSizes, selectSize)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <CategoryHero
        image="/assets/women-header.jpg"
        imageAlt="Women's gear"
        breadcrumbLabel="WOMEN"
        title="WOMEN'S GEAR"
        description="Shell jackets, technical pants and base layers engineered for load-bearing, weather-sealed performance on multi-day routes."
      />

      <div className={styles.metaRow}>
        <span className={styles.shownCount}>
          SHOWING {shownCount} OF {PRODUCTS.length} PRODUCTS
        </span>
        <div className={styles.controls}>
          <FilterPanel
            categories={categories}
            open={showFilters}
            onToggleOpen={() => setShowFilters((v) => !v)}
            onToggleCategory={toggleCategory}
            onClearFilters={() => setActiveCats([])}
          />
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className={styles.sections}>
        {renderSection("COATS & JACKETS", "WEATHERPROOF SHELLS FOR EVERY RIDGE LINE", jackets, true)}
        {renderSection("TRAIL LAYERS", "LONG SLEEVES FOR MOUNTAIN, FOREST AND DESERT", layers, true)}
        {renderSection("TERRAIN PANTS", "MOUNTAIN AND SNOW — BUILT FOR EVERY TERRAIN", pants, true)}
        {renderSection("TRAIL TEES", "MOUNTAIN AND DESERT — BREATHABLE TECHNICAL TEES", tshirts, false)}
      </div>

      <Footer />
    </>
  );
}
