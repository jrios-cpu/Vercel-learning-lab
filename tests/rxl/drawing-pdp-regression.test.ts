import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { VERIFIED_PRODUCTS } from "@/lib/rxl/data/verified-products";

describe("PDP technical drawing regression", () => {
  it("keeps the absolute drawing renderer bounded by the PDP media frame", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "app/rxl-product.css"), "utf8");
    expect(css).toMatch(/\.rxl-pdp-main-media\{[^}]*position:relative/);
  });

  it("uses a verified Odoo SKU with a live official RXL family drawing", () => {
    const sample = VERIFIED_PRODUCTS.find((product) => product.partNumber === "RXL-5550-BK422432S");
    expect(sample).toBeDefined();
    expect(sample?.documents.some((document) => document.type === "drawing" && document.href === "https://www.rxlusa.com/wp-content/uploads/SolidDrawings/RXL-5550.pdf")).toBe(true);
    expect(VERIFIED_PRODUCTS.some((product) => product.partNumber === "RXL-5001-BK")).toBe(false);
  });
});
