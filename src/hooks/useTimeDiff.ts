import { useState } from 'react';
import { DateTime } from 'luxon';

import useInterval from './useInterval';

interface TimeDiffResult {
  diff: number;
  relativeTime: string;
}

export const getDiff = (date?: Date | null): TimeDiffResult => {
  const d = date ? DateTime.fromJSDate(date) : null;
  return {
    diff: d?.diffNow().milliseconds ?? 0,
    relativeTime: d?.toRelative() ?? '',
  };
};

const useTimeDiff = (date?: Date | null, updateInterval = 10000): TimeDiffResult => {
  const [diff, setDiff] = useState<TimeDiffResult>(getDiff(date));
  useInterval(() => setDiff(getDiff(date)), updateInterval);
  return diff;
};

export default useTimeDiff;
