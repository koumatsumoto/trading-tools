import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  eachHourOfInterval,
  eachMinuteOfInterval,
  endOfHour,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfWeek,
  subMilliseconds,
} from "date-fns";
import { getTimezoneOffset } from "date-fns-tz";
import { match } from "ts-pattern";
import type { Candlestick } from "../../../interfaces";

export const startTimeOfCandlestick = (type: Candlestick["type"], time: number): number => {
  const date = match(type)
    .with("1min", () => startOfMinute(time))
    .with("5min", () => startOfOfMinutes(time, 5))
    .with("15min", () => startOfOfMinutes(time, 15))
    .with("30min", () => startOfOfMinutes(time, 30))
    .with("1hour", () => startOfHour(time))
    .with("4hour", () => startOfHoursOfUTC(time, 4))
    .with("8hour", () => startOfHoursOfUTC(time, 8))
    .with("12hour", () => startOfHoursOfUTC(time, 12))
    .with("1day", () => startOfDayOfUTC(time))
    .with("1week", () => startOfWeekOfUTC(time))
    .with("1month", () => startOfMonthOfUTC(time))
    .exhaustive();

  return date.getTime();
};

const getOffset = () => {
  return getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone);
};

const startOfOfMinutes = (time: number | Date, minutes: number) => {
  // 分足の場合はtimezoneを考慮しない（分単位のtimezone offsetがある地域の場合は問題があるが対象外）
  return eachMinuteOfInterval({ start: startOfHour(time), end: endOfHour(time) }, { step: minutes }).find(
    (s) => startOfMinute(time) < addMinutes(s, minutes)
  )!;
};

const startOfHoursOfUTC = (time: number | Date, hours: number) => {
  // 時間足の場合はtimezoneを考慮する必要がある
  // date-fnsのstartOfDay,endOfDayの値はtimezoneを適用した上での時刻になるため、UTCの00:00:00と23:59:59を取得するためにはoffsetを適用する
  return eachHourOfInterval({ start: startOfDayOfUTC(time), end: endOfDayOfUTC(time) }, { step: hours }).find((s) => {
    return time < addHours(s, hours);
  })!;
};

export const startOfDayOfUTC = (time: number | Date) => {
  // date-fnsのstartOfDayはtimezone上の00:00:00の時刻を返す。
  // キャンドルスティックの日足の時刻はUTCの00:00:00なので、offsetを適用して計算する必要がある。
  const offset = getOffset();
  const ofUTC = startOfDay(subMilliseconds(time, offset));
  return addMilliseconds(ofUTC, offset);
};

const endOfDayOfUTC = (time: number | Date) => {
  return subMilliseconds(addDays(startOfDayOfUTC(time), 1), 1);
};

const startOfWeekOfUTC = (time: number | Date) => {
  // bitbankの週足の基準は月曜日
  const offset = getOffset();
  const ofUTC = startOfWeek(subMilliseconds(time, offset), { weekStartsOn: 1 });
  return addMilliseconds(ofUTC, offset);
};

const startOfMonthOfUTC = (time: number | Date) => {
  const offset = getOffset();
  const ofUTC = startOfMonth(subMilliseconds(time, offset));
  return addMilliseconds(ofUTC, offset);
};
