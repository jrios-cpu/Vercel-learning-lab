import Link from "next/link";
import { AlgoliaExperience } from "@/components/rxl/catalog/AlgoliaExperience";
import { CatalogBrowser } from "@/components/rxl/catalog/CatalogBrowser";
import { catalogProvider } from "@/lib/rxl/providers/catalog";

export const metadata = {
  title: "Solutions",
  description: "Explore representative RXL infrastructure solutions by category, series, and part number.",
};

export default async function ProductsPage() {
  const products = await catalogProvider.listProducts();
  return (
    <main id="main-content">
      <section className="rxl-page-head">
        <div className="rxl-wrap">
          <nav className="rxl-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><span>Solutions</span>
          </nav>
          <h1>Infrastructure solutions, organized around the work.</h1>
          <p>Search and filter representative product concepts from the approved RXL prototype. Pricing, inventory, and live availability are intentionally not connected.</p>
          <div className="rxl-solutions-actions">
            <Link className="rxl-btn rxl-btn-primary" href="/rfq">Request a Quote</Link>
            <Link className="rxl-btn rxl-btn-outline" href="/configurator">Start Project</Link>
          </div>
        </div>
      </section>
      <section className="rxl-section">
        <div className="rxl-wrap">
          <AlgoliaExperience />
          <CatalogBrowser products={products} />
        </div>
      </section>
    </main>
  );
}
