import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/lib/rxl/data/products";
import { buildRobotsRules, productJsonLd } from "@/lib/rxl/seo/metadata";

describe("RXL SEO", () => {
  it("does not emit Offer schema for representative product data", () => {
    const schema = productJsonLd(PRODUCTS[0]);
    expect(schema).not.toHaveProperty("offers");
    expect(schema.sku).toBe(PRODUCTS[0].partNumber);
  });

  it("keeps lab disallowed in Production", () => {
    const rules = buildRobotsRules({ production: true });
    expect(JSON.stringify(rules)).toContain("/lab");
  });

  it("disallows all crawling in Preview", () => {
    const rules = buildRobotsRules({ production: false });
    expect(JSON.stringify(rules)).toContain('"disallow":"/"');
  });
});
