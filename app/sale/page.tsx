import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CategoryHero } from "@/components/layout/CategoryHero";
import { SaleCollectionTile } from "@/components/layout/SaleCollectionTile";
import styles from "./page.module.css";

// Unlike Men/Women/Equipment, FEROZ Sale.dc.html carries no product data,
// no filters, no sort, and no dc-script logic — it's a static 4-tile
// marketing lander. The source templates {{accentColor}}/{{badgeBg}}/
// {{bgGradient}} via a design-tool-only props mechanism (not a rendered
// UI control); this reproduces their resolved default values directly
// rather than building a color picker that doesn't exist on the page.

const INK_BADGE = { bg: "var(--color-ink)", color: "var(--color-cream-100)" };

export default function SalePage() {
  return (
    <>
      <Nav />

      <CategoryHero
        image="/assets/sale-header-bg.png"
        imageAlt=""
        breadcrumbLabel="SALE"
        title="SALE"
        description="Past-season gear at up to 35% off. Same construction, same field testing, lower price — while stock lasts."
        imageObjectPosition="center 60%"
        overlayGradient="linear-gradient(95deg, rgba(21, 21, 15, 0.72) 0%, rgba(21, 21, 15, 0.42) 45%, rgba(21, 21, 15, 0.15) 100%)"
      />

      <div className={styles.collections}>
        <SaleCollectionTile
          id="mens-sale"
          image="/assets/sale-men.jpg"
          imageAlt="Men's sale"
          imageObjectPosition="center 30%"
          badges={[{ text: "UP TO 35% OFF", ...INK_BADGE }]}
          eyebrow="COLLECTION 01"
          title="MEN'S SALE"
          description="Shells, softshells and terrain pants from past seasons — same weather-sealed build, reduced while sizes last."
          ctaHref="/men"
          ctaLabel="SHOP MEN'S SALE"
          ctaHoverVariant="fade"
        />

        <SaleCollectionTile
          id="womens-sale"
          image="/assets/sale-women.jpg"
          imageAlt="Women's sale"
          imageObjectPosition="center 30%"
          badges={[{ text: "UP TO 30% OFF", ...INK_BADGE }]}
          eyebrow="COLLECTION 02"
          title="WOMEN'S SALE"
          description="Trail layers, jackets and technical pants cut for long days — marked down across the full size run."
          ctaHref="/women"
          ctaLabel="SHOP WOMEN'S SALE"
          ctaHoverVariant="fade"
        />

        <SaleCollectionTile
          id="equipment-sale"
          image="/assets/sale-equipment.jpg"
          imageAlt="Equipment sale"
          imageObjectPosition="center 45%"
          badges={[{ text: "UP TO 25% OFF", ...INK_BADGE }]}
          eyebrow="COLLECTION 03"
          title="EQUIPMENT'S SALE"
          description="Packs, basecamp systems and field instruments — full-spec gear at end-of-season pricing."
          ctaHref="/equipment"
          ctaLabel="SHOP EQUIPMENT SALE"
          ctaHoverVariant="fade"
        />

        <SaleCollectionTile
          id="summer-promotion"
          image="/assets/sale-summer.jpg"
          imageAlt="Summer promotion"
          imageObjectPosition="center 55%"
          badges={[
            { text: "−30% OFF", bg: "var(--color-rust-500)", color: "var(--color-cream-100)" },
            { text: "SEASONAL CAMPAIGN", bg: "var(--color-gold-500)", color: "var(--color-ink)" },
          ]}
          eyebrow="COLLECTION 04"
          title="SUMMER'S PROMOTION"
          description="High-season kit for long light and dry ridgelines — lightweight layers, packs and hydration, bundled and reduced."
          ctaHref="/"
          ctaLabel="SHOP SUMMER PROMOTION"
          ctaHoverVariant="fade"
        />
      </div>

      <Footer />
    </>
  );
}
