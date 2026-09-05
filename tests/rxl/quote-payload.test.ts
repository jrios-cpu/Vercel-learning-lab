import { describe, expect, it } from "vitest";
import { initialConfiguratorState, type ConfiguratorState } from "@/components/rxl/configurator/configuratorReducer";
import { buildQuickQuotePayload, buildQuotePayload } from "@/lib/rxl/configurator/payload";
import type { Product } from "@/lib/rxl/types/catalog";

const completeState: ConfiguratorState = {
  ...initialConfiguratorState,
  step: 5,
  application: "Data center white space",
  productLine: "VaultLine",
  partNumbers: ["RXL-VL-4260-BK"],
  selections: { finish: "Textured Black" },
  accessories: ["Cable management"],
  quantity: 2,
  targetTimeline: "Q1",
  notes: "Representative project context for payload testing.",
};

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

const attribution = { source: "direct", medium: null, campaign: null, landingPage: "/configurator", sessionId: "test-session" };

describe("quote payloads", () => {
  it("marks full configurator submissions with the configurator source", () => {
    const payload = buildQuotePayload(completeState, { name: "QA User", email: "qa@example.com", company: "Preview Co" }, attribution);
    expect(payload.source).toBe("configurator");
    expect(payload.configuration.partNumbers.length).toBeGreaterThan(0);
    expect(payload.routing.status).toBe("unconfigured");
    expect(payload.quoteRef).toMatch(/^RXL-/);
    expect(payload.contact.email).toBe("qa@example.com");
  });

  it("builds a fast RFQ payload on the same contract without inventing an application", () => {
    const payload = buildQuickQuotePayload({ name: "Buyer", email: "buyer@example.com", product, quantity: 4, notes: "Need four cabinets for phase one." }, { ...attribution, landingPage: "/rfq" });
    expect(payload.source).toBe("quick_rfq");
    expect(payload.application).toBeNull();
    expect(payload.productLine).toBe("VaultLine");
    expect(payload.configuration.partNumbers).toEqual([product.partNumber]);
    expect(payload.quantity).toBe(4);
  });
});
