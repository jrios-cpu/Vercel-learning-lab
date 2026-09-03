import { describe, expect, it } from "vitest";
import { RXL_SITE } from "@/lib/rxl/site";

describe("RXL site configuration", () => {
  it("uses RXL public identity without inventing unverified contact facts", () => {
    expect(RXL_SITE.name).toBe("RXL USA");
    expect(RXL_SITE.primaryCta.href).toBe("/configurator");
    expect(RXL_SITE.contact.phone).toBeNull();
    expect(RXL_SITE.contact.address).toBeNull();
  });
});
