"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CategoryHero } from "@/components/layout/CategoryHero";
import { ProductCard, type ProductCardBadge } from "@/components/product/ProductCard";
import { FilterPanel } from "@/components/product/FilterPanel";
import { SortSelect } from "@/components/product/SortSelect";
import styles from "./page.module.css";

// Data mirrors FEROZ Equipment.dc.html's `productsData` / `groupsDef`
// exactly. No product has sizes or a compareAt — this page never renders
// the size-chip row or discount text, matching source's card markup
// (which has no trailing div at all after the price row, unlike Home's
// literal empty spacer or Men/Women's size chips).
//
// Unlike Men/Women, sort here applies to ALL FOUR sections uniformly
// (source's `group(key)` helper runs the same sort logic for every
// group) — this is not the Men/Women "only the first list sorts" quirk.

type Group = "backpacks" | "camping" | "watches" | "divers";

interface EquipmentProduct {
  slug: string;
  name: string;
  price: number;
  rating: number;
  group: Group;
  image: string;
  badge?: ProductCardBadge | null;
  /** Only set where a photo is framed further out than its section
   *  siblings, so all cards in that row read at the same visual scale. */
  imageScale?: number;
  imageObjectPosition?: string;
}

const NEW_BADGE: ProductCardBadge = { text: "NEW", bg: "var(--color-gold-500)", color: "var(--color-ink)" };
const BESTSELLER_BADGE: ProductCardBadge = { text: "BEST SELLER", bg: "var(--color-ink)", color: "var(--color-cream-100)" };

const PRODUCTS: EquipmentProduct[] = [
  { slug: "expedition-60l-pack", name: "Expedition 60L Pack", price: 299.99, rating: 5, group: "backpacks", image: "/assets/eq-pack-60.jpg", badge: BESTSELLER_BADGE },
  { slug: "glacier-45l-pack", name: "Glacier 45L Pack", price: 249.99, rating: 5, group: "backpacks", image: "/assets/eq-pack-45.jpg", badge: NEW_BADGE },
  { slug: "trailhead-30l-pack", name: "Trailhead 30L Pack", price: 199.99, rating: 4, group: "backpacks", image: "/assets/eq-pack-30.jpg", badge: null },
  { slug: "woodland-basecamp-kit", name: "Woodland Basecamp Kit", price: 299, rating: 5, group: "camping", image: "/assets/eq-kit-forest.jpg", badge: null },
  { slug: "glacier-basecamp-kit", name: "Glacier Basecamp Kit", price: 319.99, rating: 4, group: "camping", image: "/assets/eq-kit-snow.jpg", badge: NEW_BADGE },
  // "timberline-trail-watch" collides with a different product of the same
  // name on Home — disambiguated so neither route silently overwrites the
  // other. Both now share the same $299.99 price.
  { slug: "equipment-timberline-trail-watch", name: "Timberline Trail Watch", price: 299.99, rating: 5, group: "watches", image: "/assets/eq-watch-forest.jpg", badge: null },
  { slug: "ridgeline-summit-watch", name: "Ridgeline Summit Watch", price: 299.99, rating: 5, group: "watches", image: "/assets/eq-watch-mountain.jpg", badge: BESTSELLER_BADGE },
  // Source photo is shot further back than the other three watches, and the
  // watch sits left of centre in it, so the card crops in and re-centres to
  // match their framing. Image asset itself is unchanged.
  { slug: "glacier-alpine-watch", name: "Glacier Alpine Watch", price: 299.99, rating: 4, group: "watches", image: "/assets/eq-watch-snow.jpg", badge: null, imageScale: 1.4, imageObjectPosition: "40% 50%" },
  { slug: "mesa-expedition-watch", name: "Mesa Expedition Watch", price: 299.99, rating: 4, group: "watches", image: "/assets/eq-watch-desert.jpg", badge: null },
  { slug: "bearing-360-compass", name: "Bearing 360 Compass", price: 59.99, rating: 5, group: "divers", image: "/assets/eq-compass.jpg", badge: null },
  { slug: "fieldmedic-survival-kit", name: "Fieldmedic Survival Kit", price: 79.99, rating: 5, group: "divers", image: "/assets/eq-medkit.jpg", badge: BESTSELLER_BADGE },
  { slug: "basecamp-thermo-flask", name: "Basecamp Thermo Flask", price: 39.99, rating: 4, group: "divers", image: "/assets/eq-flask.jpg", badge: null },
  { slug: "woodland-2p-tent-and-bag", name: "Woodland 2P Tent & Bag", price: 399.99, rating: 5, group: "divers", image: "/assets/eq-tent.jpg", badge: NEW_BADGE },
  { slug: "lookout-10x42-binoculars", name: "Lookout 10x42 Binoculars", price: 199.99, rating: 4, group: "divers", image: "/assets/eq-binoculars.jpg", badge: null },
];

const GROUPS: { key: Group; label: string }[] = [
  { key: "backpacks", label: "Backpacks" },
  { key: "camping", label: "Camping Kit" },
  { key: "watches", label: "Watches" },
  { key: "divers", label: "Divers" },
];

export default function EquipmentPage() {
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("featured");

  const passGroup = (g: string) => activeCats.length === 0 || activeCats.includes(g);

  // Source's `group(key)` helper filters AND sorts every section the same
  // way — sort is applied uniformly here, not just to one list.
  function buildGroup(key: Group) {
    const list = PRODUCTS.filter((p) => p.group === key && passGroup(key));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "newest") {
      list.sort((a, b) => (b.badge?.text === "NEW" ? 1 : 0) - (a.badge?.text === "NEW" ? 1 : 0));
    }
    return list;
  }

  const backpacks = buildGroup("backpacks");
  const camping = buildGroup("camping");
  const watches = buildGroup("watches");
  const divers = buildGroup("divers");

  const shownCount = backpacks.length + camping.length + watches.length + divers.length;

  const categories = GROUPS.map((g) => ({
    key: g.key,
    label: g.label,
    count: PRODUCTS.filter((p) => p.group === g.key).length,
    active: activeCats.includes(g.key),
  }));

  function toggleCategory(key: string) {
    setActiveCats((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }

  function renderSection(title: string, eyebrow: string, products: EquipmentProduct[], withMarginBottom: boolean) {
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
              rating={p.rating}
              badge={p.badge}
              imageScale={p.imageScale}
              imageObjectPosition={p.imageObjectPosition}
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
        image="/assets/equipment-header.jpg"
        imageAlt="Equipment"
        breadcrumbLabel="EQUIPMENT"
        title="EQUIPMENT"
        description="Packs, basecamp systems, field watches and survival tools built to carry weight, hold heat and keep working far past the trailhead."
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
        {renderSection("BACKPACKS", "30L TO 60L — CARRY SYSTEMS FOR EVERY ROUTE LENGTH", backpacks, true)}
        {renderSection("CAMPING KIT", "BASECAMP COOK AND SLEEP SYSTEMS, FOREST TO GLACIER", camping, true)}
        {renderSection("WATCHES", "FIELD INSTRUMENTS IN FOUR TERRAIN COLOURWAYS", watches, true)}
        {renderSection("DIVERS", "NAVIGATION, SHELTER, SAFETY AND FIELD ESSENTIALS", divers, false)}
      </div>

      <Footer />
    </>
  );
}
