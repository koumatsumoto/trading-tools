import axios from "axios";
import { format } from "date-fns";
import { type Candlestick, type Transaction } from "../../base";
import { sortCandlesticksByTimeDesc, startTimeOfCandlestick } from "../util";
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
    count,
    end = new Date(),
  }: {
    pair: string;
    type: Candlestick["type"];
    count: number;
    end: Date | number;
  }): Promise<Candlestick[]> {
    const candlesticks: Candlestick[] = [];
    const endTime = startTimeOfCandlestick(type, end);
    let offset = 0;

    while (candlesticks.length <= count) {
      const fetched = await this.#getCandlesticks({ pair, type, page: getCandlestickPagingParam(type, offset, end) });
      candlesticks.unshift(...fetched.filter((c) => c.time <= endTime));
      offset++;
    }

    return sortCandlesticksByTimeDesc(candlesticks.slice(-count));
  }

  async #getCandlesticks({ pair, type, page }: { pair: string; type: Candlestick["type"]; page: string }): Promise<Candlestick[]> {
    const url = `${this.#baseUrl}/${pair}/candlestick/${type}/${page}`;
    const result = await axios.get<ApiResponse<GetCandlesticksDataResponseData>>(url).then(responseHandler);

    return transformCandlesticks(result, type);
  }
}
