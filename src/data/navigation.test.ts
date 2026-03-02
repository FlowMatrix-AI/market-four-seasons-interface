import { describe, it, expect } from "vitest";
import { navigationLinks } from "./navigation";

describe("navigation data", () => {
  it("should have navigation links", () => {
    expect(navigationLinks.length).toBeGreaterThan(0);
  });

  it("should have Home as the first link", () => {
    expect(navigationLinks[0].label).toBe("Home");
    expect(navigationLinks[0].href).toBe("/");
  });

  it("should have all required fields", () => {
    for (const link of navigationLinks) {
      expect(link.label).toBeTruthy();
      expect(link.href).toBeTruthy();
      expect(link.href.startsWith("/")).toBe(true);
    }
  });

  it("should have unique hrefs", () => {
    const hrefs = navigationLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("should include all main pages", () => {
    const hrefs = navigationLinks.map((l) => l.href);
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/menu");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/events");
    expect(hrefs).toContain("/catering");
  });
});
