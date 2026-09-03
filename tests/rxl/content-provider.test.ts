import { describe, expect, it } from "vitest";
import { contentProvider } from "@/lib/rxl/providers/content";

describe("contentProvider", () => {
  it("returns a home model with the approved configurator conversion path", async () => {
    const home = await contentProvider.getHome();
    expect(home.primaryCta).toEqual({ label: "Start Your Project", href: "/configurator" });
    expect(home.title).toContain("Redefining");
  });

  it("keeps representative articles explicitly marked as representative", async () => {
    const articles = await contentProvider.listArticles();
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((article) => article.status === "representative")).toBe(true);
  });
});
