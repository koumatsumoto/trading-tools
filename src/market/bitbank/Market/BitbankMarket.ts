import { Observable, Subject } from "rxjs";
import { Candlestick, Market } from "../../../interfaces";
import { BitbankPublicApi } from "../PublicApi/PublicApi";
import { BitbankPublicStream } from "../PublicStream/PublicStream";
import { CandlestickList } from "../util/CandlestickList";

export class BitbankMarket implements Market {
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

  subscribeCandlestick(type: Candlestick["type"], length: number): Observable<Candlestick[]> {
    const subject = new Subject<Candlestick[]>();
    this.#publicApi
      .getCandlesticks({
        pair: this.#pair,
        type: type,
        maxCount: length,
      })
      .then((cs) => {
        const list = new CandlestickList(type, cs);
        subject.next(list.getData());

        this.#publicStream.transactions({ pair: this.#pair }).subscribe((txs) => {
          txs.forEach((tx) => {
            list.applyTransaction(tx);
            subject.next(list.getData());
          });
        });
      })
      .catch((e) => {
        subject.error(e);
      });

    return subject.asObservable();
  }
}
