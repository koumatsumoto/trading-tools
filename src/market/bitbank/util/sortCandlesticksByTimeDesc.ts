export const sortCandlesticksByTimeDesc = <T extends { time: number }>(data: T[]): T[] => {
  return data.sort((a, b) => (a.time > b.time ? -1 : 1));
};
