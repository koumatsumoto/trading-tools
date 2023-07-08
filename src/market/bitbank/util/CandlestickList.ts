import { type Candlestick } from "../../../interfaces";
import { nextStartTimeOfCandlestick } from "./nextStartTimeOfCandlestick";
import { sortCandlesticksByTimeDesc } from "./sortCandlesticksByTimeDesc";
import { startTimeOfCandlestick } from "./startTimeOfCandlestick";

type PartialTransaction = {
  price: number;
  amount: number;
  time: number;
};

export class CandlestickList {
  readonly #type: Candlestick["type"];
  readonly #maxLength: number;
  #data!: Candlestick[];

  getData(): Candlestick[] {
    return [...this.#data];
  }

  getLatest(): Candlestick | null {
    return this.#data.at(0) ?? null;
  }

  constructor(type: Candlestick["type"], data: Candlestick[] = [], maxLength: number = 36) {
    this.#type = type;
    this.#maxLength = maxLength;
    this.#data = this.#sortAndValidate(data);
  }

  applyTransaction(tx: PartialTransaction): void {
    let latest = this.getLatest();

    // まだCandlestickが無くて初めて作られる場合
    if (!latest) {
      this.#data.push({
        type: this.#type,
        open: tx.price,
        high: tx.price,
        low: tx.price,
        close: tx.price,
        volume: tx.amount,
        time: tx.time,
      });
      return;
    }

    // 過去分のキャンドルスティックは更新できない仕様にしている（最新ならOK）
    const time = startTimeOfCandlestick(this.#type, tx.time);
    if (time < latest.time) {
      return;
    }

    // 歯抜けにならないように不足分のCandlestickを全て作成する
    while (latest.time < time) {
      this.#data.unshift({
        type: this.#type,
        open: latest.close,
        high: latest.close,
        low: latest.close,
        close: latest.close,
        volume: 0,
        time: nextStartTimeOfCandlestick(this.#type, latest.time),
      });
      latest = this.getLatest()!;
    }
    this.#data = this.#data.slice(0, this.#maxLength);

    // 最新のCandlestickに対してTransactionの差分を反映
    this.#data[0] = {
      type: this.#type,
      open: latest.open,
      high: Math.max(latest.high, tx.price),
      low: Math.min(latest.low, tx.price),
      close: tx.price,
      volume: latest.volume + tx.amount,
      time: latest.time,
    };
  }

  #sortAndValidate(inputs: Candlestick[]): Candlestick[] {
    const data = sortCandlesticksByTimeDesc([...inputs]).slice(0, this.#maxLength);

    // このclassで管理されるキャンドルスティックのデータに対して以下のバリデーションをする
    //   - 全てのtypeが一致していること
    //   - 全てのtimeが正しい値であること
    //   - 全てのtimeが隙間なく並んでいること
    for (let i = 0; i < data.length; i++) {
      const v = data[i]!;
      if (v.type !== this.#type) {
        throw new Error(`ValueError: Incorrect type. expected=${this.#type}, actual=${v.type}`);
      }
      if (v.time !== startTimeOfCandlestick(v.type, v.time)) {
        throw new Error(
          `ValueError: Incorrect time. expected=${startTimeOfCandlestick(v.type, v.time)}, actual=${v.time}`
        );
      }
      const prev = data[i + 1];
      if (prev) {
        if (startTimeOfCandlestick(v.type, v.time - 1) !== prev.time) {
          throw new Error(
            `ValueError: Incorrect order. candlesticks should be next to each other. ${v.time} and ${prev.time}`
          );
        }
      }
    }

    return data as Candlestick[];
  }
}
