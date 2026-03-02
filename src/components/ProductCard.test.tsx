import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

const mockProduct: Product = {
  id: "test-1",
  name: "Test Product",
  description: "A delicious test product for testing purposes.",
  price: "$9.99",
  category: "bakery",
  season: "summer",
  featured: true,
  image: "/images/test.jpg",
};

describe("ProductCard", () => {
  it("should render the product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("should render the product price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("should render the product description", () => {
    render(<ProductCard product={mockProduct} />);
    expect(
      screen.getByText("A delicious test product for testing purposes.")
    ).toBeInTheDocument();
  });

  it("should render the category badge", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("bakery")).toBeInTheDocument();
  });

  it("should render the season badge for seasonal products", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/summer/)).toBeInTheDocument();
  });

  it("should not render season badge for all-season products", () => {
    const allSeasonProduct = { ...mockProduct, season: "all" as const };
    render(<ProductCard product={allSeasonProduct} />);
    const badges = screen.queryAllByText(/spring|summer|autumn|winter/);
    expect(badges.length).toBe(0);
  });
});
