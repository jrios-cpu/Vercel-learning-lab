import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/rxl/catalog/ProductCard";
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
  longDescription: "Representative cabinet for Preview testing.",
  status: "representative",
  availability: null,
  leadTime: "In stock",
  finish: "Textured Black",
  specifications: { "Rack Units": "42U", Width: "600mm" },
  applications: ["Data center"],
  media: [],
  documents: [],
  components: [],
  relatedPartNumbers: [],
  accessories: [],
  configurator: { enabled: true, productLine: "VaultLine" },
  seo: {},
};

describe("ProductCard", () => {
  it("shows visual media in Solutions and preserves the quick quote action", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("img", { name: /Representative preview for VaultLine/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Request Quote" })).toHaveAttribute("href", "/rfq?part=RXL-VL-4260-BK");
  });
});
