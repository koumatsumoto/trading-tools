import { setTimeout } from "node:timers/promises";
import { describe, expect, test, vi } from "vitest";
import { Candlestick } from "../../base";
import { BitbankMarket } from "./BitbankMarket";

describe("BitbankMarket", () => {
  test("subscribeCandlestick", async () => {
    const publicApi = {
      getCandlesticks: vi.fn().mockResolvedValue(createCandlesticksTestData()),
    } as any;

    const market = new BitbankMarket({ pair: "btc_jpy", publicApi });
    let candlesticks: Candlestick[] | undefined;
    market.subscribeCandlestick("1day", 1).subscribe((cs) => {
      candlesticks = cs;
    });
    await setTimeout(); // wait for the promise micro task in market.subscribeCandlestick
    expect(candlesticks).toHaveLength(1);
  });
});

function timestamp(date: string): number {
  return new Date(date).getTime();
}

function createCandlesticksTestData(): Candlestick[] {
  return [
    {
      type: "1day",
      open: 1,
      high: 2,
      low: 3,
      close: 4,
      volume: 5,
      time: timestamp("2023-01-01T00:00:00.000Z"),
    },
  ];
}
