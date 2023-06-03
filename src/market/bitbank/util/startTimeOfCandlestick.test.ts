import { describe, expect, test } from "vitest";
import { startTimeOfCandlestick } from "./startTimeOfCandlestick";

describe("startTimeOfCandlestick", () => {
  const getTime = (date: string) => new Date(date).getTime();

  test("1min", () => {
    expect(startTimeOfCandlestick("1min", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1min", new Date("2022-01-01T00:00:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1min", new Date("2022-01-01T00:01:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:01:00.000Z")
    );
  });

  test("5min", () => {
    expect(startTimeOfCandlestick("5min", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("5min", new Date("2022-01-01T00:04:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("5min", new Date("2022-01-01T00:05:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:05:00.000Z")
    );
  });

  test("15min", () => {
    expect(startTimeOfCandlestick("15min", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("15min", new Date("2022-01-01T00:14:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("15min", new Date("2022-01-01T00:15:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:15:00.000Z")
    );
  });

  test("30min", () => {
    expect(startTimeOfCandlestick("30min", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("30min", new Date("2022-01-01T00:29:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("30min", new Date("2022-01-01T00:30:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:30:00.000Z")
    );
  });

  test("1hour", () => {
    expect(startTimeOfCandlestick("1hour", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1hour", new Date("2022-01-01T00:59:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1hour", new Date("2022-01-01T01:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T01:00:00.000Z")
    );
  });

  test("4hour", () => {
    expect(startTimeOfCandlestick("4hour", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("4hour", new Date("2022-01-01T03:59:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("4hour", new Date("2022-01-01T04:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T04:00:00.000Z")
    );
    expect(startTimeOfCandlestick("4hour", new Date("2022-01-01T16:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T16:00:00.000Z")
    );
  });

  test("8hour", () => {
    expect(startTimeOfCandlestick("8hour", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("8hour", new Date("2022-01-01T07:59:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("8hour", new Date("2022-01-01T08:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T08:00:00.000Z")
    );
  });

  test("12hour", () => {
    expect(startTimeOfCandlestick("12hour", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("12hour", new Date("2022-01-01T11:59:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("12hour", new Date("2022-01-01T12:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T12:00:00.000Z")
    );
  });

  test("1day", () => {
    expect(startTimeOfCandlestick("1day", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1day", new Date("2022-01-01T23:59:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1day", new Date("2022-01-02T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-02T00:00:00.000Z")
    );
  });

  test("1week", () => {
    expect(startTimeOfCandlestick("1week", new Date("2022-01-03T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-03T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1week", new Date("2022-01-03T23:59:59.999Z"))).toStrictEqual(
      getTime("2022-01-03T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1week", new Date("2022-01-10T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-10T00:00:00.000Z")
    );
  });

  test("1month", () => {
    expect(startTimeOfCandlestick("1month", new Date("2022-01-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1month", new Date("2022-01-31T23:59:59.999Z"))).toStrictEqual(
      getTime("2022-01-01T00:00:00.000Z")
    );
    expect(startTimeOfCandlestick("1month", new Date("2022-02-01T00:00:00.000Z"))).toStrictEqual(
      getTime("2022-02-01T00:00:00.000Z")
    );
  });
});
