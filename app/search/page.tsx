"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, type ProductCardBadge } from "@/components/product/ProductCard";
import { SortSelect, type SortOption } from "@/components/product/SortSelect";
import { SearchFilterPanel } from "@/components/search/SearchFilterPanel";
import styles from "./page.module.css";

type Group = "jackets" | "layers" | "pants" | "tshirts" | "backpacks" | "camping" | "watches" | "accessories";

interface SearchProduct {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  group: Group;
  image: string;
  badge: ProductCardBadge | null;
  keywords: string;
}

const NEW_BADGE: ProductCardBadge = { text: "NEW", bg: "var(--color-gold-500)", color: "var(--color-ink)" };
const SALE_BADGE: ProductCardBadge = { text: "SALE", bg: "var(--color-rust-500)", color: "var(--color-cream-100)" };
const BESTSELLER_BADGE: ProductCardBadge = { text: "BEST SELLER", bg: "var(--color-ink)", color: "var(--color-cream-100)" };

// Transcribed verbatim from FEROZ Search Results.dc.html's productsData —
// this page's own catalog, not derived from Men/Women/Equipment's pages.
// `slug` was added so every card can link to its own correct Product
// Detail route (previously every card pointed at the same literal
// Product Detail page, back when that page only supported one product).
// Women's colliding names use the same "womens-" prefix as app/women's
// own data; Equipment's Timberline Trail Watch uses the same
// "equipment-" prefix as app/equipment's own data.
const PRODUCTS: SearchProduct[] = [
  // MEN
  { slug: "summit-shell-jacket", name: "Summit Shell Jacket", category: "Men / Jackets", price: 249.99, compareAt: 268, rating: 4, group: "jackets", image: "/assets/men-summit-shell.jpg", badge: SALE_BADGE, keywords: "men jacket shell mountain waterproof" },
  { slug: "ridge-softshell", name: "Ridge Softshell", category: "Men / Jackets", price: 199.99, rating: 5, group: "jackets", image: "/assets/men-ridge-softshell.jpg", badge: null, keywords: "men jacket softshell ridge" },
  { slug: "storm-parka", name: "Storm Parka", category: "Men / Jackets", price: 349.99, rating: 4, group: "jackets", image: "/assets/men-storm-parka.jpg", badge: NEW_BADGE, keywords: "men jacket parka storm" },
  { slug: "ridgelight-softshell", name: "Ridgelight Softshell", category: "Men / Jackets", price: 199.99, rating: 4, group: "jackets", image: "/assets/men-ridgelight-softshell.jpg", badge: null, keywords: "men jacket softshell ridgelight" },
  { slug: "alpine-long-sleeve", name: "Alpine Long Sleeve", category: "Men / Trail Layers", price: 69.99, rating: 5, group: "layers", image: "/assets/men-layer-mountain.jpg", badge: null, keywords: "men layer base layer mountain alpine" },
  { slug: "canopy-long-sleeve", name: "Canopy Long Sleeve", category: "Men / Trail Layers", price: 69.99, rating: 4, group: "layers", image: "/assets/men-layer-forest.jpg", badge: null, keywords: "men layer base layer forest canopy" },
  { slug: "mesa-long-sleeve", name: "Mesa Long Sleeve", category: "Men / Trail Layers", price: 69.99, rating: 4, group: "layers", image: "/assets/men-layer-desert.jpg", badge: null, keywords: "men layer base layer desert mesa" },
  { slug: "alpine-trail-pant", name: "Alpine Trail Pant", category: "Men / Pants", price: 159.99, rating: 4, group: "pants", image: "/assets/men-pant-mountain.jpg", badge: null, keywords: "men pants mountain alpine trail" },
  { slug: "glacier-storm-pant", name: "Glacier Storm Pant", category: "Men / Pants", price: 159.99, rating: 5, group: "pants", image: "/assets/men-pant-snow.jpg", badge: NEW_BADGE, keywords: "men pants snow glacier storm" },
  { slug: "mesa-trail-pant", name: "Mesa Trail Pant", category: "Men / Pants", price: 159.99, rating: 4, group: "pants", image: "/assets/men-pant-desert.jpg", badge: null, keywords: "men pants desert mesa trail" },
  { slug: "ridgeline-tech-tee", name: "Ridgeline Tech Tee", category: "Men / T-Shirts", price: 49.99, rating: 5, group: "tshirts", image: "/assets/men-tee-mountain.jpg", badge: null, keywords: "men shirt tee mountain ridgeline" },
  { slug: "canopy-trail-tee", name: "Canopy Trail Tee", category: "Men / T-Shirts", price: 49.99, rating: 4, group: "tshirts", image: "/assets/men-tee-forest.jpg", badge: BESTSELLER_BADGE, keywords: "men shirt tee forest canopy" },
  // WOMEN
  { slug: "womens-ridge-softshell", name: "Ridge Softshell", category: "Women / Jackets", price: 199.99, rating: 5, group: "jackets", image: "/assets/women-ridge-softshell.jpg", badge: null, keywords: "women jacket softshell ridge" },
  { slug: "womens-storm-parka", name: "Storm Parka", category: "Women / Jackets", price: 349.99, rating: 4, group: "jackets", image: "/assets/women-storm-parka.jpg", badge: NEW_BADGE, keywords: "women jacket parka storm" },
  { slug: "womens-ridgelight-softshell", name: "Ridgelight Softshell", category: "Women / Jackets", price: 199.99, rating: 4, group: "jackets", image: "/assets/women-ridgelight-softshell.jpg", badge: null, keywords: "women jacket softshell ridgelight" },
  { slug: "womens-alpine-long-sleeve", name: "Alpine Long Sleeve", category: "Women / Trail Layers", price: 69.99, rating: 5, group: "layers", image: "/assets/women-layer-mountain.jpg", badge: null, keywords: "women layer base layer mountain alpine" },
  { slug: "womens-canopy-long-sleeve", name: "Canopy Long Sleeve", category: "Women / Trail Layers", price: 69.99, rating: 4, group: "layers", image: "/assets/women-layer-forest.jpg", badge: null, keywords: "women layer base layer forest canopy" },
  { slug: "womens-mesa-long-sleeve", name: "Mesa Long Sleeve", category: "Women / Trail Layers", price: 69.99, rating: 4, group: "layers", image: "/assets/women-layer-desert.jpg", badge: null, keywords: "women layer base layer desert mesa" },
  { slug: "womens-alpine-trail-pant", name: "Alpine Trail Pant", category: "Women / Pants", price: 159.99, rating: 4, group: "pants", image: "/assets/women-pant-mountain.jpg", badge: null, keywords: "women pants mountain alpine trail" },
  { slug: "womens-glacier-storm-pant", name: "Glacier Storm Pant", category: "Women / Pants", price: 159.99, rating: 5, group: "pants", image: "/assets/women-pant-snow.jpg", badge: NEW_BADGE, keywords: "women pants snow glacier storm" },
  { slug: "womens-ridgeline-tech-tee", name: "Ridgeline Tech Tee", category: "Women / T-Shirts", price: 49.99, rating: 5, group: "tshirts", image: "/assets/women-tee-mountain.jpg", badge: BESTSELLER_BADGE, keywords: "women shirt tee mountain ridgeline" },
  { slug: "mesa-trail-tee", name: "Mesa Trail Tee", category: "Women / T-Shirts", price: 49.99, rating: 4, group: "tshirts", image: "/assets/women-tee-desert.jpg", badge: null, keywords: "women shirt tee desert mesa" },
  // EQUIPMENT
  { slug: "expedition-60l-pack", name: "Expedition 60L Pack", category: "Equipment / Backpacks", price: 299.99, rating: 5, group: "backpacks", image: "/assets/eq-pack-60.jpg", badge: BESTSELLER_BADGE, keywords: "equipment backpack pack expedition" },
  { slug: "glacier-45l-pack", name: "Glacier 45L Pack", category: "Equipment / Backpacks", price: 249.99, rating: 5, group: "backpacks", image: "/assets/eq-pack-45.jpg", badge: NEW_BADGE, keywords: "equipment backpack pack glacier snow" },
  { slug: "trailhead-30l-pack", name: "Trailhead 30L Pack", category: "Equipment / Backpacks", price: 199.99, rating: 4, group: "backpacks", image: "/assets/eq-pack-30.jpg", badge: null, keywords: "equipment backpack pack trailhead" },
  { slug: "woodland-basecamp-kit", name: "Woodland Basecamp Kit", category: "Equipment / Camping", price: 299, rating: 5, group: "camping", image: "/assets/eq-kit-forest.jpg", badge: null, keywords: "equipment camping tent kit forest woodland" },
  { slug: "glacier-basecamp-kit", name: "Glacier Basecamp Kit", category: "Equipment / Camping", price: 319.99, rating: 4, group: "camping", image: "/assets/eq-kit-snow.jpg", badge: NEW_BADGE, keywords: "equipment camping tent kit snow glacier" },
  { slug: "equipment-timberline-trail-watch", name: "Timberline Trail Watch", category: "Equipment / Watches", price: 299.99, rating: 5, group: "watches", image: "/assets/eq-watch-forest.jpg", badge: null, keywords: "equipment watch forest timberline" },
  { slug: "ridgeline-summit-watch", name: "Ridgeline Summit Watch", category: "Equipment / Watches", price: 299.99, rating: 5, group: "watches", image: "/assets/eq-watch-mountain.jpg", badge: BESTSELLER_BADGE, keywords: "equipment watch mountain summit ridgeline" },
  { slug: "glacier-alpine-watch", name: "Glacier Alpine Watch", category: "Equipment / Watches", price: 299.99, rating: 4, group: "watches", image: "/assets/eq-watch-snow.jpg", badge: null, keywords: "equipment watch snow glacier alpine" },
  { slug: "mesa-expedition-watch", name: "Mesa Expedition Watch", category: "Equipment / Watches", price: 299.99, rating: 4, group: "watches", image: "/assets/eq-watch-desert.jpg", badge: null, keywords: "equipment watch desert mesa expedition" },
  { slug: "bearing-360-compass", name: "Bearing 360 Compass", category: "Equipment / Accessories", price: 59.99, rating: 5, group: "accessories", image: "/assets/eq-compass.jpg", badge: null, keywords: "equipment compass accessory navigation" },
  { slug: "fieldmedic-survival-kit", name: "Fieldmedic Survival Kit", category: "Equipment / Accessories", price: 79.99, rating: 5, group: "accessories", image: "/assets/eq-medkit.jpg", badge: BESTSELLER_BADGE, keywords: "equipment survival kit medkit accessory" },
  { slug: "basecamp-thermo-flask", name: "Basecamp Thermo Flask", category: "Equipment / Accessories", price: 39.99, rating: 4, group: "accessories", image: "/assets/eq-flask.jpg", badge: null, keywords: "equipment flask thermo accessory" },
  { slug: "woodland-2p-tent-and-bag", name: "Woodland 2P Tent & Bag", category: "Equipment / Camping", price: 399.99, rating: 5, group: "camping", image: "/assets/eq-tent.jpg", badge: NEW_BADGE, keywords: "equipment tent camping forest woodland" },
  { slug: "lookout-10x42-binoculars", name: "Lookout 10x42 Binoculars", category: "Equipment / Accessories", price: 199.99, rating: 4, group: "accessories", image: "/assets/eq-binoculars.jpg", badge: null, keywords: "equipment binoculars accessory lookout" },
];

const GROUPS: { key: Group; label: string }[] = [
  { key: "jackets", label: "Jackets" },
  { key: "layers", label: "Trail Layers" },
  { key: "pants", label: "Pants" },
  { key: "tshirts", label: "T-Shirts" },
  { key: "backpacks", label: "Backpacks" },
  { key: "camping", label: "Camping" },
  { key: "watches", label: "Watches" },
  { key: "accessories", label: "Accessories" },
];

const PRICE_RANGES = [
  { key: "under100", label: "Under $100", test: (p: SearchProduct) => p.price < 100 },
  { key: "100to250", label: "$100 – $250", test: (p: SearchProduct) => p.price >= 100 && p.price <= 250 },
  { key: "over250", label: "Over $250", test: (p: SearchProduct) => p.price > 250 },
];

const RATING_FILTERS = [
  { key: "4plus", label: "4 stars & up", test: (p: SearchProduct) => p.rating >= 4 },
  { key: "5", label: "5 stars", test: (p: SearchProduct) => p.rating === 5 },
];

const SORT_OPTIONS: SortOption[] = [
  { value: "featured", label: "Sort: Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("summit");
  const [sort, setSort] = useState("featured");
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [activePrices, setActivePrices] = useState<string[]>([]);
  const [activeRatings, setActiveRatings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  function toggleCat(key: string) {
    setActiveCats((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }
  function togglePrice(key: string) {
    setActivePrices((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }
  function toggleRating(key: string) {
    setActiveRatings((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }
  function clearFilters() {
    setActiveCats([]);
    setActivePrices([]);
    setActiveRatings([]);
  }

  const q = query.trim().toLowerCase();
  let filtered = PRODUCTS.filter((p) => {
    const haystack = `${p.name} ${p.category} ${p.keywords}`.toLowerCase();
    const matchesQuery = q === "" || haystack.includes(q);
    const matchesCat = activeCats.length === 0 || activeCats.includes(p.group);
    const matchesPrice =
      activePrices.length === 0 ||
      activePrices.some((k) => PRICE_RANGES.find((r) => r.key === k)!.test(p));
    const matchesRating =
      activeRatings.length === 0 ||
      activeRatings.some((k) => RATING_FILTERS.find((r) => r.key === k)!.test(p));
    return matchesQuery && matchesCat && matchesPrice && matchesRating;
  });

  // "Featured" applies no sort at all — filtered keeps PRODUCTS' literal
  // definition order. "Newest" isn't a real date sort — it only floats
  // NEW-badged items to the front (source quirk, not a bug to fix).
  filtered = [...filtered];
  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") {
    filtered.sort((a, b) => (b.badge?.text === "NEW" ? 1 : 0) - (a.badge?.text === "NEW" ? 1 : 0));
  }

  const products = filtered;
  const hasResults = products.length > 0;
  const noResults = products.length === 0;
  const resultCount = `${products.length} PRODUCT${products.length === 1 ? "" : "S"}`;
  const queryDisplay = query.trim() ? query.toUpperCase() : "SUMMIT";
  const hasActiveFilters = activeCats.length > 0 || activePrices.length > 0 || activeRatings.length > 0;

  // Category counts always reflect the full unfiltered catalog, never the
  // current search text or other active filters.
  const categories = GROUPS.map((g) => ({
    key: g.key,
    label: g.label,
    count: PRODUCTS.filter((p) => p.group === g.key).length,
    active: activeCats.includes(g.key),
  }));
  const priceRanges = PRICE_RANGES.map((r) => ({
    key: r.key,
    label: r.label,
    active: activePrices.includes(r.key),
  }));
  const ratingFilters = RATING_FILTERS.map((r) => ({
    key: r.key,
    label: r.label,
    active: activeRatings.includes(r.key),
  }));

  return (
    <>
      <Nav searchActive />

      <div className={styles.searchBarRow}>
        <div className={styles.searchBar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={() => {}}
            placeholder="Search products..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>SEARCH RESULTS FOR &ldquo;{queryDisplay}&rdquo;</h1>
        <span className={styles.resultCount}>{resultCount}</span>
      </div>

      {hasResults && (
        <div className={styles.filtersRow}>
          <SearchFilterPanel
            open={showFilters}
            onToggleOpen={() => setShowFilters((v) => !v)}
            categories={categories}
            priceRanges={priceRanges}
            ratingFilters={ratingFilters}
            hasActiveFilters={hasActiveFilters}
            onToggleCategory={toggleCat}
            onTogglePrice={togglePrice}
            onToggleRating={toggleRating}
            onClearFilters={clearFilters}
          />
          <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
      )}

      {noResults && (
        <div className={styles.noResults}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.4} className={styles.noResultsIcon}>
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
          <h2 className={styles.noResultsTitle}>NO RESULTS FOUND</h2>
          <p className={styles.noResultsBody}>Try another search or explore our collections.</p>
          <Link href="/men" className={styles.continueShopping}>
            CONTINUE SHOPPING
          </Link>
        </div>
      )}

      {hasResults && (
        <div className={styles.gridWrap}>
          <div className={styles.grid}>
            {products.map((p, i) => (
              <ProductCard
                key={`${p.name}-${p.category}-${i}`}
                name={p.name}
                href={`/product/${p.slug}`}
                image={p.image}
                price={p.price}
                compareAt={p.compareAt}
                rating={p.rating}
                badge={p.badge}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
