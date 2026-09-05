import type { Product } from "@/lib/rxl/types/catalog";
import { ProductCard } from "@/components/rxl/catalog/ProductCard";

export function ProductRelated({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="rxl-section rxl-section-gray">
      <div className="rxl-wrap">
        <div className="rxl-section-head">
          <span>Related systems</span>
          <h2>Continue the product path.</h2>
          <p>Representative products from the same family for comparison and configuration planning.</p>
        </div>
        <div className="rxl-product-grid">
          {products.map((product) => <ProductCard product={product} key={product.partNumber} />)}
        </div>
      </div>
    </section>
  );
}
