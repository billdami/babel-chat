import React, { FC } from 'react';
import cn from 'classnames';

import { MenuContentProps } from '../../../../../../components/Menu';
import { User } from '../../../../../../types/user';
import UserAvatar from '../../../../../../components/UserAvatar';
import UserNickname from '../../../../../../components/UserNickname';
import UserDetails from '../../../../../../components/UserDetails';
import Button from '../../../../../../components/Button';
import Icon from '../../../../../../components/Icon';
import MenuItem from '../../../../../../components/Menu/MenuItem';

export interface ActionsMenuProps extends MenuContentProps {
  user?: User;
  isPinned?: boolean;
  isBlocked?: boolean;
  canRemove?: boolean;
  canBlock?: boolean;
  canReportSpam?: boolean;
  closeChat?: () => void;
  removeChat?: () => void;
  toggleChatPinned?: () => void;
  confirmToggleBlock?: () => void;
  confirmReporSpam?: () => void;
  closeMenu?: () => void;
}

const ActionsMenu: FC<ActionsMenuProps> = ({
  isSheet,
  user,
  isPinned,
  isBlocked,
  canRemove,
  canBlock,
  canReportSpam,
  closeChat,
  removeChat,
  toggleChatPinned,
  confirmToggleBlock,
  confirmReporSpam,
  closeMenu,
}) => (
  <>
    <div
      className={cn(
        'flex items-start justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-500 dark:border-opacity-40',
        {
          'px-4 max-w-72': !isSheet,
        }
      )}
    >
      <div className="flex items-center min-w-0">
        <UserAvatar user={user} className="flex-shrink-0 mr-2 border border-gray-200" />
        <div className="min-w-0">
          <UserNickname
            user={user}
            className="text-gray-800 dark:text-gray-300"
            mutedClassName="dark:text-gray-400"
          />
          <UserDetails user={user} className="text-gray-400" shortCountry />
        </div>
      </div>
      {isSheet && (
        <Button size="sm" variant="muted" className="flex-shrink-0" onClick={closeMenu} outline>
          <Icon name="x-mark" size="sm" />
        </Button>
      )}
    </div>
    <MenuItem isSheet={isSheet} onClick={toggleChatPinned}>
      <Icon
        name="thumbtack"
        size="sm"
        className={cn('inline-block text-gray-400', {
          'mr-2': !isSheet,
          'mr-3': isSheet,
          'text-opacity-50': isPinned,
        })}
      />
      {isPinned ? 'Unpin chat' : 'Pin chat'}
    </MenuItem>
    <MenuItem isSheet={isSheet} onClick={removeChat} disabled={!canRemove}>
      <Icon
        name="trash-can"
        size="sm"
        className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
      Remove from list
    </MenuItem>
    <MenuItem isSheet={isSheet} onClick={confirmToggleBlock} disabled={!canBlock}>
      <Icon
        name="ban"
        size="sm"
        className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
      {isBlocked ? 'Unblock user' : 'Block user'}
    </MenuItem>
    <MenuItem isSheet={isSheet} onClick={confirmReporSpam} disabled={!canReportSpam}>
      <Icon
        name="octagon-exclamation"
        size="sm"
        className={cn('inline-block text-red-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
      />
      Report spam
    </MenuItem>
    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-500 dark:border-opacity-40">
      <MenuItem isSheet={isSheet} onClick={closeChat}>
        <Icon
          name="x-mark"
          size="sm"
          className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
        />
        Close chat
      </MenuItem>
    </div>
  </>
);

export default ActionsMenu;
