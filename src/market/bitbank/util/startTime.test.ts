import { expect, test } from "vitest";
import { getStartTimeOf1Second } from "./startTime";

test("getStartTimeOf1Second", () => {
  expect(getStartTimeOf1Second(new Date("2023-08-27T00:00:00.000Z").getTime())).toBe(1693094400000);
  expect(getStartTimeOf1Second(new Date("2023-08-27T00:00:00.999Z").getTime())).toBe(1693094400000);
  expect(getStartTimeOf1Second(new Date("2023-08-27T00:00:01.000Z").getTime())).toBe(1693094401000);
});
