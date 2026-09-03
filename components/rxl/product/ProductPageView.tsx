import Link from "next/link";
import type { Product } from "@/lib/rxl/types/catalog";
import { ProductGallery } from "./ProductGallery";
import { ProductRelated } from "./ProductRelated";
import { ProductTabs } from "./ProductTabs";

export function ProductPageView({ product, related }: { product: Product; related: Product[] }) {
  return (
    <main id="main-content" className="rxl-pdp">
      <section className="rxl-pdp-top">
        <div className="rxl-wrap">
          <nav className="rxl-pdp-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/products">Solutions</Link><span>/</span><Link href={`/products/${product.categorySlug}`}>{product.category}</Link><span>/</span><span>{product.partNumber}</span>
          </nav>
          <div className="rxl-pdp-grid">
            <ProductGallery product={product} />
            <div className="rxl-pdp-buybox">
              <div className="rxl-pdp-kicker">{product.category} · {product.series}</div>
              <h1>{product.title}</h1>
              <code className="rxl-pdp-part">{product.partNumber}</code>
              <p className="rxl-pdp-lede">{product.shortDescription}</p>
              <dl className="rxl-pdp-summary">
                {product.finish && <div><dt>Finish</dt><dd>{product.finish}</dd></div>}
                <div><dt>Data status</dt><dd>Representative Preview</dd></div>
              </dl>
              <div className="rxl-pdp-notice">Live pricing, inventory, commercial lead-time commitments, and certification status are not connected.</div>
              <div className="rxl-actions">
                <Link className="rxl-btn rxl-btn-primary" href={`/configurator?part=${encodeURIComponent(product.partNumber)}`}>Configure / Start Project</Link>
                <Link className="rxl-btn rxl-btn-outline" href={`/contact?part=${encodeURIComponent(product.partNumber)}`}>Contact team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="rxl-section rxl-pdp-details">
        <div className="rxl-wrap"><ProductTabs product={product} /></div>
      </section>
      <ProductRelated products={related} />
    </main>
  );
}
