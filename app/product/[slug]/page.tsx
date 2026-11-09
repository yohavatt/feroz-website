import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ProductDetailView } from "@/components/product/ProductDetailView";

// Looks up the requested slug in the centralized product catalog
// (lib/products.ts) and renders the approved Product Detail template for
// whatever product it finds. Only a slug with no matching catalog entry
// falls through to notFound().
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
