interface Candlestick {
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly time: number;
}

interface Transaction {
  price: number;
  amount: number;
  time: number;
}

interface Params {
  readonly initialData: Candlestick[];
  readonly maxLength: number;
  readonly getStartTime: (t: number) => number;
  readonly maxInterval: number;
}

export class CandlestickGenerator {
  readonly #maxLength: number;
  readonly #maxInterval: number;
  readonly #getStartTime: (t: number) => number;
  #data: Candlestick[];

  constructor(params: Params) {
    this.#maxLength = params.maxLength;
    this.#maxInterval = params.maxInterval;
    this.#getStartTime = params.getStartTime;
    this.#data = params.initialData;
    this.#validate();
  }

  add(input: Transaction): void {
    let latest = this.#data[0];

    // まだCandlestickが無くて初めて作られる場合
    if (!latest) {
      this.#data.push({
        open: input.price,
        high: input.price,
        low: input.price,
        close: input.price,
        volume: input.amount,
        time: input.time,
      });
      return;
    }

    const time = this.#getStartTime(input.time);

    // 過去分のキャンドルスティックは更新できない仕様にしている
    if (time < latest.time) {
      throw new Error("Time should be newer than latest candlestick");
    }

    // 歯抜けにならないように不足分のCandlestickを全て作成する
    while (latest!.time < time) {
      const emptyToFill: Candlestick = {
        open: latest!.close,
        high: latest!.close,
        low: latest!.close,
        close: latest!.close,
        volume: 0,
        time: this.#getNextStartTime(latest!.time),
      };
      this.#data.unshift(emptyToFill);
      latest = emptyToFill;
    }

    // キャンドルスティックの本数を最大長に合わせる
    this.#data = this.#data.slice(0, this.#maxLength);

    // 最新のCandlestickに対して入力の差分を反映
    this.#data[0] = {
      open: latest!.open,
      high: Math.max(latest!.high, input.price),
      low: Math.min(latest!.low, input.price),
      close: input.price,
      volume: latest!.volume + input.amount,
      time: latest!.time,
    };
  }

  #validate(): void {
    // このclassで管理されるキャンドルスティックのデータに対して以下のバリデーションをする
    //   - 全てのtimeが正しい値であること
    //   - 全てのtimeが隙間なく並んでいること
    for (let i = 0; i < this.#data.length; i++) {
      const v = this.#data[i]!;
      if (v.time !== this.#getStartTime(v.time)) {
        throw new Error(`ValueError: Incorrect time. expected=${this.#getStartTime(v.time)}, actual=${v.time}`);
      }
      const prev = this.#data[i + 1];
      if (prev) {
        if (this.#getStartTime(v.time - 1) !== prev.time) {
          throw new Error(
            `ValueError: Incorrect order. candlesticks should be next to each other. ${v.time} and ${prev.time}`
          );
        }
      }
    }
  }

  #getNextStartTime(timestamp: number): number {
    return this.#getStartTime(timestamp + this.#maxInterval);
  }
}
