import { describe, expect, it } from "vitest";
import { deriveFamilyId, normalizeCategory } from "@/lib/rxl/catalog/schema";

describe("RXL catalog contract", () => {
  it("maps the five Odoo sections to stable public slugs", () => {
    expect(normalizeCategory("Section 1: Cable Pathways").slug).toBe("cable-pathways");
    expect(normalizeCategory("Section 2: Open Racks").slug).toBe("open-racks");
    expect(normalizeCategory("Section 3: Cable Management").slug).toBe("cable-management");
    expect(normalizeCategory("Section 4: Wall Mounts").slug).toBe("wall-mounts");
    expect(normalizeCategory("Section 5: Cabinets and Enclosures").slug).toBe("cabinets-enclosures");
  });

  it("derives family identity from the cleaned Odoo display name", () => {
    expect(deriveFamilyId("RXL-1001-BZ01", "[RXL-1001-BZ01] RXL-1001 (Black Zinc, 2.25\" L)")).toBe("RXL-1001");
    expect(deriveFamilyId("RXL-5550-BK422432S", "[RXL-5550-BK422432S] RXL-5550 (Black, 42U)")).toBe("RXL-5550");
  });
});
