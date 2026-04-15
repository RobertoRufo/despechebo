#!/usr/bin/env node
/**
 * Railway startup script:
 * 1. Run database migrations (drizzle-kit migrate)
 * 2. Seed initial data if empty
 * 3. Start the production server
 */
import { execSync, spawn } from "child_process";
import * as dotenv from "dotenv";
dotenv.config();

console.log("[startup] Running database migrations...");
try {
  execSync("node_modules/.bin/drizzle-kit migrate", {
    stdio: "inherit",
    env: { ...process.env },
  });
  console.log("[startup] Migrations complete.");
} catch (err) {
  console.error("[startup] Migration failed:", err.message);
  process.exit(1);
}

console.log("[startup] Seeding initial data...");
try {
  execSync("node server/seed.mjs", {
    stdio: "inherit",
    env: { ...process.env },
  });
  execSync("node server/seed-packing.mjs", {
    stdio: "inherit",
    env: { ...process.env },
  });
  console.log("[startup] Seeding complete.");
} catch (err) {
  console.error("[startup] Seeding failed (non-fatal):", err.message);
}

console.log("[startup] Starting production server...");
const server = spawn("node", ["dist/index.js"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

server.on("exit", (code) => {
  process.exit(code ?? 0);
});
