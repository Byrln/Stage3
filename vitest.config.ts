import {defineConfig} from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    coverage: {
      enabled: true,
      provider: "v8",
      reportsDirectory: "./coverage",
    },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
