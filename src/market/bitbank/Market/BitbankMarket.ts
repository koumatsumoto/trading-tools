import { Observable, Subject } from "rxjs";
import type { Candlestick, CandlestickType } from "../../../interfaces";
import { BitbankPublicApi } from "../PublicApi/PublicApi";
import { BitbankPublicStream } from "../PublicStream/PublicStream";
import { getCandlestickGenerator } from "../util/getCandlestickGenerator";

export class BitbankMarket {
  readonly #pair: string;
  readonly #publicApi: BitbankPublicApi;
  readonly #publicStream: BitbankPublicStream;

  constructor({
    pair,
    publicApi,
    publicStream,
  }: {
    pair: string;
    publicApi?: BitbankPublicApi;
    publicStream?: BitbankPublicStream;
  }) {
    this.#pair = pair;
    this.#publicApi = publicApi ?? new BitbankPublicApi();
    this.#publicStream = publicStream ?? new BitbankPublicStream();
  }

  subscribeCandlestick(type: CandlestickType, length: number): Observable<Candlestick[]> {
    const subject = new Subject<Candlestick[]>();
    this.#publicApi
      .getCandlesticks({
        pair: this.#pair,
        type: type,
        maxCount: length,
      })
      .then((cs) => {
        const generator = getCandlestickGenerator(type, cs);
        subject.next(generator.data);

        this.#publicStream.transactions({ pair: this.#pair }).subscribe((txs) => {
          txs.forEach((tx) => {
            generator.add(tx);
            subject.next(generator.data);
          });
        });
      })
      .catch((e) => {
        subject.error(e);
      });

    return subject.asObservable();
  }
}
