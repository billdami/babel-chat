import React, { FC, MouseEvent as ReactMouseEvent, useCallback } from 'react';
import cn from 'classnames';

import Button from '../../../../../components/Button';
import DarkModeToggle from '../../../../../components/DarkModeToggle';
import Icon from '../../../../../components/Icon';
import UserAvatar from '../../../../../components/UserAvatar';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import { MenuContentProps } from '../../../../../components/Menu';
import MenuItem from '../../../../../components/Menu/MenuItem';
import MuteToggle from '../../../../../components/MuteToggle';
import useTheme from '../../../../../hooks/useTheme';
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
  const { hasLocalThemePref, clearThemePref } = useTheme();

  const handleClearTheme = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      clearThemePref();
    },
    [clearThemePref]
  );

  return (
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
      <div
        className={cn(
          'pt-2 mt-1 border-t border-gray-100 dark:border-gray-500 dark:border-opacity-40',
          { 'px-4': !isSheet }
        )}
      >
        {/* TODO [future] avatar editor */}
        <div className="flex items-center mb-2">
          <label htmlFor="user-menu-mute-toggle" className="text-gray-600 dark:text-gray-300 mr-4">
            Mute
          </label>
          <MuteToggle
            className="ml-auto text-gray-500 dark:text-gray-300"
            buttonId="user-menu-mute-toggle"
          />
        </div>
        <div className="flex items-center">
          <label
            htmlFor="user-menu-dark-mode-toggle"
            className="text-gray-600 dark:text-gray-300 mr-4"
          >
            Dark mode
          </label>
          <DarkModeToggle
            className="ml-auto text-gray-500 dark:text-yellow-300"
            buttonId="user-menu-dark-mode-toggle"
          />
        </div>
        {hasLocalThemePref && (
          <div>
            <Button variant="link" size="xs" className="-ml-1" onClick={handleClearTheme}>
              Use device default theme
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserMenu;
