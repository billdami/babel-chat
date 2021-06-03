import cn from 'classnames';
import React, { FC, useMemo } from 'react';

import { STATUSES } from '../../constants/user';
import useTimeDiff from '../../hooks/useTimeDiff';
import { Status, StatusOption, User } from '../../types/user';
import { getStatus } from '../../utils/time';

interface UserStatusProps {
  className?: string;
  user?: User | null;
}

const statusMap = STATUSES.reduce(
  (prev, status) => ({ ...prev, [status.value]: status }),
  {} as any
);

const UserStatus: FC<UserStatusProps> = ({ className = '', user }) => {
  const lastActive = useTimeDiff(user?.dateLastActive);
  const status = useMemo<Status>(() => getStatus(lastActive.diff), [lastActive]);
  const statusInfo: StatusOption = statusMap[status];

  return (
    <span
      className={cn('w-2 h-2 rounded-full border transition-color', statusInfo.bgColor, className)}
      // TODO make this a popper.js tooltip
      title={`${statusInfo.label}${
        status !== Status.ACTIVE && lastActive.relativeTime
          ? ` (last seen ${lastActive.relativeTime.toLowerCase()})`
          : ''
      }`}
    ></span>
  );
};

export default UserStatus;
