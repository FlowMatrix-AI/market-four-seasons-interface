import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import { getFeaturedProducts } from "@/data/products";
import { testimonials } from "@/data/testimonials";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-accent font-medium tracking-wide uppercase text-sm mb-4">
              Fresh. Seasonal. Artisan.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              The Finest
              <br />
              <span className="text-accent">Seasonal</span> Ingredients
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-lg">
              Discover hand-selected produce, artisan cheeses, fresh-baked
              breads, and prepared foods crafted with care at your neighborhood
              gourmet market.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center px-6 py-3 bg-accent text-primary-dark font-semibold rounded-md hover:bg-accent-light transition-colors"
              >
                Browse Our Menu
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Highlight Strip */}
      <section className="bg-accent/10 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm font-medium text-foreground">
            <span className="flex items-center gap-2">
              <span className="text-lg">🌱</span> Spring Peas & Asparagus
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">☀️</span> Summer Berries & Stone Fruit
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">🍂</span> Autumn Squash & Wild Mushrooms
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">❄️</span> Winter Citrus & Root Vegetables
            </span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Seasonal Favorites"
            subtitle="Hand-picked selections that showcase the best of what each season has to offer"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center px-6 py-2.5 border-2 border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              View Full Menu
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent-dark font-medium tracking-wide uppercase text-sm mb-3">
                Since 2010
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                A Market Built on
                <br />
                Quality & Community
              </h2>
              <p className="text-text-light leading-relaxed mb-4">
                Market Four Seasons was born from a simple idea: that everyone
                deserves access to extraordinary food. We partner directly with
                local farms and artisan producers to bring you ingredients at
                their peak, every season of the year.
              </p>
              <p className="text-text-light leading-relaxed mb-6">
                From our stone hearth bakery to our carefully curated cheese
                cave, every corner of our market is designed to inspire your next
                great meal.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-primary font-medium hover:text-primary-light transition-colors"
              >
                Learn more about us
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="bg-white rounded-lg border border-border p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">15+</p>
                  <p className="text-sm text-text-light mt-1">Years Serving</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">40+</p>
                  <p className="text-sm text-text-light mt-1">Local Partners</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">200+</p>
                  <p className="text-sm text-text-light mt-1">Artisan Items</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">5,000+</p>
                  <p className="text-sm text-text-light mt-1">Happy Families</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="We are proud to be a part of our community's table"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Visit Us Today
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            Stop by Market Four Seasons and experience the difference that
            fresh, seasonal ingredients make. We look forward to welcoming you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-accent text-primary-dark font-semibold rounded-md hover:bg-accent-light transition-colors"
            >
              Get Directions
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
            >
              Upcoming Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
