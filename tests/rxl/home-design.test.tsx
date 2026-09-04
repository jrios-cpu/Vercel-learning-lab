import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/(marketing)/page";
import { DeliveryFlow } from "@/components/rxl/home/DeliveryFlow";
import { HomeHero } from "@/components/rxl/home/HomeHero";
import { homeContent } from "@/lib/rxl/data/content";

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };
type MockImageProps = ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean };
vi.mock("next/link", () => ({ default: ({ href, children, ...props }: MockLinkProps) => createElement("a", { ...props, href }, children) }));
vi.mock("next/image", () => ({ default: ({ fill: _fill, priority: _priority, ...props }: MockImageProps) => createElement("img", props) }));

describe("approved RXL home design contract", () => {
  it("keeps the winning hero messaging and CTA pair", () => {
    render(<HomeHero content={homeContent} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Redefining.*What's Possible/i);
    expect(screen.getByRole("link", { name: "Start Your Project" })).toHaveAttribute("href", "/configurator");
    expect(screen.getByRole("link", { name: "Upload Your Drawings" })).toHaveAttribute("href", "/contact?intent=drawings");
  });

  it("keeps the approved seven-stage engineering workflow", () => {
    render(<DeliveryFlow />);
    expect(screen.getByText("Client Requirements")).toBeInTheDocument();
    expect(screen.getByText("CAD Design")).toBeInTheDocument();
    expect(screen.getByText("Factory Integration")).toBeInTheDocument();
    expect(screen.getByText("Project Completion")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(7);
  });

  it("restores photographic media and the Career Center feature on the home page", async () => {
    render(await HomePage());
    expect(screen.getByRole("link", { name: "Explore Career Center" })).toHaveAttribute("href", "/careers");
    expect(screen.getByRole("img", { name: "Modern collaborative infrastructure workspace" })).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(4);
  });
});
