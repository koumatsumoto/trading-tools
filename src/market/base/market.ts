import { Observable } from "rxjs";
import { Candlestick } from "./data";

export interface Market {
  subscribeCandlestick(type: Candlestick["type"], length: number): Observable<Candlestick[]>;
}
