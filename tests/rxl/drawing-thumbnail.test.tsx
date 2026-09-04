import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/rxl/catalog/ProductCard";
import { getDrawingThumbnailUrl, isAllowedRxlDrawingUrl } from "@/lib/rxl/drawings";
import type { Product } from "@/lib/rxl/types/catalog";

const drawingUrl = "https://www.rxlusa.com/wp-content/uploads/SolidDrawings/RXL-1001-X01.pdf";

const product: Product = {
  id: "RXL-1001-BZ01",
  title: "RXL-1001 J-Bolt Kit",
  slug: "rxl-1001-bz01",
  partNumber: "RXL-1001-BZ01",
  series: "RXL-1001",
  category: "Cable Pathways",
  categorySlug: "cable-pathways",
  shortDescription: "J-Bolt Kit",
  longDescription: "J-Bolt Kit",
  status: "verified",
  availability: null,
  leadTime: null,
  finish: "Black Zinc",
  specifications: { Color: "Black Zinc" },
  applications: [],
  media: [],
  documents: [{ id: "drawing", title: "Technical drawing", type: "drawing", href: drawingUrl, format: "PDF" }],
  components: [],
  relatedPartNumbers: [],
  accessories: [],
  configurator: { enabled: true, productLine: "RXL-1001" },
  seo: {},
};

describe("RXL technical drawing thumbnails", () => {
  it("only accepts the approved RXL SolidDrawings PDF source", () => {
    expect(isAllowedRxlDrawingUrl(drawingUrl)).toBe(true);
    expect(isAllowedRxlDrawingUrl("https://evil.example/drawing.pdf")).toBe(false);
    expect(isAllowedRxlDrawingUrl("https://www.rxlusa.com/wp-content/uploads/other/file.pdf")).toBe(false);
  });

  it("builds an internal thumbnail URL and uses it as the product visual", () => {
    const thumbnailUrl = getDrawingThumbnailUrl(drawingUrl);
    expect(thumbnailUrl).toContain("/api/catalog/drawing-thumbnail?src=");
    render(<ProductCard product={product} />);
    expect(screen.getByRole("img", { name: /Technical drawing for RXL-1001 J-Bolt Kit/i })).toHaveAttribute("src", expect.stringContaining("drawing-thumbnail"));
  });
});
