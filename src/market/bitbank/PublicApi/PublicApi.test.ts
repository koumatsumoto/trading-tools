import { describe, expect, test } from "vitest";
import { TestHelpers } from "../../../testing";
import { BitbankPublicApi } from "./PublicApi";
import type { OHLCV, RawTransaction } from "./types";

describe("BitbankPublicApi", () => {
  const api = new BitbankPublicApi();
  const pair = "btc_jpy";

  test("getTransactions", async () => {
    // ページングのテストのために3日分mock
    // 実際のAPIのデータも、以下のように時刻昇順で並んでいる
    setMockTransactionApi("20220102", [
      createTransactionTestData("2022-01-02T08:00:00.000Z"),
      createTransactionTestData("2022-01-02T09:00:00.000Z"),
      createTransactionTestData("2022-01-02T10:00:00.000Z"),
    ]);
    setMockTransactionApi("20220101", [
      createTransactionTestData("2022-01-01T08:00:00.000Z"),
      createTransactionTestData("2022-01-01T09:00:00.000Z"),
      createTransactionTestData("2022-01-01T10:00:00.000Z"),
    ]);
    setMockTransactionApi("20211231", [
      createTransactionTestData("2021-12-31T08:00:00.000Z"),
      createTransactionTestData("2021-12-31T09:00:00.000Z"),
      createTransactionTestData("2021-12-31T10:00:00.000Z"),
    ]);

    const start = timestamp("2021-12-31T09:00:00.000Z");
    const end = timestamp("2022-01-02T09:00:00.000Z");
    const res = await api.getTransactions({ pair, start, end });
    // start, endでそれぞれ1件ずつ除外されている
    expect(res).toHaveLength(7);
    expect(res.at(0)).toStrictEqual({
      id: 1,
      side: "buy",
      price: 2,
      amount: 3,
      time: end,
    });
    expect(res.at(-1)).toStrictEqual({
      id: 1,
      side: "buy",
      price: 2,
      amount: 3,
      time: start,
    });

    // maxCountの指定がある場合はその個数まで取得して返却する
    expect(await api.getTransactions({ pair, end, start, maxCount: 4 })).toHaveLength(4);
  });

  test("getCandlesticks", async () => {
    // ページングのテストのために3日分mock
    // 実際のAPIのデータも、以下のように時刻降順で並んでいる
    setMockCandlestickApi("20220102", [
      createOHLCVTestData("2022-01-02T10:00:00.000Z"),
      createOHLCVTestData("2022-01-02T09:00:00.000Z"),
      createOHLCVTestData("2022-01-02T08:00:00.000Z"),
    ]);
    setMockCandlestickApi("20220101", [
      createOHLCVTestData("2022-01-01T10:00:00.000Z"),
      createOHLCVTestData("2022-01-01T09:00:00.000Z"),
      createOHLCVTestData("2022-01-01T08:00:00.000Z"),
    ]);
    setMockCandlestickApi("20211231", [
      createOHLCVTestData("2021-12-31T10:00:00.000Z"),
      createOHLCVTestData("2021-12-31T09:00:00.000Z"),
      createOHLCVTestData("2021-12-31T08:00:00.000Z"),
    ]);

    const type = "1min";
    const start = timestamp("2021-12-31T09:00:00.000Z");
    const end = timestamp("2022-01-02T09:00:00.000Z");
    const res = await api.getCandlesticks({ pair, type, start, end });
    // start, endでそれぞれ1件ずつ除外されている
    expect(res).toHaveLength(7);
    expect(res.at(0)).toStrictEqual({
      type,
      open: 1,
      high: 2,
      low: 3,
      close: 4,
      volume: 5,
      time: end,
    });
    expect(res.at(-1)).toStrictEqual({
      type: "1min",
      open: 1,
      high: 2,
      low: 3,
      close: 4,
      volume: 5,
      time: start,
    });

    // maxCountの指定がある場合はその個数まで取得して返却する
    expect(await api.getCandlesticks({ pair, type, end, start, maxCount: 4 })).toHaveLength(4);
  });
});

function timestamp(date: string): number {
  return new Date(date).getTime();
}

function setMockTransactionApi(page: string, transactions: RawTransaction[]) {
  TestHelpers.mockGetApi(`https://public.bitbank.cc/btc_jpy/transactions/${page}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: 1,
        data: { transactions },
      })
    );
  });
}

function setMockCandlestickApi(page: string, ohlcv: OHLCV[]) {
  TestHelpers.mockGetApi(`https://public.bitbank.cc/btc_jpy/candlestick/1min/${page}`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: 1,
        data: {
          candlestick: [
            {
              type: "1min",
              ohlcv: ohlcv,
            },
          ],
          timestamp: timestamp("2022-01-01T00:00:00.000Z"), // 使われない
        },
      })
    );
  });
}

function createTransactionTestData(datetime: string): RawTransaction {
  return {
    transaction_id: 1,
    side: "buy",
    price: "2",
    amount: "3",
    executed_at: timestamp(datetime),
  };
}

function createOHLCVTestData(datetime: string): OHLCV {
  return ["1", "2", "3", "4", "5", timestamp(datetime)];
}
