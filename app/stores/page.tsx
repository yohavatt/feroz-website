"use client";

import { useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StoreCard } from "@/components/stores/StoreCard";
import { StoreDetailModal } from "@/components/stores/StoreDetailModal";
import styles from "./page.module.css";

interface Store {
  name: string;
  city: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
  categories: string[];
}

// Transcribed verbatim from FEROZ Store Locator.dc.html's storesData.
// `distance` is a static per-store string, never computed. pinX/pinY are
// dead source data (never rendered as map pins in source) and are
// intentionally omitted here — they serve no purpose in the actual output.
const STORES: Store[] = [
  { name: "FEROZ Flagship Store", city: "Denver, CO", address: "1450 Blake Street, Denver, CO 80202, USA", distance: "2.4 mi", hours: "MON–SAT 10AM–7PM · SUN 11AM–5PM", phone: "(303) 555-0142", categories: ["Jackets", "Pants", "Backpacks", "Watches"] },
  { name: "FEROZ Mountain Store", city: "Salt Lake City, UT", address: "3200 South State Street, Salt Lake City, UT 84115, USA", distance: "5.1 mi", hours: "MON–SAT 9AM–8PM · SUN 10AM–6PM", phone: "(801) 555-0198", categories: ["Jackets", "Camping", "Watches"] },
  { name: "FEROZ Outdoor Store", city: "Seattle, WA", address: "825 Pine Street, Seattle, WA 98101, USA", distance: "8.7 mi", hours: "MON–SUN 10AM–7PM", phone: "(206) 555-0176", categories: ["Trail Layers", "Backpacks", "Accessories"] },
  { name: "FEROZ Adventure Store", city: "Portland, OR", address: "1125 NW Couch Street, Portland, OR 97209, USA", distance: "11.2 mi", hours: "MON–SAT 10AM–7PM · SUN 11AM–5PM", phone: "(503) 555-0164", categories: ["Pants", "T-Shirts", "Camping"] },
  { name: "FEROZ Trail Store", city: "Boulder, CO", address: "1850 Pearl Street, Boulder, CO 80302, USA", distance: "14.6 mi", hours: "MON–SUN 9AM–6PM", phone: "(720) 555-0187", categories: ["Jackets", "Watches", "Accessories"] },
];

export default function StoresPage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selected, setSelected] = useState<Store | null>(null);

  function runSearch() {
    setActiveQuery(query);
  }

  function clear() {
    setQuery("");
    setActiveQuery("");
  }

  const q = activeQuery.trim().toLowerCase();
  const filtered =
    q === ""
      ? STORES
      : STORES.filter((s) => `${s.name} ${s.city} ${s.address}`.toLowerCase().includes(q));

  const hasQuery = query.trim().length > 0 || activeQuery.trim().length > 0;
  const hasResults = filtered.length > 0;
  const noResults = filtered.length === 0;

  const mapQuery = selected ? selected.address : filtered.length === 1 ? filtered[0]!.address : "United States";
  const mapZoom = selected ? 14 : filtered.length === 1 ? 11 : 4;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${mapZoom}&output=embed`;

  return (
    <>
      <Nav />

      <div className={styles.header}>
        <h1 className={styles.title}>FIND FEROZ NEAR YOU</h1>
        <p className={styles.subtitle}>Discover FEROZ equipment and experience our gear in person.</p>

        <div className={styles.searchRow}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city or zip code"
            className={styles.searchInput}
          />
          <button type="button" onClick={runSearch} className={styles.searchBtn}>
            SEARCH
          </button>
          {hasQuery && (
            <button type="button" onClick={clear} className={styles.clearBtn}>
              CLEAR
            </button>
          )}
        </div>
      </div>

      {noResults && (
        <div className={styles.noResults}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.4} className={styles.noResultsIcon}>
            <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.3" />
            <line x1="6" y1="4" x2="18" y2="18" stroke="var(--color-rust-500)" />
          </svg>
          <h2 className={styles.noResultsTitle}>NO FEROZ STORE FOUND</h2>
          <p className={styles.noResultsBody}>Try another city or search nearby.</p>
          <button type="button" onClick={clear} className={styles.clearSearchBtn}>
            CLEAR SEARCH
          </button>
        </div>
      )}

      {hasResults && (
        <div className={styles.resultsGrid}>
          <div className={styles.storeList}>
            {filtered.map((store) => (
              <StoreCard
                key={store.name}
                store={store}
                selected={selected?.name === store.name}
                onSelect={() => setSelected(store)}
              />
            ))}
          </div>

          <div className={styles.mapWrap}>
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              className={styles.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}

      {selected && <StoreDetailModal store={selected} onClose={() => setSelected(null)} />}

      <Footer aboutUsAsLink />
    </>
  );
}
