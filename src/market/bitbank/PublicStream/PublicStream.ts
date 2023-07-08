import { filter, map, Observable, Subject } from "rxjs";
import { io, type Socket } from "socket.io-client";
import { Transaction } from "../../../interfaces";
import { transformTransactions } from "../PublicApi/functions";
import { RawTransaction } from "../PublicApi/types";

export class BitbankPublicStream {
  #socket: Socket;
  #message$ = new Subject<Message<unknown>>();
  #joinedRooms = new Set<string>();

  constructor({ socket }: { socket?: Socket } = {}) {
    this.#socket = socket ?? io("wss://stream.bitbank.cc/", { transports: ["websocket"] });
    this.#initialize();
  }

  transactions({ pair }: { pair: string }): Observable<Transaction[]> {
    return this.#subscribe("transactions", pair).pipe(map(transformTransactions));
  }

  #initialize() {
    this.#socket.on("connect", () => {
      // reconnect時はjoin-roomし直す必要がある
      for (const room of this.#joinedRooms.values()) {
        this.#socket.emit("join-room", room);
      }
    });
    this.#socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected", reason);
    });
    this.#socket.on("error", (error) => {
      console.error("Socket errored", error);
    });
    this.#socket.on("message", (data) => {
      this.#message$.next(data);
    });
  }

  #subscribe<T extends RoomNames>(type: T, pair: string) {
    const room = `${type}_${pair}` as const;
    this.#socket.emit("join-room", room);
    this.#joinedRooms.add(room);

    return this.#message$.pipe(filter(isMessageOf(room)), map(extractMessageData));
  }
}

type RoomNames = "transactions";

export type MessageData<R extends string> = R extends `transactions_${string}`
  ? { transactions: RawTransaction[] }
  : never;

export type Message<Data> = {
  room_name: string;
  message: {
    data: Data;
  };
};

const isMessageOf = <T extends string, R = MessageData<T>>(room: T) => {
  return (message: Message<unknown>): message is Message<R> => {
    return message.room_name == room;
  };
};

const extractMessageData = <Data>(message: Message<Data>): Data => {
  return message.message.data;
};
