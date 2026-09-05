import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/rxl/catalog/CatalogBrowser";
import { PRODUCT_CATEGORIES } from "@/lib/rxl/data/products";
import { catalogProvider } from "@/lib/rxl/providers/catalog";

export async function generateStaticParams() {
  return Object.keys(PRODUCT_CATEGORIES).map((category) => ({ category }));
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const config = PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES];
  if (!config) notFound();
  const products = await catalogProvider.listProducts();

  return (
    <main id="main-content">
      <section className="rxl-page-head">
        <div className="rxl-wrap">
          <nav className="rxl-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/products">Solutions</Link><span>/</span><span>{config.name}</span>
          </nav>
          <h1>{config.name}</h1>
          <p>{config.blurb}</p>
        </div>
      </section>
      <section className="rxl-section">
        <div className="rxl-wrap"><CatalogBrowser products={products} initialCategory={category} /></div>
      </section>
    </main>
  );
}
