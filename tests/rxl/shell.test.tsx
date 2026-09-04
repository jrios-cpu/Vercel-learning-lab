import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { RxlHeader } from "@/components/rxl/layout/RxlHeader";

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

vi.mock("next/link", () => ({
  default: ({ href, children, onClick, ...props }: MockLinkProps) =>
    createElement("a", { ...props, href, onClick: (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); onClick?.(event); } }, children),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("RXL header", () => {
  it("matches the approved primary navigation and exposes both project paths", () => {
    render(<RxlHeader preview />);
    expect(screen.getByRole("link", { name: /RXL home/i })).toBeInTheDocument();
    const primaryNav = screen.getByRole("navigation", { name: "Primary navigation" });
    const labels = within(primaryNav).getAllByRole("link").map((link) => link.textContent);
    expect(labels).toEqual(["Capabilities", "Solutions", "Workflow", "Case Studies", "Careers", "Contact"]);
    expect(within(primaryNav).getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/careers");
    expect(screen.getAllByRole("link", { name: /Start Project/i })[0]).toHaveAttribute("href", "/configurator");
    expect(screen.getAllByRole("link", { name: /Request a Quote/i })[0]).toHaveAttribute("href", "/rfq");
  });

  it("keeps Solutions expansion separate from the navigation label", () => {
    render(<RxlHeader preview />);
    const trigger = screen.getByRole("button", { name: "Open Solutions menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(screen.getByRole("button", { name: "Close Solutions menu" })).toHaveAttribute("aria-expanded", "true");
  });

  it("does not expose unverified phone data", () => {
    render(<RxlHeader preview />);
    expect(screen.queryByRole("link", { name: /^Call$/i })).not.toBeInTheDocument();
  });

  it("closes mobile navigation when a destination is chosen", () => {
    render(<RxlHeader preview />);
    const menu = screen.getByRole("button", { name: "Menu" });
    fireEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    fireEvent.click(within(mobileNav).getByRole("link", { name: "Capabilities" }));
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
});
