import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RxlHeader } from "@/components/rxl/layout/RxlHeader";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("RXL header", () => {
  it("renders RXL navigation and a configurator CTA", () => {
    render(<RxlHeader preview />);
    expect(screen.getByRole("link", { name: /RXL home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Solutions/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Start Project/i })[0]).toHaveAttribute("href", "/configurator");
  });

  it("does not expose unverified phone data", () => {
    render(<RxlHeader preview />);
    expect(screen.queryByRole("link", { name: /^Call$/i })).not.toBeInTheDocument();
  });
});
