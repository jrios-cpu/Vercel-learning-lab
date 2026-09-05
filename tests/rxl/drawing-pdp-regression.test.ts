import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { VERIFIED_PRODUCTS } from "@/lib/rxl/data/verified-products";

describe("PDP technical drawing regression", () => {
  it("keeps the absolute drawing renderer bounded by the PDP media frame", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "app/rxl-product.css"), "utf8");
    expect(css).toMatch(/\.rxl-pdp-main-media\{[^}]*position:relative/);
  });

  it("preserves verified products even when an Odoo drawing link is stale", () => {
    const staleSample = VERIFIED_PRODUCTS.find((product) => product.partNumber === "RXL-5001-BK");
    expect(staleSample).toBeDefined();
    expect(staleSample?.documents.some((document) => document.type === "drawing" && document.href)).toBe(false);
  });

  it("includes a verified Odoo SKU with a live official RXL family drawing", () => {
    const liveSample = VERIFIED_PRODUCTS.find((product) => product.partNumber === "RXL-5550-BK422432S");
    expect(liveSample).toBeDefined();
    expect(liveSample?.documents.some((document) => document.type === "drawing" && document.href === "https://www.rxlusa.com/wp-content/uploads/SolidDrawings/RXL-5550.pdf")).toBe(true);
  });
});
