import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { cateringPackages } from "@/data/catering";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Let Market Four Seasons cater your next event with fresh, seasonal menus crafted for gatherings of every size.",
};

export default function CateringPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-muted border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Catering Services"
            subtitle="Seasonal menus and artisan ingredients, crafted for your celebration"
          />
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {cateringPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`rounded-lg border overflow-hidden ${
                  index === 1
                    ? "border-accent shadow-lg ring-2 ring-accent/20"
                    : "border-border"
                }`}
              >
                {index === 1 && (
                  <div className="bg-accent text-primary-dark text-center py-1.5 text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="bg-white p-6">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-2xl font-bold text-accent-dark mb-1">
                    {pkg.priceRange}
                  </p>
                  <p className="text-sm text-text-light mb-4">
                    Serves {pkg.serves}
                  </p>
                  <p className="text-sm text-text-light leading-relaxed mb-6">
                    {pkg.description}
                  </p>
                  <ul className="space-y-2">
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <svg
                          className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Note */}
      <section className="py-8 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-light">
            All packages are customizable. We work with you to create a menu
            that fits your event, dietary needs, and budget.
          </p>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title="Request a Quote"
              subtitle="Tell us about your event and we will create a custom proposal"
            />
            <ContactForm subject="catering" />
          </div>
        </div>
      </section>
    </>
  );
}
