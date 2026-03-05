import { describe, it, expect } from "vitest";
import { parseTimeWindow, sortByTimeWindow } from "./sortOrders";

describe("parseTimeWindow", () => {
  it("returns 2400 for null/undefined", () => {
    expect(parseTimeWindow(null)).toBe(2400);
    expect(parseTimeWindow(undefined)).toBe(2400);
    expect(parseTimeWindow("")).toBe(2400);
  });

  it("returns 800 for AM delivery", () => {
    expect(parseTimeWindow("AM")).toBe(800);
    expect(parseTimeWindow("am")).toBe(800);
    expect(parseTimeWindow("am delivery")).toBe(800);
    expect(parseTimeWindow("AM DELIVERY")).toBe(800);
  });

  it("parses time ranges correctly", () => {
    expect(parseTimeWindow("10am-1pm")).toBe(1000);
    expect(parseTimeWindow("10:30am-1pm")).toBe(1030);
    expect(parseTimeWindow("1pm-5pm")).toBe(1300);
    expect(parseTimeWindow("3pm-6pm")).toBe(1500);
  });

  it("parses 12pm correctly", () => {
    expect(parseTimeWindow("12pm-3pm")).toBe(1200);
  });

  it("parses 12am correctly", () => {
    expect(parseTimeWindow("12am-3am")).toBe(0);
  });

  it("parses plain hour formats", () => {
    expect(parseTimeWindow("9am")).toBe(900);
    expect(parseTimeWindow("5pm")).toBe(1700);
  });

  it("returns 2400 for unparseable strings", () => {
    expect(parseTimeWindow("whenever")).toBe(2400);
  });
});

describe("sortByTimeWindow", () => {
  it("sorts items by parsed time window", () => {
    const items = [
      { deliveryTimeWindow: "1pm-5pm", name: "C" },
      { deliveryTimeWindow: "AM", name: "A" },
      { deliveryTimeWindow: "10am-1pm", name: "B" },
      { deliveryTimeWindow: null, name: "D" },
    ];

    const sorted = sortByTimeWindow(items);
    expect(sorted.map((i) => i.name)).toEqual(["A", "B", "C", "D"]);
  });

  it("returns empty array for empty input", () => {
    expect(sortByTimeWindow([])).toEqual([]);
  });

  it("does not mutate original array", () => {
    const items = [
      { deliveryTimeWindow: "1pm-5pm" },
      { deliveryTimeWindow: "AM" },
    ];
    const original = [...items];
    sortByTimeWindow(items);
    expect(items).toEqual(original);
  });
});
