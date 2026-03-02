export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    quote:
      "Market Four Seasons has completely changed how my family eats. The seasonal produce is always incredibly fresh, and the staff recommendations never disappoint.",
    role: "Loyal Customer",
  },
  {
    id: "2",
    name: "Chef Daniel Park",
    quote:
      "As a professional chef, I rely on Market Four Seasons for the highest quality ingredients. Their artisan cheese selection is second to none in the region.",
    role: "Executive Chef, The Copper Table",
  },
  {
    id: "3",
    name: "Emily & James Rodriguez",
    quote:
      "We hosted our wedding reception with their catering service and it was perfection. Every dish was beautifully presented and bursting with flavor. Our guests are still talking about it.",
    role: "Catering Client",
  },
];
