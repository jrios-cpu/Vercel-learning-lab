import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { DeliveryFlow } from "@/components/rxl/home/DeliveryFlow";
import { HomeHero } from "@/components/rxl/home/HomeHero";
import { homeContent } from "@/lib/rxl/data/content";

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };
vi.mock("next/link", () => ({ default: ({ href, children, ...props }: MockLinkProps) => createElement("a", { ...props, href }, children) }));

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
});
