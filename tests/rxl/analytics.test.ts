import { describe, expect, it } from "vitest";
import { captureAttribution } from "@/lib/rxl/analytics/attribution";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("RXL attribution", () => {
  it("captures first-touch UTM attribution once", () => {
    const storage = new MemoryStorage();
    const first = captureAttribution(new URL("https://example.test/?utm_source=linkedin&utm_medium=paid"), storage);
    const second = captureAttribution(new URL("https://example.test/?utm_source=google"), storage);
    expect(second.source).toBe("linkedin");
    expect(second).toEqual(first);
  });
});
