export interface CateringPackage {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  serves: string;
  includes: string[];
}

export const cateringPackages: CateringPackage[] = [
  {
    id: "1",
    name: "The Gathering",
    description:
      "Perfect for intimate get-togethers and small celebrations. A curated selection of our finest artisan goods.",
    priceRange: "$250 - $450",
    serves: "10-20 guests",
    includes: [
      "Artisan cheese & charcuterie board",
      "Seasonal crudite platter",
      "Fresh-baked bread selection",
      "Signature spreads & accompaniments",
      "Seasonal fruit display",
    ],
  },
  {
    id: "2",
    name: "The Celebration",
    description:
      "Our most popular package for parties, corporate events, and family celebrations. A full spread of Market Four Seasons favorites.",
    priceRange: "$500 - $1,200",
    serves: "25-50 guests",
    includes: [
      "Everything in The Gathering",
      "Two seasonal prepared entrees",
      "Garden salad with house vinaigrette",
      "Artisan bread service",
      "Dessert platter",
      "Non-alcoholic beverage service",
    ],
  },
  {
    id: "3",
    name: "The Grand Affair",
    description:
      "A premium, full-service catering experience with dedicated staff. Ideal for weddings, galas, and milestone events.",
    priceRange: "$2,000+",
    serves: "50-200 guests",
    includes: [
      "Custom menu consultation",
      "Full appetizer course",
      "Choice of three entrees",
      "Seasonal sides & salads",
      "Artisan bread service",
      "Custom dessert table",
      "Full beverage service",
      "Dedicated service staff",
      "Tableware & linens available",
    ],
  },
];
