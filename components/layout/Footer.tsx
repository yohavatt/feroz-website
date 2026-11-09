"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

// Reproduces FEROZ Home.dc.html's footer exactly, including its two
// inconsistencies versus other source pages: "About Us" is a plain span
// (not a link) here, and "Careers" points at the same target as the About
// Us page — both preserved as found rather than "corrected".
//
// The About Us page's own source footer is the one exception: there,
// "About Us" is a real self-link instead of a plain span. `aboutUsAsLink`
// reproduces that single difference without touching any other page.
//
// Each link group's heading is a button so the groups can collapse on a
// phone, where four stacked columns made the footer taller than the
// content above it. At >=481px the panels are always open and the button
// is inert, so the approved desktop footer is unchanged.
const shopLinks = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Equipment", href: "/equipment" },
  { label: "Sale", href: "/sale" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: "/assets/icon-social-facebook.svg" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "/assets/icon-social-instagram.svg" },
  { label: "X", href: "https://x.com/", icon: "/assets/icon-social-x.svg" },
  { label: "YouTube", href: "https://www.youtube.com/", icon: "/assets/icon-social-youtube.svg" },
];

type GroupKey = "shop" | "support" | "company";

export interface FooterProps {
  /** True only on the About Us page, whose own source renders "About Us"
   *  in the Company column as a real link rather than the plain span every
   *  other page uses. Defaults to false so every existing page is unchanged. */
  aboutUsAsLink?: boolean;
}

export function Footer({ aboutUsAsLink = false }: FooterProps = {}) {
  const [openGroup, setOpenGroup] = useState<GroupKey | null>(null);

  const toggle = (key: GroupKey) =>
    setOpenGroup((current) => (current === key ? null : key));

  function groupHeading(key: GroupKey, label: string) {
    const open = openGroup === key;
    return (
      <button
        type="button"
        onClick={() => toggle(key)}
        className={styles.colHeading}
        aria-expanded={open}
        aria-controls={`footer-group-${key}`}
      >
        {label}
        <svg
          className={open ? styles.chevronOpen : styles.chevron}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div>
            <img src="/assets/logo-white.png" alt="FEROZ" className={styles.logo} />
            <p className={styles.tagline}>
              Premium gear for hiking, exploration and survival. Solid gear,
              tested in nature.
            </p>
            <div className={styles.socials}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={s.label}
                >
                  <img src={s.icon} alt="" width={36} height={36} className={styles.socialIcon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            {groupHeading("shop", "Shop")}
            <div
              id="footer-group-shop"
              className={styles.colLinks}
              data-open={openGroup === "shop"}
            >
              {shopLinks.map((l) => (
                <Link key={l.href} href={l.href} className={styles.colLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            {groupHeading("support", "Support")}
            <div
              id="footer-group-support"
              className={styles.colLinks}
              data-open={openGroup === "support"}
            >
              {/* Source always points this at Home's newsletter section
                  regardless of which page it's rendered on ("./FEROZ
                  Home.dc.html#newsletter" everywhere) — "/#newsletter"
                  reproduces that; a bare "#newsletter" would only work
                  correctly on the Home page itself. */}
              <Link href="/#newsletter" className={styles.colLink}>
                Contact
              </Link>
              <span className={styles.colLink}>Shipping</span>
              <span className={styles.colLink}>Returns</span>
            </div>
          </div>

          <div>
            {groupHeading("company", "Company")}
            <div
              id="footer-group-company"
              className={styles.colLinks}
              data-open={openGroup === "company"}
            >
              {aboutUsAsLink ? (
                <Link href="/about" className={styles.colLink}>
                  About Us
                </Link>
              ) : (
                <span className={styles.colLink}>About Us</span>
              )}
              <Link href="/stores" className={styles.storeLocatorLink}>
                Store Locator
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                  <circle cx="12" cy="9" r="2.3" />
                </svg>
              </Link>
              <Link href="/about" className={styles.colLink}>
                Careers
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.legal}>
          <span>© 2026 FEROZ. All rights reserved.</span>
          <span>HUNT YOUR LIMITS</span>
        </div>
      </div>
    </div>
  );
}
