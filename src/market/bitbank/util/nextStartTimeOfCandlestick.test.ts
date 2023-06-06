import { expect, test } from "vitest";
import { nextStartTimeOfCandlestick } from "./nextStartTimeOfCandlestick";

test("nextStartTimeOfCandlestick", () => {
  const getTime = (date: string) => new Date(date).getTime();
  // 1min
  expect(nextStartTimeOfCandlestick("1min", getTime("2023-03-09T00:01:00"))).toBe(getTime("2023-03-09T00:02:00"));
  // 5min
  expect(nextStartTimeOfCandlestick("5min", getTime("2023-03-09T00:05:00"))).toBe(getTime("2023-03-09T00:10:00"));
  // 15min
  expect(nextStartTimeOfCandlestick("15min", getTime("2023-03-09T00:15:00"))).toBe(getTime("2023-03-09T00:30:00"));
  // 30min
  expect(nextStartTimeOfCandlestick("30min", getTime("2023-03-09T00:30:00"))).toBe(getTime("2023-03-09T01:00:00"));
  // 1hour
  expect(nextStartTimeOfCandlestick("1hour", getTime("2023-03-09T01:00:00"))).toBe(getTime("2023-03-09T02:00:00"));
  // 4hour
  expect(nextStartTimeOfCandlestick("4hour", getTime("2023-03-09T04:00:00Z"))).toBe(getTime("2023-03-09T08:00:00Z"));
  // 8hour
  expect(nextStartTimeOfCandlestick("8hour", getTime("2023-03-09T08:00:00Z"))).toBe(getTime("2023-03-09T16:00:00Z"));
  // 12hour
  expect(nextStartTimeOfCandlestick("12hour", getTime("2023-03-09T12:00:00Z"))).toBe(getTime("2023-03-10T00:00:00Z"));
  // 1day
  expect(nextStartTimeOfCandlestick("1day", getTime("2023-03-10T00:00:00Z"))).toBe(getTime("2023-03-11T00:00:00Z"));
  // 1week
  expect(nextStartTimeOfCandlestick("1week", getTime("2023-03-06T00:00:00Z"))).toBe(getTime("2023-03-13T00:00:00Z"));
  // 1month
  expect(nextStartTimeOfCandlestick("1month", getTime("2023-03-01T00:00:00Z"))).toBe(getTime("2023-04-01T00:00:00Z"));
});
