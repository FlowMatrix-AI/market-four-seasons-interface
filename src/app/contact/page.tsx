import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Market Four Seasons. Find our location, store hours, and contact information.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-muted border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Contact Us"
            subtitle="We would love to hear from you"
          />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-primary mb-3">
                  Visit Us
                </h3>
                <p className="text-text-light leading-relaxed">
                  142 Orchard Lane
                  <br />
                  Meadowbrook, NY 11554
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-3">
                  Store Hours
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>7:00 AM - 9:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-3">
                  Get in Touch
                </h3>
                <ul className="space-y-2 text-text-light">
                  <li>
                    <a
                      href="tel:+15551234567"
                      className="hover:text-primary transition-colors"
                    >
                      (555) 123-4567
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@marketfourseasons.com"
                      className="hover:text-primary transition-colors"
                    >
                      hello@marketfourseasons.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Map Placeholder */}
              <div className="bg-muted rounded-lg border border-border h-48 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="h-8 w-8 text-text-light mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  <p className="text-sm text-text-light">
                    142 Orchard Lane, Meadowbrook
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-primary mb-4">
                Send Us a Message
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
