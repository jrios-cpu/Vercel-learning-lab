import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickQuoteForm } from "@/components/rxl/forms/QuickQuoteForm";
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
  specifications: {},
  applications: [],
  media: [],
  documents: [],
  components: [],
  relatedPartNumbers: [],
  accessories: [],
  configurator: { enabled: true, productLine: "VaultLine" },
  seo: {},
};

describe("QuickQuoteForm", () => {
  it("keeps the fast RFQ simple and preselects the product carried from catalog or PDP", () => {
    render(<QuickQuoteForm products={[product]} initialProduct={product} />);
    expect(screen.getByRole("form", { name: "Request a quote" })).toBeInTheDocument();
    expect(screen.getByLabelText("Product")).toHaveValue(product.partNumber);
    expect(screen.getByLabelText("Quantity")).toHaveValue(1);
    expect(screen.getByLabelText("Project notes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Request quote" })).toBeInTheDocument();
  });
});
