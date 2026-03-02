import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Market Four Seasons | Gourmet Market & Artisan Foods",
    template: "%s | Market Four Seasons",
  },
  description:
    "Your neighborhood gourmet market celebrating the finest seasonal ingredients, artisan foods, and locally sourced produce. Fresh daily, crafted with care.",
  keywords: [
    "gourmet market",
    "artisan food",
    "seasonal produce",
    "catering",
    "bakery",
    "cheese",
    "deli",
  ],
  openGraph: {
    title: "Market Four Seasons | Gourmet Market & Artisan Foods",
    description:
      "Your neighborhood gourmet market celebrating the finest seasonal ingredients and artisan foods.",
    type: "website",
    locale: "en_US",
    siteName: "Market Four Seasons",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
