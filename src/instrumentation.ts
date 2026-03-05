import path from "path";
import fs from "fs";

export function register() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_RUNTIME === "nodejs") {
    const enginePath = path.join(
      process.cwd(),
      "src",
      "generated",
      "prisma",
      "libquery_engine-rhel-openssl-3.0.x.so.node"
    );
    if (fs.existsSync(enginePath)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
      console.log("[instrumentation] Set PRISMA_QUERY_ENGINE_LIBRARY to", enginePath);
    } else {
      console.warn("[instrumentation] Engine not found at", enginePath);
    }
  }
}
