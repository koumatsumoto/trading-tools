import { describe, expect, test } from "vitest";
import { CandlestickGenerator, type Candlestick } from "./CandlestickGenerator";
import { getStartTimeOf1Second } from "./startTime";

describe("CandlestickGenerator", () => {
  test("params validation", () => {
    // maxLength
    expect(
      () =>
        new CandlestickGenerator({
          initialData: [],
          maxLength: 0,
          maxInterval: 1000,
          getStartTime: getStartTimeOf1Second,
        })
    ).toThrow("maxLength should be grater than 0");
    // maxInterval
    expect(
      () =>
        new CandlestickGenerator({
          initialData: [],
          maxLength: 1,
          maxInterval: 0,
          getStartTime: getStartTimeOf1Second,
        })
    ).toThrow("maxInterval should be grater than 0");
  });

  test("construct with empty array", () => {
    const generator = new CandlestickGenerator({
      initialData: [],
      maxLength: 1,
      maxInterval: 1000,
      getStartTime: getStartTimeOf1Second,
    });
    expect(generator.data).toStrictEqual([]);
  });

  test("slicing initial data by max length", () => {
    const generator = new CandlestickGenerator({
      initialData: [
        createCandlestick({ time: 3000 }),
        createCandlestick({ time: 2000 }),
        createCandlestick({ time: 1000 }),
      ],
      maxLength: 2,
      maxInterval: 1000,
      getStartTime: getStartTimeOf1Second,
    });
    expect(generator.data.length).toBe(2);
    expect(generator.data[0]?.time).toBe(3000);
    expect(generator.data[1]?.time).toBe(2000);
  });

  test("validation", () => {
    // missing some parts
    expect(
      () =>
        new CandlestickGenerator({
          initialData: [createCandlestick({ time: 1000 }), createCandlestick({ time: 3000 })],
          maxLength: 2,
          maxInterval: 1000,
          getStartTime: getStartTimeOf1Second,
        })
    ).toThrow();

    // incorrect order
    expect(
      () =>
        new CandlestickGenerator({
          initialData: [createCandlestick({ time: 1000 }), createCandlestick({ time: 2000 })],
          maxLength: 2,
          maxInterval: 1000,
          getStartTime: getStartTimeOf1Second,
        })
    ).toThrow();
  });

  test("add for the first candlestick", () => {
    const generator = new CandlestickGenerator({
      initialData: [],
      maxLength: 10,
      maxInterval: 1000,
      getStartTime: getStartTimeOf1Second,
    });
    generator.add({
      price: 10,
      amount: 100,
      time: 1234,
    });
    expect(generator.data).toStrictEqual([
      {
        open: 10,
        high: 10,
        low: 10,
        close: 10,
        volume: 100,
        time: 1000,
      },
    ]);
  });

  test("error for old candlestick update", () => {
    const generator = new CandlestickGenerator({
      initialData: [createCandlestick({ time: 2000 })],
      maxLength: 10,
      maxInterval: 1000,
      getStartTime: getStartTimeOf1Second,
    });
    expect(() =>
      generator.add({
        price: 10,
        amount: 100,
        time: 1234,
      })
    ).toThrow("Time should be newer than latest candlestick");
  });

  test("updating latest and creating missing parts", () => {
    const generator = new CandlestickGenerator({
      initialData: [createCandlestick({ time: 1000 })],
      maxLength: 10,
      maxInterval: 1000,
      getStartTime: getStartTimeOf1Second,
    });
    generator.add({
      price: 10,
      amount: 100,
      time: 3000,
    });
    generator.add({
      price: 1,
      amount: 200,
      time: 3001,
    });
    expect(generator.data.length).toBe(3);
    expect(generator.data).toStrictEqual([
      {
        open: 4,
        high: 10,
        low: 1,
        close: 1,
        volume: 300,
        time: 3000,
      },
      {
        open: 4,
        high: 4,
        low: 4,
        close: 4,
        volume: 0,
        time: 2000,
      },
      {
        open: 1,
        high: 2,
        low: 3,
        close: 4,
        volume: 5,
        time: 1000,
      },
    ]);
  });
});

function createCandlestick(data: Partial<Candlestick>) {
  return {
    open: 1,
    high: 2,
    low: 3,
    close: 4,
    volume: 5,
    time: 0,
    ...data,
  };
}
