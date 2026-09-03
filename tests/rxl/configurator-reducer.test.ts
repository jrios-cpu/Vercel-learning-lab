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
});
