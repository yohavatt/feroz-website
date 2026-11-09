import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./EmptyState.module.css";

// Generic icon + heading + description + CTA "empty" screen. First used by
// Cart's empty-cart state; source also has this exact shape for Search
// Results' "no results" and Store Locator's "no store found" states.
export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}

export function EmptyState({ icon, title, description, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>{icon}</div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <Link href={ctaHref} className={styles.cta}>
        {ctaLabel}
      </Link>
    </div>
  );
}
