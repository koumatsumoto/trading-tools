export const sortCandlesticksByTimeDesc = <T extends { time: number }>(data: T[]): T[] => {
  return data.sort(sortByTimeDesc);
};

function sortByTimeDesc<T extends { time: number }>(a: T, b: T): -1 | 0 | 1 {
  return a.time > b.time ? -1 : a.time == b.time ? 0 : 1;
}
