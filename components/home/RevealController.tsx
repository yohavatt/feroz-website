"use client";

import { useEffect } from "react";

// Scroll reveal for Home. Elements opt in with the page's `.reveal` class
// plus a `data-reveal` attribute; this marks them `data-revealed` as they
// enter the viewport. Hiding only happens once the `reveal-on` class is on
// <html>, which this component adds after marking everything already in or
// above the viewport as revealed — so nothing on screen ever flashes, and
// without JavaScript (or with reduced motion) all content simply shows.
export function RevealController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length || !("IntersectionObserver" in window)) return;

    const vh = window.innerHeight;
    const pending = els.filter((el) => {
      if (el.getBoundingClientRect().top < vh * 0.95) {
        el.dataset.revealed = "true";
        return false;
      }
      return true;
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    pending.forEach((el) => io.observe(el));
    document.documentElement.classList.add("reveal-on");

    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-on");
    };
  }, []);

  return null;
}
