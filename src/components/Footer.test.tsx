import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("should render the logo", () => {
    render(<Footer />);
    expect(screen.getByText("Market")).toBeInTheDocument();
  });

  it("should render store hours", () => {
    render(<Footer />);
    expect(screen.getByText("Mon - Fri")).toBeInTheDocument();
    expect(screen.getByText("8:00 AM - 8:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
  });

  it("should render contact info", () => {
    render(<Footer />);
    expect(screen.getByText("142 Orchard Lane")).toBeInTheDocument();
    expect(screen.getByText("Meadowbrook, NY 11554")).toBeInTheDocument();
    expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("should render quick links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catering" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Events" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("should render social media links", () => {
    render(<Footer />);
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
    expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
  });

  it("should render copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(
        `\u00A9 ${year} Market Four Seasons. All rights reserved.`
      )
    ).toBeInTheDocument();
  });
});
