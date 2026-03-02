import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Market Four Seasons, our story, our values, and the team behind your favorite gourmet market.",
};

const values = [
  {
    title: "Seasonal First",
    description:
      "We believe food tastes best when it is in season. Our offerings change with the calendar, ensuring peak flavor and freshness in every bite.",
    icon: "🌿",
  },
  {
    title: "Locally Sourced",
    description:
      "Over 60% of our produce comes from farms within 100 miles. We build direct relationships with growers who share our commitment to quality.",
    icon: "🏡",
  },
  {
    title: "Artisan Crafted",
    description:
      "From our in-house bakery to our carefully aged cheeses, we honor traditional craft techniques that create extraordinary flavors.",
    icon: "🍞",
  },
  {
    title: "Community Rooted",
    description:
      "We are more than a market. We host workshops, tastings, and seasonal celebrations that bring our community together around great food.",
    icon: "🤝",
  },
];

const team = [
  {
    name: "Margaret Chen",
    role: "Founder & Owner",
    bio: "A classically trained chef who left restaurant kitchens to create the market she always wished existed in her neighborhood.",
  },
  {
    name: "Thomas Bell",
    role: "Head Baker",
    bio: "With 20 years of experience in artisan baking, Thomas oversees our stone hearth bakery where every loaf is crafted by hand.",
  },
  {
    name: "Sofia Russo",
    role: "Cheese & Charcuterie Director",
    bio: "Trained in France and Italy, Sofia curates our cheese cave and builds relationships with small-batch producers worldwide.",
  },
  {
    name: "David Okafor",
    role: "Produce Manager",
    bio: "David works directly with over 30 local farms to source the finest seasonal produce that arrives fresh daily.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-muted border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Story"
            subtitle="A passion for exceptional food, rooted in community"
          />
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-text-light leading-relaxed mb-6">
              Market Four Seasons opened its doors in 2010, born from founder
              Margaret Chen&apos;s vision of a neighborhood market that
              celebrates the rhythm of the seasons. After years as a chef in
              fine dining, Margaret saw an opportunity to bring restaurant-quality
              ingredients directly to home cooks.
            </p>
            <p className="text-lg text-text-light leading-relaxed mb-6">
              What started as a small produce stand at the local farmers market
              grew into the full-service gourmet market you see today. We have
              expanded to include an in-house bakery, a curated cheese cave, a
              full-service deli, and a kitchen that prepares seasonal dishes
              daily.
            </p>
            <p className="text-lg text-text-light leading-relaxed">
              Our name reflects our philosophy: the best food follows the
              seasons. Every quarter, our menu transforms to showcase what is
              growing, ripening, and being harvested right now. When you shop at
              Market Four Seasons, you are not just buying groceries. You are
              connecting to the land, the seasons, and the people who grow your
              food.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide everything we do"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-lg border border-border p-6 text-center"
              >
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="text-lg font-bold text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-text-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Meet Our Team"
            subtitle="The passionate people behind your market experience"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-lg border border-border overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-accent-dark font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-text-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
