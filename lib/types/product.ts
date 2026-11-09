// Shapes mirror the per-page `productsData` / `product` objects found in
// FEROZ Men/Women/Equipment/Search Results/Product Detail .dc.html files.
// No mock data lives here yet — types only (see lib/data).

export interface ProductBadge {
  text: string;
  bg: string;
  color: string;
}

export interface ProductColor {
  name: string;
  swatch: string;
}

export interface ProductStars {
  filled: boolean;
  empty: boolean;
}

export interface ProductTab {
  label: string;
  content: string;
}

export interface ProductFeature {
  title: string;
  desc: string;
  icon: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number; // 0-5
  reviewCount?: number;
  description?: string;
  image: string;
  images?: string[];
  badge?: ProductBadge | null;
  sizes?: string[];
  unavailableSizes?: string[];
  colors?: ProductColor[];
  keywords?: string;
  group?: string; // e.g. 'jackets' | 'layers' | 'pants' | 'tshirts' | 'backpacks' | ...
  tabs?: ProductTab[];
  features?: ProductFeature[];
}
