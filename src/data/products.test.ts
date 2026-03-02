import { describe, it, expect } from "vitest";
import {
  products,
  categories,
  seasons,
  getProductsByCategory,
  getProductsBySeason,
  getFeaturedProducts,
  filterProducts,
} from "./products";

describe("products data", () => {
  it("should have products array with items", () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it("should have required fields on each product", () => {
    for (const product of products) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.price).toBeTruthy();
      expect(product.category).toBeTruthy();
      expect(product.season).toBeTruthy();
    }
  });

  it("should have unique IDs", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have valid categories", () => {
    const validCategories = categories
      .map((c) => c.value)
      .filter((v) => v !== "all");
    for (const product of products) {
      expect(validCategories).toContain(product.category);
    }
  });

  it("should have valid seasons", () => {
    const validSeasons = seasons.map((s) => s.value);
    for (const product of products) {
      expect(validSeasons).toContain(product.season);
    }
  });
});

describe("getProductsByCategory", () => {
  it("should return all products for 'all'", () => {
    expect(getProductsByCategory("all")).toEqual(products);
  });

  it("should filter by category", () => {
    const bakeryProducts = getProductsByCategory("bakery");
    expect(bakeryProducts.length).toBeGreaterThan(0);
    for (const p of bakeryProducts) {
      expect(p.category).toBe("bakery");
    }
  });

  it("should return empty for category with no items", () => {
    const result = getProductsByCategory("produce");
    for (const p of result) {
      expect(p.category).toBe("produce");
    }
  });
});

describe("getProductsBySeason", () => {
  it("should return all products for 'all'", () => {
    expect(getProductsBySeason("all")).toEqual(products);
  });

  it("should include 'all' season products in any season filter", () => {
    const summerProducts = getProductsBySeason("summer");
    const allSeasonProducts = products.filter((p) => p.season === "all");
    for (const p of allSeasonProducts) {
      expect(summerProducts).toContainEqual(p);
    }
  });

  it("should filter by season", () => {
    const autumnProducts = getProductsBySeason("autumn");
    for (const p of autumnProducts) {
      expect(["autumn", "all"]).toContain(p.season);
    }
  });
});

describe("getFeaturedProducts", () => {
  it("should return only featured products", () => {
    const featured = getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    for (const p of featured) {
      expect(p.featured).toBe(true);
    }
  });
});

describe("filterProducts", () => {
  it("should return all products with all/all filters", () => {
    expect(filterProducts("all", "all")).toEqual(products);
  });

  it("should filter by both category and season", () => {
    const result = filterProducts("bakery", "summer");
    for (const p of result) {
      expect(p.category).toBe("bakery");
      expect(["summer", "all"]).toContain(p.season);
    }
  });

  it("should filter by category only when season is all", () => {
    const result = filterProducts("cheese", "all");
    for (const p of result) {
      expect(p.category).toBe("cheese");
    }
  });

  it("should filter by season only when category is all", () => {
    const result = filterProducts("all", "winter");
    for (const p of result) {
      expect(["winter", "all"]).toContain(p.season);
    }
  });
});
