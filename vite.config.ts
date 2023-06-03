/// <reference types="vitest" />
import typescript from "@rollup/plugin-typescript";
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
  plugins: [typescript()],
  test: {
    includeSource: ["src/**/*.{js,ts}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
