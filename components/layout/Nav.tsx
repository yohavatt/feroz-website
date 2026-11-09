"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchIcon, AccountIcon, CartIcon } from "../icons";
import styles from "./Nav.module.css";

// Sticky nav shared by every page. Active link is derived from the real
// route instead of being hand-set per page like the source export.
//
// Two presentations share this one component:
//   - >=721px: the approved desktop pill (.pill), untouched.
//   - <=720px: a compact bar (.bar) plus a slide-in drawer. Both are
//     display:none above the breakpoint, so nothing here reaches desktop.
const primaryLinks = [
  { label: "HOME", href: "/" },
  { label: "MEN", href: "/men" },
  { label: "WOMEN", href: "/women" },
  { label: "EQUIPMENT", href: "/equipment" },
  { label: "SALE", href: "/sale" },
];

const DESKTOP_QUERY = "(min-width: 721px)";

export interface NavProps {
  /** Cart item-count badge on the cart icon. Only Cart passes this today
   *  — omitted (undefined) everywhere else, which keeps every other
   *  page's nav exactly as it was before this prop existed. */
  cartCount?: number;
  /** Search Results is the only source page whose own nav renders the
   *  search icon in gold instead of cream. Defaults to false so every
   *  other page's nav is unchanged. */
  searchActive?: boolean;
}

export function Nav({ cartCount, searchActive = false }: NavProps = {}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const showBadge = !!cartCount && cartCount > 0;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // A tapped link navigates, so the drawer must not survive the route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    // Escape closes and hands focus back to the button that opened it.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    // Widening past the breakpoint hides the drawer's trigger, so the
    // drawer closes with it rather than being stranded open.
    const desktop = window.matchMedia(DESKTOP_QUERY);
    function onDesktop(e: MediaQueryListEvent) {
      if (e.matches) setMenuOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  return (
    <div className={styles.wrap} data-screen-label="Home">
      {/* ---- Desktop pill ---- */}
      <div className={styles.pill}>
        <div className={styles.links}>
          {primaryLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? styles.linkActive : styles.link}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className={styles.actions}>
          <Link href="/about" className={styles.aboutBtn}>
            ABOUT US
          </Link>
          <Link href="/search" className={styles.iconLink} aria-label="Search">
            <SearchIcon color={searchActive ? "var(--color-gold-500)" : "#F4EFE3"} />
          </Link>
          <Link href="/account" className={styles.iconLink} aria-label="Account">
            <AccountIcon color="#F4EFE3" />
          </Link>
          <div className={styles.cartWrap}>
            <Link href="/cart" className={styles.iconLink} aria-label="Cart">
              <CartIcon color="#F4EFE3" />
            </Link>
            {showBadge && <span className={styles.cartBadge}>{cartCount}</span>}
          </div>
        </div>
      </div>

      {/* ---- Mobile bar ---- */}
      <div className={styles.bar}>
        <button
          type="button"
          ref={toggleRef}
          onClick={() => setMenuOpen(true)}
          className={styles.menuBtn}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls={drawerId}
        >
          <span className={styles.menuGlyph} aria-hidden="true">
            <span />
            <span />
          </span>
          MENU
        </button>

        <Link href="/" className={styles.barBrand} aria-label="FEROZ home">
          <Image
            src="/assets/logo-white.png"
            alt=""
            width={34}
            height={34}
            className={styles.barLogo}
          />
        </Link>

        <div className={styles.barActions}>
          <Link href="/search" className={styles.barIcon} aria-label="Search">
            <SearchIcon color={searchActive ? "var(--color-gold-500)" : "#F4EFE3"} />
          </Link>
          <Link href="/cart" className={styles.barIcon} aria-label="Cart">
            <CartIcon color="#F4EFE3" />
            {showBadge && <span className={styles.barBadge}>{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* ---- Mobile drawer ---- */}
      {menuOpen && (
        <div className={styles.drawerRoot}>
          <div className={styles.scrim} onClick={closeMenu} aria-hidden="true" />
          <div
            id={drawerId}
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className={styles.drawerTop}>
              <span className={styles.drawerEyebrow}>MENU</span>
              <button
                type="button"
                ref={closeRef}
                onClick={closeMenu}
                className={styles.closeBtn}
                aria-label="Close menu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            <nav className={styles.drawerNav} aria-label="Primary">
              {primaryLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={active ? styles.drawerLinkActive : styles.drawerLink}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className={styles.drawerDivider} />

            <div className={styles.drawerSecondary}>
              <Link href="/account" onClick={closeMenu} className={styles.drawerSubLink}>
                <AccountIcon color="var(--color-gold-500)" />
                Account
              </Link>
              <Link href="/cart" onClick={closeMenu} className={styles.drawerSubLink}>
                <CartIcon color="var(--color-gold-500)" />
                {showBadge ? `Cart (${cartCount})` : "Cart"}
              </Link>
              <Link href="/stores" onClick={closeMenu} className={styles.drawerSubLink}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-gold-500)"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                  <circle cx="12" cy="9" r="2.3" />
                </svg>
                Store Locator
              </Link>
            </div>

            <Link href="/about" onClick={closeMenu} className={styles.drawerAbout}>
              ABOUT US
            </Link>

            <div className={styles.drawerTagline}>HUNT YOUR LIMITS</div>
          </div>
        </div>
      )}
    </div>
  );
}
