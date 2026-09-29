import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    // Playwright owns e2e/*.spec.ts; Vitest runs only the unit and content tests.
    include: ["tests/**/*.test.ts"],
    testTimeout: 10000,
  },
});
