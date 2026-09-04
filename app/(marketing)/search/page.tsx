import Link from "next/link";
import { CatalogBrowser } from "@/components/rxl/catalog/CatalogBrowser";
import { catalogProvider } from "@/lib/rxl/providers/catalog";

export const metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const products = await catalogProvider.listProducts();

  return (
    <main id="main-content">
      <section className="rxl-page-head">
        <div className="rxl-wrap">
          <nav className="rxl-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><span>Search</span>
          </nav>
          <h1>Search the representative RXL catalog.</h1>
          <p>Find products by part number, series, category, description, or application.</p>
        </div>
      </section>
      <section className="rxl-section">
        <div className="rxl-wrap"><CatalogBrowser products={products} initialQuery={query} /></div>
      </section>
    </main>
  );
}
