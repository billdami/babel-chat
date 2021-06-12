import { useMemo, useState } from 'react';
import { DateTime, ToRelativeOptions } from 'luxon';

import { ACTIVE_TICK_INTERVAL } from '../constants/user';

import useInterval from './useInterval';

interface TimeDiffResult {
  diff: number;
  relativeTime: string;
  allowNow?: boolean;
  formatOptions?: ToRelativeOptions;
}

const justHappenedThreshold = 10000;
const oneMin = 60000;

export const getDiff = (
  toDate?: Date | null,
  fromDate?: Date,
  allowNow: boolean = true,
  formatOptions: ToRelativeOptions = { style: 'short' }
): TimeDiffResult => {
  const _toDate = toDate ? DateTime.fromJSDate(toDate) : null;
  const _fromDate = fromDate ? DateTime.fromJSDate(fromDate) : DateTime.now();
  const diff = _toDate?.diff(_fromDate).milliseconds ?? 0;
  const absDiff = Math.abs(diff);
  const relativeTime =
    allowNow && absDiff < justHappenedThreshold
      ? 'just now'
      : // strip unit abbrev periods from relative strings (e.g. "3 min." => "3 min")
      absDiff < oneMin
      ? '< a min ago'
      : _toDate?.toRelative(formatOptions)?.replace?.('.', '') ?? '';
  return { diff, relativeTime };
};

const useTimeDiff = (
  date?: Date | null,
  updateInterval = ACTIVE_TICK_INTERVAL,
  allowNow: boolean = true,
  formatOptions: ToRelativeOptions = { style: 'short' }
): TimeDiffResult => {
  const [curTime, setCurTime] = useState<Date>(new Date());

  const diff = useMemo<TimeDiffResult>(
    () => getDiff(date, curTime < new Date() ? new Date() : curTime, allowNow, formatOptions),
    [date, curTime, allowNow, formatOptions]
  );

  useInterval(() => setCurTime(new Date()), updateInterval);

  return diff;
};

export default useTimeDiff;
