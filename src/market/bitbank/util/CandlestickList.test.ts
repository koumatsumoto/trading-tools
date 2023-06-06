import { describe, expect, test } from "vitest";
import type { Candlestick } from "../../base";
import { CandlestickList } from "./CandlestickList";

describe("CandlestickList", () => {
  test("construct and validate", () => {
    // 空のデータで初期化できる
    expect(new CandlestickList("1min").getData()).toStrictEqual([]);
    expect(new CandlestickList("1min", []).getData()).toStrictEqual([]);
    expect(new CandlestickList("1min").getLatest()).toBeNull();
    // typeが異なる場合はエラー
    expect(
      () =>
        new CandlestickList("1min", [
          {
            type: "5min",
            open: 1,
            high: 1,
            low: 1,
            close: 1,
            volume: 1,
            time: 60000,
          },
        ])
    ).toThrow("ValueError: Incorrect type");
    // timeが間違っている場合はエラー
    expect(
      () =>
        new CandlestickList("1min", [
          {
            type: "1min",
            open: 1,
            high: 1,
            low: 1,
            close: 1,
            volume: 1,
            time: 60001,
          },
        ])
    ).toThrowError("ValueError: Incorrect time");
    // 歯抜けがある場合はエラー
    expect(
      () =>
        new CandlestickList("1min", [
          {
            type: "1min",
            open: 1,
            high: 1,
            low: 1,
            close: 1,
            volume: 1,
            time: 60000,
          },
          {
            type: "1min",
            open: 1,
            high: 1,
            low: 1,
            close: 1,
            volume: 1,
            time: 180000,
          },
        ])
    ).toThrowError("ValueError: Incorrect order");
    // 正常なデータで初期化できる。Candlestickは並び替えされる
    const valid_data: Candlestick[] = [
      {
        type: "1min",
        open: 1,
        high: 1,
        low: 1,
        close: 1,
        volume: 1,
        time: 60000,
      },
      {
        type: "1min",
        open: 2,
        high: 2,
        low: 2,
        close: 2,
        volume: 2,
        time: 120000,
      },
      {
        type: "1min",
        open: 3,
        high: 3,
        low: 3,
        close: 3,
        volume: 3,
        time: 180000,
      },
    ];
    expect(new CandlestickList("1min", valid_data).getLatest()).toStrictEqual(valid_data.at(-1));
    // maxLength以上のデータが入力された場合は並び替え後にサイズ縮小される
    expect(new CandlestickList("1min", valid_data, 2).getData()).toStrictEqual([valid_data.at(-1), valid_data.at(-2)]);
  });

  test("applyTransaction", () => {
    // 空の状態から初めてキャンドルスティックが作られる
    const list = new CandlestickList("1min", [], 4);
    list.applyTransaction({
      price: 1,
      amount: 2,
      time: 60000,
    });
    expect(list.getData()).toHaveLength(1);
    expect(list.getLatest()).toStrictEqual({
      type: "1min",
      open: 1,
      high: 1,
      low: 1,
      close: 1,
      volume: 2,
      time: 60000,
    });

    // 現在の最新より次のtxを追加
    list.applyTransaction({
      price: 3,
      amount: 10,
      time: 120000,
    });
    expect(list.getData()).toHaveLength(2);
    expect(list.getLatest()).toStrictEqual({
      type: "1min",
      open: 1,
      high: 3,
      low: 1,
      close: 3,
      volume: 10,
      time: 120000,
    });

    // 現在の最新を更新
    list.applyTransaction({
      price: 2,
      amount: 10,
      time: 130000,
    });
    expect(list.getData()).toHaveLength(2);
    expect(list.getLatest()).toStrictEqual({
      type: "1min",
      open: 1,
      high: 3,
      low: 1,
      close: 2,
      volume: 20,
      time: 120000,
    });

    // 最新より2つ先を更新。中間も作成される
    list.applyTransaction({
      price: 5,
      amount: 100,
      time: 240000,
    });
    expect(list.getData()).toHaveLength(4);
    expect(list.getLatest()).toStrictEqual({
      type: "1min",
      open: 2,
      high: 5,
      low: 2,
      close: 5,
      volume: 100,
      time: 240000,
    });
    expect(list.getData().at(1)).toStrictEqual({
      type: "1min",
      open: 2,
      high: 2,
      low: 2,
      close: 2,
      volume: 0,
      time: 180000,
    });

    // 過去分は更新されない
    const previous = [...list.getData()];
    list.applyTransaction({
      price: 100,
      amount: 100,
      time: 180000,
    });
    expect(list.getData()).toStrictEqual(previous);

    // 更新後にmaxLength以上のデータ数の場合は、最も古いものが切り落とされる
    const beforeUpdate = [...list.getData()];
    expect(beforeUpdate).toHaveLength(4);
    expect([beforeUpdate.at(0)?.time, beforeUpdate.at(-1)?.time]).toStrictEqual([240000, 60000]);
    list.applyTransaction({
      price: 100,
      amount: 100,
      time: 300000,
    });
    const afterUpdate = [...list.getData()];
    expect(afterUpdate).toHaveLength(4);
    expect([afterUpdate.at(0)?.time, afterUpdate.at(-1)?.time]).toStrictEqual([300000, 120000]);
  });
});
