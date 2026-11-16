"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ArrowRightIcon } from "@/components/icons";
import styles from "./CategoryCarousel.module.css";

export interface CarouselCategory {
  label: string;
  href: string;
  image: string;
  icon: string;
}

interface Position {
  /** Index of the current stop in `stops`. */
  stop: number;
  /** Number of distinct scroll positions the track can actually reach. */
  stops: number;
  /** First and last fully visible category (0-based). */
  first: number;
  last: number;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

// Home's "Shop by category" carousel. The track is a native horizontal
// scroller with scroll-snap, so touch swipe, trackpad and momentum all come
// from the browser; JS drives the prev/next buttons, the arrow keys and the
// position indicator. Without JS it is still a working swipeable row.
//
// Navigation works on *reachable stops*, not on slide indexes: with three
// cards in view, the last two cards can never sit at the start edge, so
// "go to slide 4" from the end is a no-op. Stops are each slide's offset
// clamped to the maximum scroll, de-duplicated, so every stop is a real,
// distinct position and Previous/Next always move.
export function CategoryCarousel({ categories }: { categories: CarouselCategory[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Stop a programmatic smooth scroll is heading to; consecutive clicks step
  // from it instead of from the half-scrolled current position.
  const pendingRef = useRef<number | null>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const [pos, setPos] = useState<Position>({ stop: 0, stops: categories.length, first: 0, last: 0 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const slides = Array.from(track.children) as HTMLElement[];
    const stops: number[] = [];
    for (const el of slides) {
      const left = Math.min(Math.max(0, el.offsetLeft - pad), max);
      if (!stops.length || left - stops[stops.length - 1]! > 2) stops.push(left);
    }
    return { track, slides, stops };
  }, []);

  const nearestStop = (stops: number[], x: number) => {
    let best = 0;
    for (let i = 1; i < stops.length; i++) if (Math.abs(stops[i]! - x) < Math.abs(stops[best]! - x)) best = i;
    return best;
  };

  const update = useCallback(() => {
    const m = measure();
    if (!m) return;
    const { track, slides, stops } = m;
    const x = track.scrollLeft;
    // Visible window in the track's content coordinates (slides' offsetLeft
    // is measured from the track, which is position: relative).
    const viewL = x - 2;
    const viewR = x + track.clientWidth + 2;
    let first = -1;
    let last = -1;
    slides.forEach((el, i) => {
      if (el.offsetLeft >= viewL && el.offsetLeft + el.offsetWidth <= viewR) {
        if (first < 0) first = i;
        last = i;
      }
    });
    if (first < 0) first = last = Math.min(slides.length - 1, nearestStop(stops, x));
    const stop = pendingRef.current ?? nearestStop(stops, x);
    setPos((p) =>
      p.stop === stop && p.stops === stops.length && p.first === first && p.last === last
        ? p
        : { stop, stops: stops.length, first, last },
    );
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    // A programmatic scroll is finished once scrolling has been quiet for a
    // moment ("scrollend" where supported, a short timer otherwise).
    const settle = () => {
      pendingRef.current = null;
      update();
    };
    const onScroll = () => {
      schedule();
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(settle, 160);
    };
    // Viewport/track resize: stops and visible range change, re-measure now.
    const ro = new ResizeObserver(() => {
      pendingRef.current = null;
      update();
    });
    ro.observe(track);
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("scrollend", settle);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer.current);
      ro.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", settle);
    };
  }, [update]);

  const goTo = useCallback(
    (target: number) => {
      const m = measure();
      if (!m) return;
      const { track, stops } = m;
      const from = pendingRef.current ?? nearestStop(stops, track.scrollLeft);
      const to = Math.max(0, Math.min(stops.length - 1, target));
      if (to === from && Math.abs(track.scrollLeft - stops[to]!) < 2) return;
      pendingRef.current = to;
      setPos((p) => ({ ...p, stop: to }));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: stops[to]!, behavior: reduce ? "auto" : "smooth" });
      // Fallback in case the browser emits no scroll event (already there).
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        pendingRef.current = null;
        update();
      }, 900);
    },
    [measure, update],
  );

  const step = (dir: 1 | -1) => {
    const m = measure();
    if (!m) return;
    const from = pendingRef.current ?? nearestStop(m.stops, m.track.scrollLeft);
    goTo(from + dir);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Only when the track itself has focus; arrow keys on a focused card
    // link still move between stops, but Home/End stay with the page.
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.target === e.currentTarget && e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.target === e.currentTarget && e.key === "End") {
      e.preventDefault();
      goTo(pos.stops - 1);
    }
  };

  const atStart = pos.stop <= 0;
  const atEnd = pos.stop >= pos.stops - 1;
  const range =
    pos.first === pos.last ? pad2(pos.first + 1) : `${pad2(pos.first + 1)}–${pad2(pos.last + 1)}`;

  return (
    <div className={styles.carousel}>
      <div
        ref={trackRef}
        className={styles.track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Shop by category"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {categories.map((c, i) => (
          <div
            key={c.label}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${categories.length}: ${c.label}`}
          >
            <CategoryCard variant="slide" label={c.label} href={c.href} image={c.image} icon={c.icon} />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        {/* One dot per reachable position, so dots, arrows and scroll agree. */}
        <div className={styles.dots} aria-hidden="true">
          {Array.from({ length: pos.stops }, (_, i) => (
            <span key={i} className={i === pos.stop ? styles.dotActive : styles.dot} />
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          <span className={styles.srOnly}>Showing categories </span>
          <span className={styles.countCurrent}>{range}</span>
          <span className={styles.countSep}>/</span>
          {pad2(categories.length)}
        </p>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous category"
          >
            <ArrowRightIcon size={18} className={styles.iconPrev} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Next category"
          >
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
