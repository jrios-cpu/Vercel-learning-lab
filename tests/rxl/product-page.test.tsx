import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductPageView } from "@/components/rxl/product/ProductPageView";
import type { Product } from "@/lib/rxl/types/catalog";

const product: Product = {
  id: "RXL-VL-4260-BK",
  title: "VaultLine 42U Server Cabinet 600 x 1200",
  slug: "rxl-vl-4260-bk",
  partNumber: "RXL-VL-4260-BK",
  series: "VaultLine",
  category: "Cabinets & Racks",
  categorySlug: "cabinets",
  shortDescription: "Representative cabinet.",
  longDescription: "Representative cabinet detail.",
  status: "representative",
  availability: null,
  leadTime: "In stock",
  finish: "Textured Black",
  specifications: { "Rack Units": "42U", Width: "600 mm" },
  applications: ["Data center white space"],
  media: [],
  documents: [{ id: "spec", title: "Specification sheet", type: "spec-sheet", href: null, format: "PDF" }],
  components: [],
  relatedPartNumbers: [],
  accessories: [],
  configurator: { enabled: true, productLine: "VaultLine" },
  seo: {},
};

describe("ProductPageView", () => {
  it("offers both full configuration and the fast RFQ path while preserving accessible tabs", () => {
    render(<ProductPageView product={product} related={[]} />);
    expect(screen.getByRole("heading", { name: product.title })).toBeInTheDocument();
    expect(screen.getAllByText(product.partNumber).length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: /Specifications/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByText("42U").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Configure|Start Project/i })).toHaveAttribute("href", expect.stringContaining(product.partNumber));
    expect(screen.getByRole("link", { name: /Request a Quote/i })).toHaveAttribute("href", expect.stringContaining(product.partNumber));
    fireEvent.click(screen.getByRole("tab", { name: /Documents/i }));
    expect(screen.getByText(/Specification sheet/i)).toBeInTheDocument();
  });
});
