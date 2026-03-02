import { describe, it, expect } from "vitest";
import { events, eventTypes, getEventsBySeason, getEventsByType } from "./events";

describe("events data", () => {
  it("should have events array with items", () => {
    expect(events.length).toBeGreaterThan(0);
  });

  it("should have required fields on each event", () => {
    for (const event of events) {
      expect(event.id).toBeTruthy();
      expect(event.title).toBeTruthy();
      expect(event.date).toBeTruthy();
      expect(event.time).toBeTruthy();
      expect(event.description).toBeTruthy();
      expect(event.season).toBeTruthy();
      expect(event.type).toBeTruthy();
    }
  });

  it("should have unique IDs", () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have valid event types", () => {
    const validTypes = eventTypes.map((t) => t.value).filter((v) => v !== "all");
    for (const event of events) {
      expect(validTypes).toContain(event.type);
    }
  });
});

describe("getEventsBySeason", () => {
  it("should return all events for 'all'", () => {
    expect(getEventsBySeason("all")).toEqual(events);
  });

  it("should filter by season", () => {
    const springEvents = getEventsBySeason("spring");
    expect(springEvents.length).toBeGreaterThan(0);
    for (const e of springEvents) {
      expect(e.season).toBe("spring");
    }
  });
});

describe("getEventsByType", () => {
  it("should return all events for 'all'", () => {
    expect(getEventsByType("all")).toEqual(events);
  });

  it("should filter by type", () => {
    const tastings = getEventsByType("tasting");
    expect(tastings.length).toBeGreaterThan(0);
    for (const e of tastings) {
      expect(e.type).toBe("tasting");
    }
  });
});
