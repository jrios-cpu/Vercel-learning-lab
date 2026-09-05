import Image from "next/image";
import Link from "next/link";
import { getProductDrawingUrl } from "@/lib/rxl/drawings";
import type { Product } from "@/lib/rxl/types/catalog";
import { TechnicalDrawingPreview } from "./TechnicalDrawingPreview";

const representativeMedia: Record<string, string> = {
  cabinets: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=82",
  containment: "https://images.unsplash.com/photo-1643119775771-54a727776db5?auto=format&fit=crop&w=1200&q=82",
  cooling: "https://images.unsplash.com/photo-1774770080861-bc2c50829c92?auto=format&fit=crop&w=1200&q=82",
};

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.categorySlug}/${encodeURIComponent(product.partNumber)}`;
  const quoteHref = `/rfq?part=${encodeURIComponent(product.partNumber)}`;
  const media = product.media[0];
  const drawingUrl = getProductDrawingUrl(product);
  const fallbackSrc = representativeMedia[product.categorySlug] ?? representativeMedia.cabinets;
  const alt = media?.alt ?? `Representative preview for ${product.series} ${product.category}`;

  return (
    <article className="rxl-product-card">
      <Link className="rxl-product-visual" href={href} aria-label={`View ${product.title}`}>
        {media ? (
          <Image className="rxl-product-visual-image" src={media.src} alt={media.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 1080px) 50vw, 33vw" />
        ) : drawingUrl ? (
          <TechnicalDrawingPreview drawingUrl={drawingUrl} alt={`Technical drawing for ${product.title}`} />
        ) : (
          <Image className="rxl-product-visual-image" src={fallbackSrc} alt={alt} fill sizes="(max-width: 560px) 100vw, (max-width: 1080px) 50vw, 33vw" />
        )}
        <div className="rxl-product-visual-scrim" aria-hidden="true" />
        <div className="rxl-product-visual-copy" aria-hidden="true">
          {!media && drawingUrl && <em>Official technical drawing</em>}
          {!media && !drawingUrl && <em>Representative Preview</em>}
          <span>{product.series}</span>
          <strong>{product.partNumber}</strong>
        </div>
      </Link>
      <div className="rxl-product-card-body">
        <div className="rxl-product-card-meta"><span>{product.category}</span><span>{product.partNumber}</span></div>
        <h2><Link href={href}>{product.title}</Link></h2>
        <p>{product.shortDescription}</p>
        {product.leadTime && <div className="rxl-product-card-meta"><span>Representative lead time</span><strong>{product.leadTime}</strong></div>}
        <div className="rxl-product-card-footer"><span className="rxl-demo-badge">{product.status === "verified" ? "Verified source" : "Representative"}</span><div className="rxl-product-card-actions"><Link className="rxl-card-link" href={href}>View product →</Link><Link className="rxl-card-link rxl-card-link-quote" href={quoteHref}>Request Quote</Link></div></div>
      </div>
    </article>
  );
}
