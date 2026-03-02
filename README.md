# Market Four Seasons

A production-ready website for Market Four Seasons, a gourmet food market celebrating seasonal ingredients and artisan foods.

## Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.2
- **Testing**: Vitest 4.0 + React Testing Library
- **Linting**: ESLint 9 (flat config) with Next.js rules

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, featured products, testimonials, and CTA |
| `/menu` | Full product catalog with category and season filtering |
| `/about` | Market story, values, and team members |
| `/catering` | Catering packages with pricing and inquiry form |
| `/events` | Seasonal events and workshops with filters |
| `/contact` | Contact form, store hours, and location |

## Getting Started

### Prerequisites

- Node.js 18.18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Base URL for the application | No |

This project runs without any required environment variables. The `.env.example` file documents optional configuration.

## Project Structure

```
src/
  app/              # Next.js App Router pages
    about/          # About page
    catering/       # Catering page with inquiry form
    contact/        # Contact page with form
    events/         # Events page with filters
    menu/           # Menu page with product filters
  components/       # Shared UI components
    ContactForm     # Reusable contact/inquiry form
    EventCard       # Event display card
    Footer          # Site footer with links and hours
    Header          # Navigation header with mobile menu
    ProductCard     # Product display card
    SectionHeading  # Reusable section heading
    TestimonialCard # Customer testimonial card
  data/             # Static data layer
    catering.ts     # Catering packages
    events.ts       # Market events
    navigation.ts   # Navigation links
    products.ts     # Product catalog with filter utilities
    testimonials.ts # Customer testimonials
  test/             # Test setup and utilities
```

## Design Decisions

- **Static data layer**: Product catalog, events, and testimonials are served from TypeScript data files rather than a database. This keeps the site fast, simple to deploy, and easy to update. The data layer includes filter utility functions for category and season-based filtering.
- **No authentication**: This is a public-facing marketing site that does not require user accounts or protected routes.
- **No database**: All content is statically defined, making the site fully static-exportable and deployable to any hosting platform.
- **Contact form**: Currently uses client-side simulation. In production, integrate with an email service or form backend.
- **Warm earth-tone design**: Uses a custom color palette (forest green, gold, cream) to reflect the market's artisan and seasonal identity.

## Deployment

This is a standard Next.js application that can be deployed to:

- **Vercel**: Push to GitHub and import the repository
- **Docker**: Use the included Next.js production server
- **Static export**: Add `output: 'export'` to `next.config.ts` for static hosting

All pages are statically generated at build time for optimal performance.
