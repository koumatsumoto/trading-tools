import { EventEmitter } from "node:events";
import { describe, expect, test, vi } from "vitest";
import { BitbankPublicStream } from "./PublicStream";

describe("BitbankPublicStream", () => {
  test("connection handling", () => {
    const socket = { on: vi.fn() };
    const stream = new BitbankPublicStream({ socket: socket as any });
    expect(stream).toBeTruthy();
    expect(socket.on).toHaveBeenCalledTimes(4);
  });

  test("transactions", async () => {
    const socket = new EventEmitter();
    const stream = new BitbankPublicStream({ socket: socket as any });
    let transactions: any;
    stream.transactions({ pair: "btc_jpy" }).subscribe((data) => {
      transactions = data;
    });
    socket.emit("message", {
      room_name: "transactions_btc_jpy",
      message: {
        data: {
          transactions: [
            {
              transaction_id: 1,
              side: "buy",
              price: "2",
              amount: "3",
              executed_at: 0,
            },
          ],
        },
      },
    });
    expect(transactions).toStrictEqual([
      {
        id: 1,
        side: "buy",
        price: 2,
        amount: 3,
        time: 0,
      },
    ]);
  });
});
