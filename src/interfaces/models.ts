export type CandlestickType =
  | "1min"
  | "5min"
  | "15min"
  | "30min"
  | "1hour"
  | "4hour"
  | "8hour"
  | "12hour"
  | "1day"
  | "1week"
  | "1month";

export type Candlestick = {
  type: CandlestickType;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
};

export type Transaction = {
  id: number;
  side: "buy" | "sell";
  price: number;
  amount: number;
  time: number;
};

export type Ticker = {
  sell: string;
  buy: string;
  open: string;
  high: string;
  low: string;
  last: string;
  vol: string;
  time: number;
};

export type Depth = {
  asks: [Price: string, Amount: string][];
  bids: [Price: string, Amount: string][];
  time: number;
};
