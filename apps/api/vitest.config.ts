import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    coverage: { enabled: false },
    setupFiles: ["./tests/setup-env.ts"],
  },
  resolve: {
    alias: {
      "@": new URL("./src/", import.meta.url).pathname,
    },
  },
});
