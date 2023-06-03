export type ApiResponse<T> =
  | {
      success: 1;
      data: T;
    }
  | {
      success: 0;
      data: { code: number };
    };

export type GetTransactionsResponseData = {
  transactions: RawTransaction[];
};

export type GetCandlesticksDataResponseData = {
  candlestick: [
    {
      type: string;
      ohlcv: OHLCV[];
    }
  ];
  timestamp: number;
};

export type RawTransaction = {
  transaction_id: number;
  side: "sell" | "buy";
  price: string;
  amount: string;
  executed_at: number;
};
export type OHLCV = [Open: string, High: string, Low: string, Close: string, Volume: string, Timestamp: number];
