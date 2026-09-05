import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageView } from "@/components/rxl/product/ProductPageView";
import { catalogProvider } from "@/lib/rxl/providers/catalog";
import { RXL_SITE } from "@/lib/rxl/site";

export async function generateMetadata({ params }: { params: Promise<{ category: string; sku: string }> }): Promise<Metadata> {
  const { category, sku } = await params;
  const product = await catalogProvider.getProductByPartNumber(sku);
  if (!product || product.categorySlug !== category) return { title: "Product not found", robots: { index: false } };
  return { title: product.seo.title ?? product.title, description: product.seo.description ?? product.shortDescription, alternates: { canonical: `${RXL_SITE.productionUrl}/products/${product.categorySlug}/${encodeURIComponent(product.partNumber)}` } };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string; sku: string }> }) {
  const { category, sku } = await params;
  const product = await catalogProvider.getProductByPartNumber(sku);
  if (!product || product.categorySlug !== category) notFound();
  const products = await catalogProvider.listProducts();
  const related = product.relatedPartNumbers.map((partNumber) => products.find((candidate) => candidate.partNumber === partNumber)).filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.title, sku: product.partNumber, category: product.category, description: product.shortDescription, url: `${RXL_SITE.productionUrl}/products/${product.categorySlug}/${encodeURIComponent(product.partNumber)}` };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ProductPageView product={product} related={related} /></>;
}
