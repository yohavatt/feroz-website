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

// Home's "Shop by category" carousel. The track is a native horizontal
// scroller with scroll-snap, so touch swipe, trackpad and momentum all come
// from the browser; JS only drives the prev/next buttons, the arrow keys and
// the position indicator. Without JS it is still a working swipeable row.
export function CategoryCarousel({ categories }: { categories: CarouselCategory[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const slides = useCallback(
    () => Array.from(trackRef.current?.children ?? []) as HTMLElement[],
    [],
  );

  // Index of the slide whose left edge is closest to the track's start.
  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const start = track.scrollLeft;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    let best = 0;
    let bestDist = Infinity;
    slides().forEach((el, i) => {
      const d = Math.abs(el.offsetLeft - pad - start);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(start <= 2);
    setAtEnd(start >= max - 2);
    // At the far end the last slides can't reach the start edge; report the last one.
    setActive(start >= max - 2 ? categories.length - 1 : best);
  }, [slides, categories.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const target = slides()[Math.max(0, Math.min(categories.length - 1, index))];
      if (!track || !target) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      track.scrollTo({ left: target.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
    },
    [slides, categories.length],
  );

  const step = (dir: 1 | -1) => scrollToIndex(active + dir);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

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
        <div className={styles.dots} aria-hidden="true">
          {categories.map((c, i) => (
            <span key={c.label} className={i === active ? styles.dotActive : styles.dot} />
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          <span className={styles.countCurrent}>{String(active + 1).padStart(2, "0")}</span>
          <span className={styles.countSep}>/</span>
          {String(categories.length).padStart(2, "0")}
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
