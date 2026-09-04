import Link from "next/link";
import type { Product } from "@/lib/rxl/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.categorySlug}/${encodeURIComponent(product.partNumber)}`;
  const quoteHref = `/rfq?part=${encodeURIComponent(product.partNumber)}`;
  return (
    <article className="rxl-product-card">
      <Link className="rxl-product-visual" href={href} aria-label={`View ${product.title}`}>
        <div className={`rxl-product-visual-art rxl-product-visual-${product.categorySlug}`} aria-hidden="true"><span>{product.series}</span><strong>{product.partNumber}</strong></div>
      </Link>
      <div className="rxl-product-card-body">
        <div className="rxl-product-card-meta"><span>{product.category}</span><span>{product.partNumber}</span></div>
        <h2><Link href={href}>{product.title}</Link></h2>
        <p>{product.shortDescription}</p>
        {product.leadTime && <div className="rxl-product-card-meta"><span>Representative lead time</span><strong>{product.leadTime}</strong></div>}
        <div className="rxl-product-card-footer"><span className="rxl-demo-badge">Representative</span><div className="rxl-product-card-actions"><Link className="rxl-card-link" href={href}>View product →</Link><Link className="rxl-card-link rxl-card-link-quote" href={quoteHref}>Request Quote</Link></div></div>
      </div>
    </article>
  );
}
