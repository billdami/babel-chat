import cn from 'classnames';
import React, { FC } from 'react';

import Icon from '../Icon';
import { User } from '../../types/user';
import { getUserName } from '../../utils/user';

interface UserNicknameProps {
  className?: string;
  user?: User | null;
  isCurrentUser?: boolean;
  isOffline?: boolean;
  isBlocked?: boolean;
  mutedClassName?: string;
}

const UserNickname: FC<UserNicknameProps> = ({
  className = '',
  user,
  isCurrentUser = false,
  isOffline = false,
  isBlocked = false,
  mutedClassName = 'text-gray-400 dark:text-gray-500',
}) => (
  <h2 className={cn('truncate', className)}>
    <span
      className={cn({ 'line-through': isBlocked })}
      title={isBlocked ? `${getUserName(user)} is blocked` : ''}
    >
      <span className="font-bold">{user?.nickname}</span>
      {user?.uuid && (
        <span className={cn('tracking-tighter font-light', mutedClassName)}>#{user?.uuid}</span>
      )}
    </span>
    {isCurrentUser && (
      <span className={cn('ml-1 text-gray-500', mutedClassName)}>
        <Icon name="user" size="xs" className="inline-block" title="This is you!" />
      </span>
    )}
    {isOffline && <span className={cn('ml-1 text-xs italic', mutedClassName)}>(offline)</span>}
  </h2>
);

export default UserNickname;
