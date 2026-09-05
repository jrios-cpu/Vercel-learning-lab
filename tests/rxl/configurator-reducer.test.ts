import { describe, expect, it } from "vitest";
import { configuratorReducer, initialConfiguratorState } from "@/components/rxl/configurator/configuratorReducer";

describe("configuratorReducer", () => {
  it("does not advance when required step data is missing", () => {
    const next = configuratorReducer(initialConfiguratorState, { type: "NEXT" });
    expect(next.step).toBe(1);
  });

  it("advances once required application data exists", () => {
    const selected = configuratorReducer(initialConfiguratorState, { type: "SET_APPLICATION", value: "Data center white space" });
    const next = configuratorReducer(selected, { type: "NEXT" });
    expect(next.step).toBe(2);
  });

  it("allows editing completed steps without skipping ahead", () => {
    const current = { ...initialConfiguratorState, step: 4 as const, application: "Colocation", productLine: "VaultLine", partNumbers: ["RXL-VL-4260-BK"] };
    expect(configuratorReducer(current, { type: "GO_TO", step: 2 }).step).toBe(2);
    expect(configuratorReducer({ ...initialConfiguratorState, step: 2 }, { type: "GO_TO", step: 4 }).step).toBe(2);
  });

  it("normalizes restored browser state", () => {
    const restored = configuratorReducer(initialConfiguratorState, { type: "RESTORE", state: { ...initialConfiguratorState, step: 5, quantity: 0 } });
    expect(restored.step).toBe(5);
    expect(restored.quantity).toBe(1);
  });
});
