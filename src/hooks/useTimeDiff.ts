import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';

import { ACTIVE_TICK_INTERVAL } from '../constants/user';

import useInterval from './useInterval';

interface TimeDiffResult {
  diff: number;
  relativeTime: string;
}

export const getDiff = (toDate?: Date | null, fromDate?: Date): TimeDiffResult => {
  const _toDate = toDate ? DateTime.fromJSDate(toDate) : null;
  const _fromDate = fromDate ? DateTime.fromJSDate(fromDate) : DateTime.now();
  return {
    diff: _toDate?.diff(_fromDate).milliseconds ?? 0,
    relativeTime: _toDate?.toRelative() ?? '',
  };
};

const useTimeDiff = (date?: Date | null, updateInterval = ACTIVE_TICK_INTERVAL): TimeDiffResult => {
  const [curTime, setCurTime] = useState<Date>(new Date());

  const diff = useMemo<TimeDiffResult>(
    () => getDiff(date, curTime < new Date() ? new Date() : curTime),
    [date, curTime]
  );

  useInterval(() => setCurTime(new Date()), updateInterval);

  return diff;
};

export default useTimeDiff;
