import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Join us for seasonal celebrations, wine and cheese tastings, cooking workshops, and farm-to-table dining experiences.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
