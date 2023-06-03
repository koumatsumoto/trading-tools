import { expect, test } from "vitest";
import { sortCandlesticksByTimeDesc } from "./sortCandlesticksByTimeDesc";

test("sortCandlesticksByTimeDesc", () => {
  expect(sortCandlesticksByTimeDesc([{ time: 1 }, { time: 3 }, { time: 2 }])).toStrictEqual([
    { time: 3 },
    { time: 2 },
    { time: 1 },
  ]);
});
