/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "TradingTools",
      fileName: "trading-tools",
    },
  },
  test: {
    includeSource: ["src/**/*.{js,ts}"],
  },
});
