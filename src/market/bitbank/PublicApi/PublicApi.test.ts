import { describe, expect, test } from "vitest";
import { BitbankPublicApi } from "./PublicApi";

describe("BitbankPublicApi for local", () => {
  const api = new BitbankPublicApi();
  const pair = "btc_jpy";

  test("getTransactions", async () => {
    const res = await api.getTransactions({ pair, date: "2023-03-09" });
    expect(res).toBeDefined();
  });

  describe("getCandlesticks", () => {
    const end = new Date("2023-03-24T00:00:00.000Z");

    test("1hour 1page", async () => {
      const res = await api.getCandlesticks({ pair, type: "1hour", count: 24, end });
      expect(res).toHaveLength(24);
      expect(res.at(0)?.time).toBe(getTime("2023-03-24T00:00:00.000Z"));
      expect(res.at(23)?.time).toBe(getTime("2023-03-23T01:00:00.000Z"));
    });

    test("30min 2page", async () => {
      const res = await api.getCandlesticks({ pair, type: "30min", count: 50, end });
      expect(res).toHaveLength(50);
      expect(res.at(0)?.time).toBe(getTime("2023-03-24T00:00:00.000Z"));
      expect(res.at(49)?.time).toBe(getTime("2023-03-22T23:30:00.000Z"));
    });

    test("1day 3page", async () => {
      const res = await api.getCandlesticks({ pair, type: "1day", count: 500, end });
      expect(res).toHaveLength(500);
      expect(res.at(0)?.time).toBe(getTime("2023-03-24T00:00:00.000Z"));
      expect(res.at(499)?.time).toBe(getTime("2021-11-10T00:00:00.000Z"));
    });
  });
});

function getTime(date: string): number {
  return new Date(date).getTime();
}
