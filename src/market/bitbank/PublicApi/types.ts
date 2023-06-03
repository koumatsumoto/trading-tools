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
  transactions: {
    transaction_id: number;
    side: "sell" | "buy";
    price: string;
    amount: string;
    executed_at: number;
  }[];
};

export type GetCandlesticksDataResponseData = {
  candlestick: [
    {
      type: string;
      ohlcv: [string, string, string, string, string, number][];
    }
  ];
  timestamp: number;
};
