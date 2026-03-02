export type Season = "spring" | "summer" | "autumn" | "winter" | "all";

export type ProductCategory =
  | "produce"
  | "bakery"
  | "deli"
  | "cheese"
  | "beverages"
  | "pantry"
  | "prepared";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  season: Season;
  featured: boolean;
  image: string;
}

export const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "produce", label: "Fresh Produce" },
  { value: "bakery", label: "Bakery" },
  { value: "deli", label: "Deli" },
  { value: "cheese", label: "Cheese" },
  { value: "beverages", label: "Beverages" },
  { value: "pantry", label: "Pantry" },
  { value: "prepared", label: "Prepared Foods" },
];

export const seasons: { value: Season; label: string }[] = [
  { value: "all", label: "All Seasons" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Heirloom Tomato Medley",
    description:
      "A vibrant selection of locally-grown heirloom tomatoes in stunning colors and complex flavors.",
    price: "$8.99/lb",
    category: "produce",
    season: "summer",
    featured: true,
    image: "/images/products/tomatoes.jpg",
  },
  {
    id: "2",
    name: "Artisan Sourdough Loaf",
    description:
      "Naturally leavened bread with a crisp crust and open crumb, baked fresh daily in our stone hearth oven.",
    price: "$7.50",
    category: "bakery",
    season: "all",
    featured: true,
    image: "/images/products/sourdough.jpg",
  },
  {
    id: "3",
    name: "Aged Gruyere",
    description:
      "Cave-aged Swiss Gruyere with nutty, complex flavors. Perfect for fondue or a cheese board.",
    price: "$24.99/lb",
    category: "cheese",
    season: "all",
    featured: true,
    image: "/images/products/gruyere.jpg",
  },
  {
    id: "4",
    name: "Wild Mushroom Risotto",
    description:
      "Creamy Arborio rice with foraged wild mushrooms, Parmesan, and fresh herbs. Heat and serve.",
    price: "$14.99",
    category: "prepared",
    season: "autumn",
    featured: true,
    image: "/images/products/risotto.jpg",
  },
  {
    id: "5",
    name: "Spring Pea & Mint Soup",
    description:
      "Bright, fresh soup made with English peas, garden mint, and a touch of cream.",
    price: "$9.99",
    category: "prepared",
    season: "spring",
    featured: true,
    image: "/images/products/pea-soup.jpg",
  },
  {
    id: "6",
    name: "Imported Italian Prosciutto",
    description:
      "Thinly sliced Prosciutto di Parma, aged 24 months for delicate sweetness and melt-in-your-mouth texture.",
    price: "$32.99/lb",
    category: "deli",
    season: "all",
    featured: false,
    image: "/images/products/prosciutto.jpg",
  },
  {
    id: "7",
    name: "Cold-Pressed Orange Juice",
    description:
      "Fresh-squeezed Valencia oranges with no added sugar. Made in-house every morning.",
    price: "$6.99",
    category: "beverages",
    season: "winter",
    featured: false,
    image: "/images/products/orange-juice.jpg",
  },
  {
    id: "8",
    name: "Truffle Honey",
    description:
      "Wildflower honey infused with black truffle shavings. An elegant accompaniment to cheese and charcuterie.",
    price: "$18.99",
    category: "pantry",
    season: "all",
    featured: true,
    image: "/images/products/truffle-honey.jpg",
  },
  {
    id: "9",
    name: "Summer Berry Tart",
    description:
      "Flaky butter pastry filled with vanilla custard and topped with fresh strawberries, raspberries, and blueberries.",
    price: "$12.99",
    category: "bakery",
    season: "summer",
    featured: false,
    image: "/images/products/berry-tart.jpg",
  },
  {
    id: "10",
    name: "Organic Baby Spinach",
    description:
      "Tender baby spinach leaves from local organic farms. Triple-washed and ready to eat.",
    price: "$5.99",
    category: "produce",
    season: "spring",
    featured: false,
    image: "/images/products/spinach.jpg",
  },
  {
    id: "11",
    name: "Smoked Salmon Platter",
    description:
      "Hand-sliced Scottish smoked salmon with capers, red onion, and cream cheese. Serves 4-6.",
    price: "$28.99",
    category: "deli",
    season: "all",
    featured: false,
    image: "/images/products/smoked-salmon.jpg",
  },
  {
    id: "12",
    name: "Butternut Squash Bisque",
    description:
      "Velvety roasted butternut squash soup with sage, brown butter, and a hint of nutmeg.",
    price: "$10.99",
    category: "prepared",
    season: "autumn",
    featured: false,
    image: "/images/products/squash-bisque.jpg",
  },
  {
    id: "13",
    name: "French Brie",
    description:
      "Creamy, soft-ripened Brie with an edible rind and rich, buttery interior.",
    price: "$19.99/lb",
    category: "cheese",
    season: "all",
    featured: false,
    image: "/images/products/brie.jpg",
  },
  {
    id: "14",
    name: "Sparkling Lavender Lemonade",
    description:
      "Refreshing house-made lemonade with Provencal lavender and sparkling water.",
    price: "$5.49",
    category: "beverages",
    season: "summer",
    featured: false,
    image: "/images/products/lavender-lemonade.jpg",
  },
  {
    id: "15",
    name: "Extra Virgin Olive Oil",
    description:
      "Single-estate Tuscan olive oil with peppery finish and grassy notes. Cold-pressed, unfiltered.",
    price: "$22.99",
    category: "pantry",
    season: "all",
    featured: false,
    image: "/images/products/olive-oil.jpg",
  },
  {
    id: "16",
    name: "Pumpkin Spice Scones",
    description:
      "Tender scones with real pumpkin, warm spices, and a maple glaze. A seasonal favorite.",
    price: "$3.99",
    category: "bakery",
    season: "autumn",
    featured: false,
    image: "/images/products/pumpkin-scone.jpg",
  },
  {
    id: "17",
    name: "Hot Mulled Cider",
    description:
      "Warm pressed apple cider with cinnamon, cloves, and orange peel. Available by the cup or quart.",
    price: "$4.99",
    category: "beverages",
    season: "winter",
    featured: false,
    image: "/images/products/mulled-cider.jpg",
  },
  {
    id: "18",
    name: "Winter Citrus Salad Kit",
    description:
      "Blood oranges, grapefruit, and cara cara oranges with fennel, arugula, and citrus vinaigrette.",
    price: "$13.99",
    category: "prepared",
    season: "winter",
    featured: false,
    image: "/images/products/citrus-salad.jpg",
  },
];

export function getProductsByCategory(
  category: ProductCategory | "all"
): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function getProductsBySeason(season: Season): Product[] {
  if (season === "all") return products;
  return products.filter((p) => p.season === season || p.season === "all");
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function filterProducts(
  category: ProductCategory | "all",
  season: Season
): Product[] {
  return products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesSeason =
      season === "all" || p.season === season || p.season === "all";
    return matchesCategory && matchesSeason;
  });
}
