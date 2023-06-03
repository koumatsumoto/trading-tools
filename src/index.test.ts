import { expect, test } from "vitest";
import { TradingTools } from "./index";

test("TradingTools", () => {
  expect(() => TradingTools()).not.toThrow();
});
