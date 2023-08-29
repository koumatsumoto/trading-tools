export interface Candlestick {
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly time: number;
}

export interface Transaction {
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

  get data(): Readonly<Candlestick[]> {
    return this.#data;
  }

  constructor(params: Params) {
    this.#validateParams(params);
    this.#maxLength = params.maxLength;
    this.#maxInterval = params.maxInterval;
    this.#getStartTime = params.getStartTime;
    this.#data = this.#slice(params.initialData);
    this.#validateData();
  }

  add(input: Transaction): void {
    const time = this.#getStartTime(input.time);

    if (!this.#data[0]) {
      this.#data.push({
        open: input.price,
        high: input.price,
        low: input.price,
        close: input.price,
        volume: input.amount,
        time: time,
      });
      return;
    }

    let latest = this.#data[0];

    if (time < latest.time) {
      throw new Error("Time should be newer than latest candlestick");
    }

    while (latest.time < time) {
      const emptyToFill: Candlestick = {
        open: latest.close,
        high: latest.close,
        low: latest.close,
        close: latest.close,
        volume: 0,
        time: this.#getNextStartTime(latest.time),
      };
      this.#data.unshift(emptyToFill);
      latest = emptyToFill;
    }

    this.#data = this.#slice(this.#data);
    this.#data[0] = {
      open: latest!.open,
      high: Math.max(latest!.high, input.price),
      low: Math.min(latest!.low, input.price),
      close: input.price,
      volume: latest!.volume + input.amount,
      time: latest!.time,
    };
  }

  #slice(data: Candlestick[]): Candlestick[] {
    return data.slice(0, this.#maxLength);
  }

  #validateParams(params: Params): void {
    if (params.maxLength < 1) {
      throw new Error("maxLength should be grater than 0");
    }
    if (params.maxInterval < 1) {
      throw new Error("maxInterval should be grater than 0");
    }
  }

  #validateData(): void {
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
