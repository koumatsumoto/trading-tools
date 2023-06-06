import { Observable, Subject } from "rxjs";
import { Candlestick, Market } from "../../base";
import { BitbankPublicApi } from "../PublicApi/PublicApi";
import { CandlestickList } from "../util/CandlestickList";

export class BitbankMarket implements Market {
  readonly pair: string;
  readonly publicApi: BitbankPublicApi;

  constructor({ pair, publicApi }: { pair: string; publicApi?: BitbankPublicApi }) {
    this.pair = pair;
    this.publicApi = publicApi ?? new BitbankPublicApi();
  }

  subscribeCandlestick(type: Candlestick["type"], length: number): Observable<Candlestick[]> {
    const subject = new Subject<Candlestick[]>();
    this.publicApi
      .getCandlesticks({
        pair: this.pair,
        type: type,
        maxCount: length,
      })
      .then((cs) => {
        const list = new CandlestickList(type, cs);
        subject.next(list.getData());
      })
      .catch((e) => {
        subject.error(e);
      });

    return subject.asObservable();
  }
}
