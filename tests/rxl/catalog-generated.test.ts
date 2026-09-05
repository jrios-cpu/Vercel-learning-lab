import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { ImportedOdooProduct } from "@/lib/rxl/catalog/schema";

const workDir = process.env.RXL_CATALOG_WORK_DIR;
const describeFullCatalog = workDir ? describe : describe.skip;

function loadImportedProducts(): ImportedOdooProduct[] {
  if (!workDir) throw new Error("RXL_CATALOG_WORK_DIR is required for the full-source catalog gate");
  return JSON.parse(readFileSync(resolve(workDir, "imported-products.json"), "utf8")) as ImportedOdooProduct[];
}

describeFullCatalog("full Odoo catalog integrity", () => {
  const products = loadImportedProducts();
  const bySku = (sku: string) => products.find((product) => product.partNumber === sku);

  it("preserves every current-source SKU and exact category totals", () => {
    expect(products).toHaveLength(10_906);
    expect(new Set(products.map((product) => product.partNumber)).size).toBe(10_906);

    const categoryCounts = products.reduce<Record<string, number>>((counts, product) => {
      counts[product.categorySlug] = (counts[product.categorySlug] ?? 0) + 1;
      return counts;
    }, {});

    expect(categoryCounts).toEqual({
      "cable-pathways": 2_839,
      "open-racks": 1_693,
      "cable-management": 1_474,
      "wall-mounts": 1_415,
      "cabinets-enclosures": 3_485,
    });
  });

  it("preserves descriptions and drawing coverage without silent loss", () => {
    expect(products.filter((product) => product.descriptionSource === "display-name-plus-variants")).toHaveLength(12);
    expect(products.filter((product) => Boolean(product.drawingPdfUrl))).toHaveLength(10_615);
    expect(new Set(products.flatMap((product) => product.drawingPdfUrl ? [product.drawingPdfUrl] : [])).size).toBe(4_068);

    for (const product of products) {
      expect(product.partNumber).not.toBe("");
      expect(product.familyId).not.toBe("");
      expect(product.title).not.toBe("");
      expect(product.category).not.toBe("");
      expect(product.categorySlug).not.toBe("");
      expect(product.salesDescription).not.toBe("");
    }
  });

  it("retains representative continuation rows and exact family identity", () => {
    expect(bySku("RXL-1001-BZ01")?.specifications).toMatchObject({
      Color: "Black Zinc",
      "J-Bolt Length": "2.25\" L",
    });
    expect(bySku("RXL-5550-BK422432S")?.familyId).toBe("RXL-5550");
    expect(bySku("RXL-5550-BK422432S")?.specifications).toMatchObject({
      Color: "Black",
      "Rack Units": "42U",
      "Rail Style": "3/8\" Square Punched",
      "Cabinet Width": "600mm (24in)",
      "Cabinet Depth": "800mm (32in)",
    });
  });

  it("does not overwrite repeated specification keys", () => {
    expect(bySku("RXL-1063-BK1812")?.specificationValues["Runway Width"]).toEqual(["18\" W", "12\" W"]);
  });
});
