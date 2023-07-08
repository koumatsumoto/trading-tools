import { setTimeout } from "node:timers/promises";
import { of } from "rxjs";
import { describe, expect, test, vi } from "vitest";
import { Candlestick, Transaction } from "../../../interfaces";
import { BitbankMarket } from "./BitbankMarket";

describe("BitbankMarket", () => {
  test("subscribeCandlestick", async () => {
    const publicApi = {
      getCandlesticks: vi.fn().mockResolvedValue(createCandlesticksTestData()),
    };
    const publicStream = {
      transactions: vi.fn().mockReturnValue(of(createTransactionsTestData())),
    };

    const market = new BitbankMarket({
      pair: "btc_jpy",
      publicApi: publicApi as any,
      publicStream: publicStream as any,
    });
    let candlesticks: Candlestick[] | undefined;
    market.subscribeCandlestick("1day", 1).subscribe((cs) => {
      candlesticks = cs;
    });

    // wait for the promise micro task in market.subscribeCandlestick
    await setTimeout();

    expect(candlesticks).toHaveLength(2);
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

function createTransactionsTestData(): Transaction[] {
  return [
    {
      id: 1,
      side: "buy",
      price: 10,
      amount: 20,
      time: timestamp("2023-01-01T01:00:00.000Z"),
    },
    {
      id: 2,
      side: "sell",
      price: 30,
      amount: 40,
      time: timestamp("2023-01-02T00:00:00.000Z"),
    },
  ];
}
