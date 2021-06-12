import React, { FC } from 'react';

import { ACTIVE_TICK_INTERVAL } from '../../constants/user';
import useTimeDiff from '../../hooks/useTimeDiff';

interface RelativeTimeProps {
  date?: Date | null;
  interval?: number;
}

const RelativeTime: FC<RelativeTimeProps> = ({ date, interval = ACTIVE_TICK_INTERVAL }) => {
  const { relativeTime } = useTimeDiff(date, interval);
  return <>{relativeTime}</>;
};

export default RelativeTime;
