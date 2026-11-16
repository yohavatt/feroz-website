"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./AlpineBackdrop.module.css";

// Background for Home's brand-values section: the muted ridge-line artwork
// (already used on About), two slow-drifting mist layers (pure CSS) and a
// very small scroll parallax on the artwork. Parallax only runs while the
// section is on screen, writes a single CSS variable per frame and is
// skipped entirely under prefers-reduced-motion.
export function AlpineBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    let visible = false;

    const apply = () => {
      frame = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the section enters from below, +1 when it leaves at the top.
      const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)));
      root.style.setProperty("--parallax", p.toFixed(4));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(apply);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.art}>
        <Image src="/assets/about-bg-2.jpg" alt="" fill sizes="100vw" className={styles.artImage} />
      </div>
      <div className={styles.mistFar} />
      <div className={styles.mistNear} />
      <div className={styles.shade} />
    </div>
  );
}
