import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/rxl/catalog/ProductCard";
import { getDrawingProxyUrl, isAllowedRxlDrawingUrl } from "@/lib/rxl/drawings";
import type { Product } from "@/lib/rxl/types/catalog";

vi.mock("@/components/rxl/catalog/TechnicalDrawingPreview", () => ({
  TechnicalDrawingPreview: ({ drawingUrl, alt }: { drawingUrl: string; alt: string }) => (
    <canvas role="img" aria-label={alt} data-pdf-src={drawingUrl} />
  ),
}));

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

describe("RXL technical drawing previews", () => {
  it("only accepts the approved RXL SolidDrawings PDF source", () => {
    expect(isAllowedRxlDrawingUrl(drawingUrl)).toBe(true);
    expect(isAllowedRxlDrawingUrl("https://evil.example/drawing.pdf")).toBe(false);
    expect(isAllowedRxlDrawingUrl("https://www.rxlusa.com/wp-content/uploads/other/file.pdf")).toBe(false);
  });

  it("builds a same-origin cached PDF proxy URL", () => {
    expect(getDrawingProxyUrl(drawingUrl)).toBe(`/api/catalog/drawing-pdf?src=${encodeURIComponent(drawingUrl)}`);
  });

  it("uses the official drawing as the product visual when media is absent", () => {
    render(<ProductCard product={product} />);
    const preview = screen.getByRole("img", { name: /Technical drawing for RXL-1001 J-Bolt Kit/i });
    expect(preview).toHaveAttribute("data-pdf-src", drawingUrl);
    expect(screen.queryByRole("img", { name: /Representative preview/i })).not.toBeInTheDocument();
  });
});
