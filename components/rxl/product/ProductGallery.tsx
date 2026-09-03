"use client";

import { useState } from "react";
import type { Product } from "@/lib/rxl/types/catalog";

export function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  const media = product.media;
  const current = media[selected];

  return (
    <div className="rxl-pdp-gallery">
      <div className="rxl-pdp-main-media">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.src} alt={current.alt} />
        ) : (
          <div className={`rxl-pdp-placeholder rxl-product-visual-${product.categorySlug}`} role="img" aria-label={`Representative visual for ${product.title}`}>
            <span>{product.series}</span>
            <strong>{product.partNumber}</strong>
          </div>
        )}
      </div>
      {media.length > 1 && (
        <div className="rxl-pdp-thumbs" aria-label="Product gallery thumbnails">
          {media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`View image ${index + 1}`}
              aria-current={selected === index ? "true" : undefined}
              onClick={() => setSelected(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
