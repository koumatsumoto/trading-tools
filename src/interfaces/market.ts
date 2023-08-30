import { Observable } from "rxjs";
import type { Candlestick, CandlestickType } from "./models";

export interface Market {
  subscribeCandlestick(type: CandlestickType, length: number): Observable<Candlestick[]>;
}
