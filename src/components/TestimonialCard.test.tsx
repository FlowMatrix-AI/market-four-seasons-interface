import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TestimonialCard from "./TestimonialCard";
import type { Testimonial } from "@/data/testimonials";

const mockTestimonial: Testimonial = {
  id: "test-1",
  name: "John Doe",
  quote: "This is an excellent market with great products.",
  role: "Regular Customer",
};

describe("TestimonialCard", () => {
  it("should render the testimonial name", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should render the testimonial quote", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(
      screen.getByText("This is an excellent market with great products.")
    ).toBeInTheDocument();
  });

  it("should render the testimonial role", () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    expect(screen.getByText("Regular Customer")).toBeInTheDocument();
  });
});
