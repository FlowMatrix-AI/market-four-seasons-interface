import type { MarketEvent } from "@/data/events";

interface EventCardProps {
  event: MarketEvent;
}

const seasonGradients: Record<string, string> = {
  spring: "from-green-50 to-emerald-50",
  summer: "from-amber-50 to-yellow-50",
  autumn: "from-orange-50 to-red-50",
  winter: "from-blue-50 to-indigo-50",
};

const typeLabels: Record<string, string> = {
  tasting: "Tasting",
  workshop: "Workshop",
  market: "Market",
  dinner: "Dinner",
  class: "Class",
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <div
      className={`rounded-lg border border-border overflow-hidden bg-gradient-to-br ${
        seasonGradients[event.season]
      } hover:shadow-lg transition-shadow`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-dark bg-accent/20 px-2 py-1 rounded">
            {typeLabels[event.type]}
          </span>
          <span className="text-xs text-text-light capitalize">
            {event.season}
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-text-light mb-4">
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            {event.date}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {event.time}
          </span>
        </div>
        <p className="text-sm text-text-light leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  );
}
