import { describe, expect, it } from "vitest";
import { catalogProvider } from "@/lib/rxl/providers/catalog";
import { applyCatalogQuery } from "@/lib/rxl/data/catalog-filter";

describe("RXL catalog", () => {
  it("finds a product by part number", async () => {
    const products = await catalogProvider.listProducts();
    const result = applyCatalogQuery(products, { query: "RXL-VL-4260-BK" });
    expect(result.items[0]?.partNumber).toBe("RXL-VL-4260-BK");
  });

  it("filters by category and series while returning live facet counts", async () => {
    const products = await catalogProvider.listProducts();
    const result = applyCatalogQuery(products, { category: "cabinets", series: ["VaultLine"] });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((product) => product.categorySlug === "cabinets" && product.series === "VaultLine")).toBe(true);
    expect(result.facets.series.VaultLine).toBeGreaterThan(0);
  });
});
