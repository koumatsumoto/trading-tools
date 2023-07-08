import { Observable } from "rxjs";
import type { Candlestick } from "./models";

export interface Market {
  subscribeCandlestick(type: Candlestick["type"], length: number): Observable<Candlestick[]>;
}
