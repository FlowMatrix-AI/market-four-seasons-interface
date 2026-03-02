import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeading from "./SectionHeading";

describe("SectionHeading", () => {
  it("should render the title", () => {
    render(<SectionHeading title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render the subtitle when provided", () => {
    render(<SectionHeading title="Title" subtitle="Subtitle text" />);
    expect(screen.getByText("Subtitle text")).toBeInTheDocument();
  });

  it("should not render subtitle when not provided", () => {
    const { container } = render(<SectionHeading title="Title" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(0);
  });

  it("should center by default", () => {
    const { container } = render(<SectionHeading title="Title" />);
    expect(container.firstChild).toHaveClass("text-center");
  });

  it("should not center when centered is false", () => {
    const { container } = render(
      <SectionHeading title="Title" centered={false} />
    );
    expect(container.firstChild).not.toHaveClass("text-center");
  });
});
