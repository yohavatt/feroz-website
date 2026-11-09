# components/layout

Shared page-chrome components.

- `Nav` — sticky pill nav shared by all pages; active state computed from
  the real route via `usePathname`, replacing the source export's
  hand-set-per-page active link. **Implemented.**
- `Footer` — shared 4-column + legal bar footer. **Implemented.**
- `CategoryHero` — image hero + breadcrumb pattern used by Men/Women/
  Equipment/Sale/Search Results. **Implemented** (introduced for Men).
- `PageShell` — common max-width/padding wrapper. Not yet needed as a
  standalone component — each page currently applies its own max-width
  container per section, matching source's literal per-section padding
  (which isn't perfectly uniform across pages).
