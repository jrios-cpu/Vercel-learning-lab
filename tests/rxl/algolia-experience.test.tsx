import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { AlgoliaExperience } from "@/components/rxl/catalog/AlgoliaExperience";

vi.mock("next/script", () => ({
  default: ({ src, id }: { src: string; id?: string }) => createElement("script", { src, id }),
}));

describe("Algolia Experiences integration", () => {
  it("renders the autocomplete mount and approved experience script", () => {
    const { container } = render(<AlgoliaExperience />);
    expect(container.querySelector("#autocomplete")).toBeInTheDocument();
    expect(screen.getByText(/Search the RXL catalog/i)).toBeInTheDocument();
    const script = container.querySelector("script#rxl-algolia-experiences");
    expect(script).toBeInTheDocument();
    const src = script?.getAttribute("src") ?? "";
    expect(src).toContain("https://cdn.jsdelivr.net/npm/@algolia/experiences/dist/experiences.js?");
    expect(src).toContain("appId=QVGC9APPPY");
    expect(src).toContain("experienceId=QVGC9APPPY");
    expect(src).toContain("env=prod");
    expect(src).toContain("apiKey=");
  });
});
