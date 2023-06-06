import { Candlestick } from "../../base";
import { startTimeOfCandlestick } from "./startTimeOfCandlestick";

// キャンドルスティック同士の間隔
// 閏秒がある場合は間隔が異なるため、想定される最も長い間隔を使う
// 間隔が長くなる点については、startTimeの処理で丸められるため問題ない
const INTERVAL = {
  "1min": 60 * 1000,
  "5min": 5 * 60 * 1000,
  "15min": 15 * 60 * 1000,
  "30min": 30 * 60 * 1000,
  "1hour": 60 * 60 * 1000,
  "4hour": 4 * 60 * 60 * 1000,
  "8hour": 8 * 60 * 60 * 1000,
  "12hour": 12 * 60 * 60 * 1000,
  "1day": 24 * 60 * 60 * 1000,
  "1week": 7 * 24 * 60 * 60 * 1000,
  "1month": 31 * 24 * 60 * 60 * 1000,
} as const satisfies Record<Candlestick["type"], number>;

export function nextStartTimeOfCandlestick(type: Candlestick["type"], time: number) {
  const current = startTimeOfCandlestick(type, time);
  return startTimeOfCandlestick(type, current + INTERVAL[type]);
}
