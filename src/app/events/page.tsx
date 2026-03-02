"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import EventCard from "@/components/EventCard";
import { events, eventTypes, type MarketEvent } from "@/data/events";

const seasonFilters: { value: MarketEvent["season"] | "all"; label: string }[] =
  [
    { value: "all", label: "All Seasons" },
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" },
    { value: "winter", label: "Winter" },
  ];

export default function EventsPage() {
  const [selectedSeason, setSelectedSeason] = useState<
    MarketEvent["season"] | "all"
  >("all");
  const [selectedType, setSelectedType] = useState<
    MarketEvent["type"] | "all"
  >("all");

  const filtered = events.filter((e) => {
    const matchesSeason =
      selectedSeason === "all" || e.season === selectedSeason;
    const matchesType = selectedType === "all" || e.type === selectedType;
    return matchesSeason && matchesType;
  });

  return (
    <>
      <section className="bg-muted border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Events & Workshops"
            subtitle="Join us for seasonal celebrations, tastings, and hands-on culinary experiences"
          />
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label
                htmlFor="event-season-filter"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Season
              </label>
              <select
                id="event-season-filter"
                value={selectedSeason}
                onChange={(e) =>
                  setSelectedSeason(
                    e.target.value as MarketEvent["season"] | "all"
                  )
                }
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {seasonFilters.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="event-type-filter"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Type
              </label>
              <select
                id="event-type-filter"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(
                    e.target.value as MarketEvent["type"] | "all"
                  )
                }
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {eventTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-text-light mb-6">
            Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-light text-lg">
                No events match your current filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSeason("all");
                  setSelectedType("all");
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-3">
            Want to host a private event?
          </h2>
          <p className="text-text-light mb-6 max-w-lg mx-auto">
            We offer private event space for cooking classes, corporate
            team-building, and celebrations. Contact us for availability.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-light transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
