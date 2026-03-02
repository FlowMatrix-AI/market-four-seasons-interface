import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const categoryColors: Record<string, string> = {
  produce: "bg-green-100 text-green-800",
  bakery: "bg-amber-100 text-amber-800",
  deli: "bg-rose-100 text-rose-800",
  cheese: "bg-yellow-100 text-yellow-800",
  beverages: "bg-blue-100 text-blue-800",
  pantry: "bg-orange-100 text-orange-800",
  prepared: "bg-purple-100 text-purple-800",
};

const seasonIcons: Record<string, string> = {
  spring: "🌱",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
  all: "🌍",
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:scale-110 transition-transform duration-300">
          {seasonIcons[product.season]}
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              categoryColors[product.category] || "bg-gray-100 text-gray-800"
            }`}
          >
            {product.category}
          </span>
          {product.season !== "all" && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/90 text-foreground">
              {seasonIcons[product.season]} {product.season}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <span className="text-sm font-bold text-accent-dark whitespace-nowrap">
            {product.price}
          </span>
        </div>
        <p className="mt-2 text-sm text-text-light leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </div>
    </div>
  );
}
