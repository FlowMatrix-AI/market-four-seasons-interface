import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EventCard from "./EventCard";
import type { MarketEvent } from "@/data/events";

const mockEvent: MarketEvent = {
  id: "test-1",
  title: "Test Event",
  date: "April 1, 2026",
  time: "2:00 PM - 4:00 PM",
  description: "A wonderful test event.",
  season: "spring",
  type: "workshop",
  image: "/images/test-event.jpg",
};

describe("EventCard", () => {
  it("should render the event title", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });

  it("should render the event date", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("April 1, 2026")).toBeInTheDocument();
  });

  it("should render the event time", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("2:00 PM - 4:00 PM")).toBeInTheDocument();
  });

  it("should render the event description", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("A wonderful test event.")).toBeInTheDocument();
  });

  it("should render the event type badge", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("Workshop")).toBeInTheDocument();
  });

  it("should render the season label", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("spring")).toBeInTheDocument();
  });
});
