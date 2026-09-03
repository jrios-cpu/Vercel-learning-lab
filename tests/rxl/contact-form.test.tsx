import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/components/rxl/forms/ContactForm";

describe("ContactForm", () => {
  it("renders associated required fields and accessible status", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/^Name$/i)).toBeRequired();
    expect(screen.getByLabelText(/Work email/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/How can we help/i)).toBeRequired();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
