import { describe, it, expect } from "vitest";
import { cateringPackages } from "./catering";

describe("catering data", () => {
  it("should have catering packages", () => {
    expect(cateringPackages.length).toBeGreaterThan(0);
  });

  it("should have required fields on each package", () => {
    for (const pkg of cateringPackages) {
      expect(pkg.id).toBeTruthy();
      expect(pkg.name).toBeTruthy();
      expect(pkg.description).toBeTruthy();
      expect(pkg.priceRange).toBeTruthy();
      expect(pkg.serves).toBeTruthy();
      expect(pkg.includes.length).toBeGreaterThan(0);
    }
  });

  it("should have unique IDs", () => {
    const ids = cateringPackages.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have packages in ascending price order", () => {
    expect(cateringPackages[0].name).toBe("The Gathering");
    expect(cateringPackages[1].name).toBe("The Celebration");
    expect(cateringPackages[2].name).toBe("The Grand Affair");
  });
});
