import { describe, expect, test } from "vitest";
import { TestHelpers } from "../../../testing";
import { BitbankPublicApi } from "./PublicApi";

describe("BitbankPublicApi", () => {
  const api = new BitbankPublicApi();
  const pair = "btc_jpy";

  test("getTransactions", async () => {
    TestHelpers.mockGetApi("https://public.bitbank.cc/btc_jpy/transactions/20230309", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: 1,
          data: {
            transactions: [
              {
                transaction_id: 1,
                side: "buy",
                price: "1",
                amount: "2",
                executed_at: 3,
              },
            ],
          },
        })
      );
    });

    const res = await api.getTransactions({ pair, date: "2023-03-09" });
    expect(res).toStrictEqual([
      {
        id: 1,
        side: "buy",
        price: 1,
        amount: 2,
        time: 3,
      },
    ]);
  });

  test("getCandlesticks", async () => {
    TestHelpers.mockGetApi("https://public.bitbank.cc/btc_jpy/candlestick/1day/2022", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: 1,
          data: {
            candlestick: [
              {
                type: "1day",
                ohlcv: [["1", "2", "3", "4", "5", timestamp("2022-01-01T00:00:00.000Z")]],
              },
            ],
            timestamp: timestamp("2022-01-01T00:00:00.000Z"),
          },
        })
      );
    });

    const res = await api.getCandlesticks({
      pair,
      type: "1day",
      count: 1,
      end: new Date("2022-03-24T00:00:00.000Z"),
    });
    console.log(res);
    expect(res).toStrictEqual([
      {
        type: "1day",
        open: 1,
        high: 2,
        low: 3,
        close: 4,
        volume: 5,
        time: timestamp("2022-01-01T00:00:00.000Z"),
      },
    ]);
  });
});

function timestamp(date: string): number {
  return new Date(date).getTime();
}
