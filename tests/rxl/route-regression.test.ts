import { describe, expect, it } from "vitest";
import { PUBLIC_ROUTE_PATHS } from "@/lib/rxl/site";

describe("RXL public route inventory", () => {
  it("keeps every required public destination represented", () => {
    expect(PUBLIC_ROUTE_PATHS).toEqual(expect.arrayContaining([
      "/",
      "/about",
      "/workflow",
      "/case-studies",
      "/industries",
      "/products",
      "/search",
      "/configurator",
      "/rfq",
      "/resources",
      "/news",
      "/careers",
      "/contact",
      "/customer-portal",
      "/employees",
      "/legal/privacy",
      "/legal/terms",
    ]));
  });

  it("does not treat the engineering lab as a public marketing route", () => {
    expect(PUBLIC_ROUTE_PATHS).not.toContain("/lab");
  });
});
