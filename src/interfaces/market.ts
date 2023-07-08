import { Observable } from "rxjs";
import { Candlestick } from "./models";

export interface Market {
  subscribeCandlestick(type: Candlestick["type"], length: number): Observable<Candlestick[]>;
}
