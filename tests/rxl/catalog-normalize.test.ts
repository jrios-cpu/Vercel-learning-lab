import { describe, expect, it } from "vitest";
import fixtureRows from "@/tests/fixtures/rxl/odoo-rows.json";
import { deriveFamilyId, normalizeCategory } from "@/lib/rxl/catalog/schema";
import { parseOdooRows } from "@/scripts/rxl/catalog/normalize";

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

  it("folds continuation variant rows into the preceding SKU", () => {
    const products = parseOdooRows(fixtureRows);
    expect(products[0]?.partNumber).toBe("RXL-1001-BZ01");
    expect(products[0]?.specifications).toEqual({
      Color: "Black Zinc",
      "J-Bolt Length": "2.25\" L",
    });
    expect(products[0]?.salesDescription).toBe("J-Bolt Kit");
    expect(products[1]?.specifications).toEqual({
      Color: "Black",
      "Runway Stringer": "1.5\" Stringer",
      Offset: "3\"",
    });
  });

  it("uses only Display Name plus variants when Sales Description is empty", () => {
    const rows = fixtureRows.map((row) => [...row]);
    rows[2]![3] = "";
    const [product] = parseOdooRows(rows);
    expect(product?.descriptionSource).toBe("display-name-plus-variants");
    expect(product?.salesDescription).toContain("RXL-1001");
    expect(product?.salesDescription).toContain("Color: Black Zinc");
    expect(product?.salesDescription).toContain("J-Bolt Length: 2.25\" L");
  });
});
