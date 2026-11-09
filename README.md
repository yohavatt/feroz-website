# FEROZ Web — Phase 1

Real Next.js + React + TypeScript frontend for the approved FEROZ
e-commerce design. Frontend-only for Phase 1: no backend, auth,
payments, or database.

## Design source of truth

The approved design lives in a separate, **read-only** reference
project and must never be edited from here:

`C:\Users\yohav\Downloads\FEROZ E-commerce Design System-handoff\feroz-e-commerce-design-system\project\`

That folder contains the 12 approved `.dc.html` pages, the Design
System spec, and the original image assets. This repo re-implements
that design pixel-for-pixel in real code — it does not redesign,
simplify, or reinterpret it.

## Status: foundation only

This is the Phase 1 project scaffold. **No pages are implemented
yet.** What exists so far:

- Next.js (App Router) + React + TypeScript + ESLint tooling config
- Design tokens transcribed from the Design System page
  (`app/globals.css`)
- Root layout with the three FEROZ fonts (Anton, Poppins, Space Mono)
  wired via `next/font/google` (`app/layout.tsx`)
- TypeScript types for Product, Cart, Order, Store (`lib/types/`)
- Directory skeleton for components, mock data, constants, and assets,
  each with a README describing what belongs there

Not yet done (intentionally deferred): `npm install`, route pages,
component implementations, mock catalog data, and copying the asset
files into `public/assets/`.

## Structure

```
app/            Next.js App Router routes (currently: root layout only)
components/     layout/ product/ forms/ ui/ icons/  — all placeholders
lib/
  types/        Product, CartItem, Order, Store interfaces
  data/         (empty) typed mock catalog/orders/stores
  constants/    (empty) nav + footer link data
public/assets/  (empty) copied FEROZ imagery/icons
```
