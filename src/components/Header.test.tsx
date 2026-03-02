import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Header", () => {
  it("should render the logo text", () => {
    render(<Header />);
    expect(screen.getByText("Market")).toBeInTheDocument();
    expect(screen.getByText("Four Seasons")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Header />);
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Menu").length).toBeGreaterThan(0);
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
  });

  it("should render the mobile menu toggle button", () => {
    render(<Header />);
    expect(
      screen.getByRole("button", { name: "Toggle navigation menu" })
    ).toBeInTheDocument();
  });

  it("should toggle mobile menu on button click", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggleBtn = screen.getByRole("button", {
      name: "Toggle navigation menu",
    });

    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleBtn);

    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
  });
});
