import { describe, expect, it } from "vitest";
import { initialConfiguratorState, type ConfiguratorState } from "@/components/rxl/configurator/configuratorReducer";
import { buildQuotePayload } from "@/lib/rxl/configurator/payload";

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

describe("buildQuotePayload", () => {
  it("builds a deterministic structured payload shape", () => {
    const payload = buildQuotePayload(
      completeState,
      { name: "QA User", email: "qa@example.com", company: "Preview Co" },
      { source: "direct", medium: null, campaign: null, landingPage: "/configurator", sessionId: "test-session" },
    );
    expect(payload.configuration.partNumbers.length).toBeGreaterThan(0);
    expect(payload.routing.status).toBe("unconfigured");
    expect(payload.quoteRef).toMatch(/^RXL-/);
    expect(payload.contact.email).toBe("qa@example.com");
  });
});
