import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";
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

  it("keeps Request a Quote as a first-class route instead of redirecting it to the configurator", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects ?? []).not.toEqual(expect.arrayContaining([expect.objectContaining({ source: "/rfq" })]));
  });

  it("does not treat the engineering lab as a public marketing route", () => {
    expect(PUBLIC_ROUTE_PATHS).not.toContain("/lab");
  });
});
