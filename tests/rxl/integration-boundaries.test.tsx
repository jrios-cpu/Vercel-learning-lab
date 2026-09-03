import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomerPortalView } from "@/components/rxl/access/CustomerPortalView";
import { EmployeeHub } from "@/components/rxl/access/EmployeeHub";

describe("integration boundaries", () => {
  it("does not render an active Epicor handoff without a configured endpoint", () => {
    render(<CustomerPortalView portalUrl={null} />);
    expect(screen.getByRole("button", { name: /Continue to the Portal/i })).toBeDisabled();
  });

  it("labels employee access as Preview-only when Entra is not configured", () => {
    render(<EmployeeHub authState="preview-demo" />);
    expect(screen.getByText(/Preview demo/i)).toBeInTheDocument();
  });
});
