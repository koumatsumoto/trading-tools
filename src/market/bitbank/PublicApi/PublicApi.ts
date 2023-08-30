import axios from "axios";
import { isNumber } from "remeda";
import type { Candlestick, CandlestickType, Transaction } from "../../../interfaces";
import { startTimeOfCandlestick } from "../util";
import {
  responseHandler,
  getCandlestickPagingParam,
  transformTransactions,
  transformCandlesticks,
  getTransactionPagingParam,
} from "./functions";
import type { ApiResponse, GetCandlesticksDataResponseData, GetTransactionsResponseData } from "./types";

export class BitbankPublicApi {
  #baseUrl = "https://public.bitbank.cc";

  async getTransactions({
    pair,
    start = 0,
    end = Date.now(),
    maxCount = 100,
  }: {
    pair: string;
    start?: Date | number;
    end?: Date | number;
    maxCount?: number;
  }): Promise<Transaction[]> {
    const result: Transaction[] = [];
    const minTime = isNumber(start) ? start : start.getTime();
    const maxTime = isNumber(end) ? end : end.getTime();
    let offset = 0;

    while (true) {
      const fetched = await this.#getTransactions(pair, getTransactionPagingParam(offset, maxTime));
      for (const tx of fetched) {
        // API取得したデータは、time昇順降順で並んでいる
        // 順次処理をする中で、minTimeよりも古いものがあればそれ以降全てminTimeより古いため、結果返却して終了する
        if (tx.time < minTime) {
          return result;
        }
        // 日か年のページ単位でAPI取得するため、同じページ内にmaxTimeよりも新しいものがあり得る
        // time降順で並んでいるため、次の順次処理ではmaxTimeよりも古い場合もあるため、結果返却せず続行する
        if (tx.time <= maxTime) {
          result.push(tx);
        }
        if (maxCount <= result.length) {
          return result;
        }
      }
      offset++;
    }
  }

  async getCandlesticks({
    pair,
    type,
    start = 0,
    end = Date.now(),
    maxCount = 100,
  }: {
    pair: string;
    type: CandlestickType;
    start?: Date | number;
    end?: Date | number;
    maxCount?: number;
  }): Promise<Candlestick[]> {
    const result: Candlestick[] = [];
    const startTime = isNumber(start) ? start : start.getTime();
    const endTime = isNumber(end) ? end : end.getTime();
    const minTime = startTime;
    const maxTime = startTimeOfCandlestick(type, endTime);
    let offset = 0;

    while (true) {
      const fetched = await this.#getCandlesticks(pair, type, getCandlestickPagingParam(type, offset, end));
      for (const candlestick of fetched) {
        // API取得したデータは、time昇順降順で並んでいる
        // 順次処理をする中で、minTimeよりも古いものがあればそれ以降全てminTimeより古いため、結果返却して終了する
        if (candlestick.time < minTime) {
          return result;
        }
        // 日か年のページ単位でAPI取得するため、同じページ内にmaxTimeよりも新しいものがあり得る
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

  async #getTransactions(pair: string, page: string): Promise<Transaction[]> {
    const url = `${this.#baseUrl}/${pair}/transactions/${page}`;
    const result = await axios.get<ApiResponse<GetTransactionsResponseData>>(url).then(responseHandler);

    return transformTransactions(result);
  }

  async #getCandlesticks(pair: string, type: CandlestickType, page: string): Promise<Candlestick[]> {
    const url = `${this.#baseUrl}/${pair}/candlestick/${type}/${page}`;
    const result = await axios.get<ApiResponse<GetCandlesticksDataResponseData>>(url).then(responseHandler);

    return transformCandlesticks(result);
  }
}
