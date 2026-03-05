import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**": ["./prisma/bloom.db"],
    "/": ["./prisma/bloom.db"],
    "/customers/**": ["./prisma/bloom.db"],
    "/orders/**": ["./prisma/bloom.db"],
    "/settings/**": ["./prisma/bloom.db"],
    "/print/**": ["./prisma/bloom.db"],
    "/notifications/**": ["./prisma/bloom.db"],
    "/login": ["./prisma/bloom.db"],
  },
};

export default nextConfig;
