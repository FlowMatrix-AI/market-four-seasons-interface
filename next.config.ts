import type { NextConfig } from "next";

const tracedFiles = [
  "./prisma/bloom.db",
  "./src/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node",
  "./src/generated/prisma/**",
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**": tracedFiles,
    "/": tracedFiles,
    "/customers/**": tracedFiles,
    "/orders/**": tracedFiles,
    "/settings/**": tracedFiles,
    "/print/**": tracedFiles,
    "/notifications/**": tracedFiles,
    "/login": tracedFiles,
  },
};

export default nextConfig;
