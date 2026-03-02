"use client";

import { useState } from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import {
  filterProducts,
  categories,
  seasons,
  type ProductCategory,
  type Season,
} from "@/data/products";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "all"
  >("all");
  const [selectedSeason, setSelectedSeason] = useState<Season>("all");

  const filtered = filterProducts(selectedCategory, selectedSeason);

  return (
    <>
      <section className="bg-muted border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Menu"
            subtitle="Explore our curated selection of seasonal produce, artisan goods, and prepared foods"
          />
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value as ProductCategory | "all"
                  )
                }
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="season-filter"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Season
              </label>
              <select
                id="season-filter"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value as Season)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {seasons.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-text-light mb-6">
            Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-light text-lg">
                No items match your current filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSeason("all");
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
