import { describe, it, expect } from "vitest";
import { testimonials } from "./testimonials";

describe("testimonials data", () => {
  it("should have testimonials", () => {
    expect(testimonials.length).toBeGreaterThan(0);
  });

  it("should have required fields", () => {
    for (const t of testimonials) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.quote).toBeTruthy();
      expect(t.role).toBeTruthy();
    }
  });

  it("should have unique IDs", () => {
    const ids = testimonials.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
