import React, { FC } from 'react';
import cn from 'classnames';

import Button from '../../../../../components/Button';
import DarkModeToggle from '../../../../../components/DarkModeToggle';
import Icon from '../../../../../components/Icon';
import UserAvatar from '../../../../../components/UserAvatar';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import { MenuContentProps } from '../../../../../components/Menu';
import MenuItem from '../../../../../components/Menu/MenuItem';
import { User } from '../../../../../types/user';

export interface UserMenuProps extends MenuContentProps {
  user?: User | null;
  openConfirmSignOut?: () => void;
  openGiveFeedback?: () => void;
  closeMenu?: () => void;
}

const UserMenu: FC<UserMenuProps> = ({
  isSheet,
  user,
  openConfirmSignOut,
  openGiveFeedback,
  closeMenu,
}) => {
  return (
    <>
      <div
        className={cn('flex items-start justify-between pb-2 mb-2 border-b border-gray-100', {
          'px-4': !isSheet,
        })}
      >
        <div className="flex items-center min-w-0">
          <UserAvatar user={user} className="flex-shrink-0 mr-2 border border-gray-200" />
          <div className="min-w-0">
            <UserNickname user={user} className="text-gray-800" />
            <UserDetails user={user} className="text-gray-400" shortCountry />
          </div>
        </div>
        {isSheet && (
          <Button size="sm" variant="muted" className="flex-shrink-0" onClick={closeMenu} outline>
            <Icon name="x-mark" size="sm" />
          </Button>
        )}
      </div>
      <MenuItem onClick={openGiveFeedback} isSheet={isSheet}>
        <Icon
          name="message-pen"
          size="sm"
          className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
        />
        Give us feedback
      </MenuItem>
      <MenuItem onClick={openConfirmSignOut} isSheet={isSheet}>
        <Icon
          name="right-from-bracket"
          size="sm"
          className={cn('inline-block text-gray-400', { 'mr-2': !isSheet, 'mr-3': isSheet })}
        />
        Sign out
      </MenuItem>
      <div className="px-4 py-1 mt-1 border-t border-gray-100">
        <DarkModeToggle className="text-gray-600" />
        {/* TODO show "Use device default theme" link when localStorage has a value, to clear it */}
      </div>
      {/* TODO [future] mute sounds toggle */}
      {/* TODO [future] avatar editor */}
    </>
  );
};

export default UserMenu;
