export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  season: "spring" | "summer" | "autumn" | "winter";
  type: "tasting" | "workshop" | "market" | "dinner" | "class";
  image: string;
}

export const events: MarketEvent[] = [
  {
    id: "1",
    title: "Spring Harvest Festival",
    date: "March 22, 2026",
    time: "10:00 AM - 4:00 PM",
    description:
      "Celebrate the arrival of spring with our annual harvest festival. Meet local farmers, sample seasonal produce, and enjoy live cooking demonstrations featuring the freshest spring ingredients.",
    season: "spring",
    type: "market",
    image: "/images/events/spring-festival.jpg",
  },
  {
    id: "2",
    title: "Artisan Bread Baking Workshop",
    date: "April 5, 2026",
    time: "9:00 AM - 12:00 PM",
    description:
      "Learn the art of sourdough bread making from our head baker. Take home your own starter and a freshly baked loaf. All skill levels welcome.",
    season: "spring",
    type: "workshop",
    image: "/images/events/bread-workshop.jpg",
  },
  {
    id: "3",
    title: "Summer Wine & Cheese Pairing",
    date: "June 14, 2026",
    time: "6:00 PM - 8:30 PM",
    description:
      "An evening of curated wine and artisan cheese pairings. Our sommelier guides you through selections from local vineyards paired with imported and domestic cheeses.",
    season: "summer",
    type: "tasting",
    image: "/images/events/wine-cheese.jpg",
  },
  {
    id: "4",
    title: "Farm-to-Table Summer Dinner",
    date: "July 19, 2026",
    time: "6:30 PM - 9:30 PM",
    description:
      "An unforgettable outdoor dining experience featuring a five-course menu crafted entirely from ingredients sourced within 50 miles. Limited to 40 guests.",
    season: "summer",
    type: "dinner",
    image: "/images/events/farm-dinner.jpg",
  },
  {
    id: "5",
    title: "Autumn Preserving Class",
    date: "September 20, 2026",
    time: "10:00 AM - 1:00 PM",
    description:
      "Master the art of canning and preserving seasonal fruits and vegetables. Learn techniques for jams, pickles, and fermented foods to enjoy all winter long.",
    season: "autumn",
    type: "class",
    image: "/images/events/preserving.jpg",
  },
  {
    id: "6",
    title: "Harvest Moon Market",
    date: "October 10, 2026",
    time: "4:00 PM - 9:00 PM",
    description:
      "Our largest market event of the year under the harvest moon. Local vendors, food trucks, live music, and seasonal tastings create a magical autumn evening.",
    season: "autumn",
    type: "market",
    image: "/images/events/harvest-moon.jpg",
  },
  {
    id: "7",
    title: "Holiday Cookie Decorating",
    date: "December 6, 2026",
    time: "2:00 PM - 4:00 PM",
    description:
      "A family-friendly workshop where our pastry chef teaches holiday cookie decorating techniques. Each participant decorates a dozen cookies to take home.",
    season: "winter",
    type: "workshop",
    image: "/images/events/cookie-decorating.jpg",
  },
  {
    id: "8",
    title: "Winter Truffle Tasting",
    date: "January 17, 2026",
    time: "5:00 PM - 7:00 PM",
    description:
      "Experience the luxury of winter truffles with guided tastings of truffle-infused oils, honeys, and dishes prepared by our chef. A rare sensory experience.",
    season: "winter",
    type: "tasting",
    image: "/images/events/truffle-tasting.jpg",
  },
];

export const eventTypes: { value: MarketEvent["type"] | "all"; label: string }[] = [
  { value: "all", label: "All Events" },
  { value: "tasting", label: "Tastings" },
  { value: "workshop", label: "Workshops" },
  { value: "market", label: "Markets" },
  { value: "dinner", label: "Dinners" },
  { value: "class", label: "Classes" },
];

export function getEventsBySeason(
  season: "spring" | "summer" | "autumn" | "winter" | "all"
): MarketEvent[] {
  if (season === "all") return events;
  return events.filter((e) => e.season === season);
}

export function getEventsByType(
  type: MarketEvent["type"] | "all"
): MarketEvent[] {
  if (type === "all") return events;
  return events.filter((e) => e.type === type);
}
