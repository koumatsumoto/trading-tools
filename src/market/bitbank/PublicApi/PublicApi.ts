import axios from "axios";
import { format } from "date-fns";
import { isNumber } from "remeda";
import { type Candlestick, type Transaction } from "../../base";
import { startTimeOfCandlestick } from "../util";
import { responseHandler, getCandlestickPagingParam, transformTransactions, transformCandlesticks } from "./functions";
import type { ApiResponse, GetCandlesticksDataResponseData, GetTransactionsResponseData } from "./types";

export class BitbankPublicApi {
  #baseUrl = "https://public.bitbank.cc";

  async getTransactions({ pair, date }: { pair: string; date: string | number | Date }): Promise<Transaction[]> {
    const url = `${this.#baseUrl}/${pair}/transactions/${format(new Date(date), "yyyyMMdd")}`;
    const result = await axios.get<ApiResponse<GetTransactionsResponseData>>(url).then(responseHandler);

    return transformTransactions(result);
  }

  async getCandlesticks({
    pair,
    type,
    start = 0,
    end = Date.now(),
    maxCount = 100,
  }: {
    pair: string;
    type: Candlestick["type"];
    start?: Date | number;
    end?: Date | number;
    maxCount?: number;
  }): Promise<Candlestick[]> {
    const result: Candlestick[] = [];
    const minTime = isNumber(start) ? start : start.getTime();
    const maxTime = startTimeOfCandlestick(type, end);
    let offset = 0;

    while (true) {
      const fetched = await this.#getCandlesticks({ pair, type, page: getCandlestickPagingParam(type, offset, end) });
      for (const candlestick of fetched) {
        // API取得したcandlestickは、time降順で並んでいる
        // 順次処理をする中で、minTimeよりも古いものがあればそれ以降全てminTimeより古いため、結果返却して終了する
        if (candlestick.time < minTime) {
          return result;
        }
        // 日か年のページ単位でAPI取得するため、同じページ内にmaxTimeよりも新しいcandlestickがあり得る
        // time降順で並んでいるため、次の順次処理ではmaxTimeよりも古い場合もあるため、結果返却せず続行する
        if (candlestick.time <= maxTime) {
          result.push(candlestick);
        }
        if (maxCount <= result.length) {
          return result;
        }
      }
      offset++;
    }
  }

  async #getCandlesticks({
    pair,
    type,
    page,
  }: {
    pair: string;
    type: Candlestick["type"];
    page: string;
  }): Promise<Candlestick[]> {
    const url = `${this.#baseUrl}/${pair}/candlestick/${type}/${page}`;
    const result = await axios.get<ApiResponse<GetCandlesticksDataResponseData>>(url).then(responseHandler);

    return transformCandlesticks(result);
  }
}
