import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, type ProductCardBadge } from "@/components/product/ProductCard";
import { CategoryCard } from "@/components/product/CategoryCard";
import { CartIcon, ArrowRightIcon } from "@/components/icons";
import styles from "./page.module.css";

// Content mirrors FEROZ Home.dc.html exactly — that page carries no
// DCLogic/state, so this is transcribed as static data, same as source.

const categories = [
  { label: "BACKPACKS", href: "/equipment", image: "/assets/home-cat-backpacks.png", icon: "/assets/icon-sell-backpacks.svg" },
  { label: "CLOTHING", href: "/men", image: "/assets/home-cat-clothing.png", icon: "/assets/icon-sell-clothes.svg" },
  { label: "EQUIPMENT", href: "/equipment", image: "/assets/home-cat-equipment.png", icon: "/assets/icon-sell-equipment.svg" },
  { label: "FOOTWEAR", href: "/men", image: "/assets/home-cat-footwear.png", icon: "/assets/icon-sell-footwear.svg" },
  { label: "WATCHES", href: "/equipment", image: "/assets/cat-watches.jpg", icon: "/assets/icon-sell-watches.svg" },
];

const NEW_BADGE: ProductCardBadge = { text: "NEW", bg: "var(--color-gold-500)", color: "var(--color-ink)" };
// Badge text recalculated from the new $249.99 price against the
// unchanged $268 compare-at (round((1 - 249.99/268) * 100) = 7).
const SALE_BADGE: ProductCardBadge = { text: "−7%", bg: "var(--color-rust-500)", color: "var(--color-cream-100)" };
const BESTSELLER_BADGE: ProductCardBadge = { text: "BEST SELLER", bg: "var(--color-ink)", color: "var(--color-cream-100)" };

const featuredProducts = [
  // Source photo frames the backpack left-of-centre against a wide mountain
  // vista; re-centred and scaled in slightly so the product reads centred
  // in the card instead of floating in the left half of the frame.
  { slug: "alpine-45l-backpack", name: "Alpine 45L Backpack", image: "/assets/prod-backpack.png", price: 189, rating: 4, badge: NEW_BADGE, imageScale: 1.15, imageObjectPosition: "10% 50%" },
  // Same left-of-centre framing issue as the backpack photo above.
  { slug: "summit-shell-jacket", name: "Summit Shell Jacket", image: "/assets/prod-jacket.png", price: 249.99, compareAt: 268, rating: 4, badge: SALE_BADGE, imageScale: 1.15, imageObjectPosition: "34% 50%" },
  { slug: "basecamp-brew-kit", name: "Basecamp Brew Kit", image: "/assets/prod-brew-kit.png", price: 96, rating: 5, badge: BESTSELLER_BADGE },
  { slug: "timberline-trail-watch", name: "Timberline Trail Watch", image: "/assets/prod-watch.png", price: 299.99, rating: 4, badge: NEW_BADGE },
];

const brandValues = [
  { icon: "/assets/icon-nature-proof.svg", lines: ["Nature Proof"] },
  { icon: "/assets/icon-unbreakable.svg", lines: ["Unbreakable"] },
  { icon: "/assets/icon-destined-for-adventurers.svg", lines: ["Destined For", "Adventurers"] },
  { icon: "/assets/icon-respectful-of-nature.svg", lines: ["Respectful", "Of Nature"] },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* 2. Hero */}
      <div className={styles.hero}>
        <Image
          src="/assets/hero-wide.jpg"
          alt="Find your wild"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <img src="/assets/logo-noir-hero.svg" alt="FEROZ" className={styles.heroOverlayLogo} />
        </div>
        <div className={styles.heroHeadline}>
          <div className={styles.heroFindYour}>FIND YOUR</div>
          <div className={styles.heroWild}>WILD</div>
          <div className={styles.heroTagline}>Solid Gear. Tested In Nature.</div>
        </div>
        <div className={styles.heroCtaWrap}>
          <Link href="/sale" className={styles.heroCta}>
            SHOP NOW
            <CartIcon size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* 3. Product category section */}
      <div className={styles.categorySection}>
        <h2 className={styles.categoryHeading}>Shop by category</h2>
        <div className={styles.categoryDivider} />
        <div className={styles.categoryGrid}>
          {categories.map((c) => (
            <CategoryCard key={c.label} label={c.label} href={c.href} image={c.image} icon={c.icon} />
          ))}
        </div>
      </div>

      {/* 4. Featured products */}
      <div className={styles.featuredSection}>
        <div className={styles.featuredHeader}>
          <div>
            <span className={styles.featuredEyebrow}>Handpicked</span>
            <h2 className={styles.featuredHeading}>Featured Products</h2>
          </div>
          <Link href="/sale" className={styles.featuredViewAll}>
            VIEW ALL &rarr;
          </Link>
        </div>
        <div className={styles.featuredGrid}>
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.slug}
              name={p.name}
              href={`/product/${p.slug}`}
              image={p.image}
              price={p.price}
              compareAt={p.compareAt}
              rating={p.rating}
              badge={p.badge}
              imageScale={p.imageScale}
              imageObjectPosition={p.imageObjectPosition}
              showEmptySpacer
            />
          ))}
        </div>
      </div>

      {/* 5. Brand values */}
      <div className={styles.brandValues}>
        <Image
          src="/assets/mountains-only.jpg"
          alt=""
          fill
          sizes="100vw"
          className={styles.brandValuesBg}
        />
        <div className={styles.brandValuesOverlay} />
        <div className={styles.brandValuesInner}>
          <div className={styles.valuesGrid}>
            {brandValues.map((v) => (
              <div key={v.icon} className={styles.valueItem}>
                <img src={v.icon} alt="" width={34} height={34} />
                <div className={styles.valueLabel}>
                  {v.lines.map((line, i) => (
                    <span key={line}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.valuesDivider} />
          <div className={styles.valuesCopy}>
            <p>
              Built for the wild, FEROZ gear is made to endure. Crafted with
              durable materials and tested in demanding environments, our
              products are designed to support adventurers wherever the
              trail takes them.
            </p>
            <p>
              Every detail is carefully considered for reliability, comfort,
              and performance, from the materials we choose to the way each
              product is built.
            </p>
            <p>
              From rugged mountain trails to unpredictable weather and
              extreme conditions, FEROZ equipment is designed to keep up
              with you and perform when it matters most.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Lifestyle imagery */}
      <div className={styles.lifestyle}>
        <div className={styles.lifestyleInner}>
          <div className={styles.lifestyleHeadingWrap}>
            <h2 className={styles.lifestyleHeading}>EVERY TRAIL. EVERY CONDITION.</h2>
          </div>
          <div className={styles.lifestyleImageWrap}>
            <Image
              src="/assets/every-trail.png"
              alt=""
              fill
              sizes="100vw"
              className={styles.lifestyleImage}
            />
          </div>
        </div>
      </div>

      {/* 7. CTA / brand mission */}
      <div className={styles.cta}>
        <div className={styles.ctaStripes} />
        <div className={styles.ctaInner}>
          <span className={styles.ctaEyebrow}>Join The Expedition</span>
          <h2 className={styles.ctaHeading}>
            THE WILD DOESN&apos;T WAIT.
            <br />
            NEITHER SHOULD YOU.
          </h2>
          <p className={styles.ctaCopy}>
            FEROZ exists for those who choose the mountain over the map, the
            trail over the timetable. Gear up and hunt your limits.
          </p>
          <Link href="/sale" className={styles.ctaButton}>
            SHOP THE COLLECTION
          </Link>
        </div>
      </div>

      {/* 8. Newsletter */}
      <div id="newsletter" className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <h2 className={styles.newsletterHeading}>Join Our Email List</h2>
          <p className={styles.newsletterCopy}>
            First access to new drops, field notes, and expedition stories.
            No noise.
          </p>
          <div className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Your Email..."
              className={styles.newsletterInput}
            />
            <button type="button" className={styles.newsletterSubmit} aria-label="Subscribe">
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* 9. Footer */}
      <Footer />
    </>
  );
}
