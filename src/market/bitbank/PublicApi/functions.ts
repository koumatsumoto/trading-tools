import type { AxiosResponse } from "axios";
import { format, subDays, subYears } from "date-fns";
import type { Candlestick, Transaction } from "../../base";
import type { ApiResponse, GetCandlesticksDataResponseData, GetTransactionsResponseData } from "./types";

export const responseHandler = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(`ResponseError: code=${response.data.data.code}`);
  }
};

export const transformCandlesticks = (
  data: GetCandlesticksDataResponseData,
  type: Candlestick["type"]
): Candlestick[] => {
  return data.candlestick[0].ohlcv.map((v) => ({
    type,
    open: Number(v[0]),
    high: Number(v[1]),
    low: Number(v[2]),
    close: Number(v[3]),
    volume: Number(v[4]),
    time: v[5],
  }));
};

export const transformTransactions = (data: GetTransactionsResponseData): Transaction[] => {
  return data.transactions.map((v) => ({
    id: v.transaction_id,
    side: v.side,
    price: Number(v.price),
    amount: Number(v.amount),
    time: v.executed_at,
  }));
};

export function getCandlestickPagingParam(type: Candlestick["type"], pageNo: number, baseTime: Date | number): string {
  switch (type) {
    case "1min":
    case "5min":
    case "15min":
    case "30min":
    case "1hour":
      return format(subDays(baseTime, pageNo), "yyyyMMdd");
    case "4hour":
    case "8hour":
    case "12hour":
    case "1day":
    case "1week":
    case "1month":
      return format(subYears(baseTime, pageNo), "yyyy");
  }
}
