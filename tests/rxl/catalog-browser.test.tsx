import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CatalogBrowser } from "@/components/rxl/catalog/CatalogBrowser";
import type { Product } from "@/lib/rxl/types/catalog";

const products: Product[] = [
  {
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
  },
];

describe("CatalogBrowser", () => {
  it("filters and clears catalog state", () => {
    render(<CatalogBrowser products={products} />);
    const cabinets = screen.getByRole("checkbox", { name: /Cabinets & Racks/i });
    fireEvent.click(cabinets);
    expect(screen.getByRole("button", { name: /Cabinets & Racks.*remove/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Clear all/i }));
    expect(screen.queryByRole("button", { name: /Cabinets & Racks.*remove/i })).not.toBeInTheDocument();
  });
});
