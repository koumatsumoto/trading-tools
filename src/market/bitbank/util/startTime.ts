export function getStartTimeOf1Second(timestamp: number): number {
  return timestamp - (timestamp % 1000);
}
