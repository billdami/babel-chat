import React, { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/Button';
import Icon from '../../../../../components/Icon';
import Menu from '../../../../../components/Menu';
import UserAvatar from '../../../../../components/UserAvatar';
import UserDetails from '../../../../../components/UserDetails';
import UserNickname from '../../../../../components/UserNickname';
import UserStatus from '../../../../../components/UserStatus';
import useDrawer from '../../../../../hooks/useDrawer';
import useNotifications from '../../../../../hooks/useNotifications';
import { ChatRecord } from '../../../../../types/chat';
import { UserRecord } from '../../../../../types/user';

interface MessageHeaderProps {
  destUser?: UserRecord;
  originChat?: ChatRecord | null;
  isLoading?: boolean;
  isBlocked?: boolean;
}

const MessageHeader: FC<MessageHeaderProps> = ({ destUser, originChat, isLoading = false }) => {
  const history = useHistory();
  const { toggleDrawer } = useDrawer();
  const { numUnread } = useNotifications();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // use the main user record to display details, but fall back to the chat's copy (e.g. if they signed out)
  const isOffline = !destUser?.id;
  const user = isOffline ? originChat?.toUserDetails : destUser;
  const userDetailsExist = !!user?.nickname;

  const closeChat = useCallback(() => history.push('/main'), [history]);

  return (
    <div className="flex-shrink-0 flex justify-between items-center py-2 px-2 md:px-3 bg-green-500 text-white">
      <div className="flex items-center min-w-0">
        <Button
          onClick={toggleDrawer}
          variant="inverse"
          className="mr-2 md:hidden relative flex-shrink-0"
          outline
        >
          <Icon name="bars" size="sm" className="my-1" />
          {!!numUnread && (
            <Badge
              className="absolute -right-1 -top-1"
              tooltip={
                numUnread
                  ? `You have ${numUnread} ${numUnread === 1 ? 'chat' : 'chats'} with new messages!`
                  : ''
              }
            />
          )}
        </Button>
        {!isLoading &&
          (userDetailsExist ? (
            <div className="flex items-center min-w-0">
              <div className="hidden md:block relative flex-shrink-0 mr-2">
                <UserAvatar user={user} />
                <UserStatus user={user} className="absolute -top-1 -left-1 ml-px mt-px shadow" />
              </div>
              <div className="truncate">
                <div className="flex items-center">
                  <UserNickname
                    user={user}
                    isOffline={isOffline}
                    className="md:text-lg md:leading-5"
                    mutedClassName="text-green-200"
                  />
                  <UserStatus user={user} className="md:hidden ml-2 flex-shrink-0" />
                </div>
                <UserDetails user={user} className="text-xs md:text-sm leading-3 text-green-200" />
              </div>
            </div>
          ) : (
            <div className="min-w-0">
              <h2 className="truncate md:leading-5 font-bold text-yellow-200">User not found</h2>
              <h3 className="text-xs md:text-sm leading-3 text-green-200">
                This user no longer exists.
              </h3>
            </div>
          ))}
      </div>
      <div>
        <Menu
          isOpen={isMenuOpen}
          menuClassName="py-2 text-sm "
          onOutsideClick={() => setIsMenuOpen(false)}
          trigger={
            <Button
              variant="inverse"
              className="ml-2 flex-shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              outline
            >
              <span className="hidden md:inline mr-2 text-sm">Chat menu</span>
              <Icon name="ellipsis-vertical" size="sm" className="inline-block" />
            </Button>
          }
        >
          {/* TODO create <MenuItem> */}
          <button
            onClick={closeChat}
            type="button"
            className="flex items-center w-full px-4 py-1 text-left text-gray-600"
          >
            <Icon name="x-mark" size="sm" className="inline-block mr-2 text-gray-400" />
            Close chat
          </button>
          <button
            onClick={closeChat}
            type="button"
            className="flex items-center w-full px-4 py-1 text-left text-gray-600"
          >
            <Icon name="trash-can" size="sm" className="inline-block mr-2 text-gray-400" />
            Remove from list
          </button>
          <button
            onClick={closeChat}
            type="button"
            className="flex items-center w-full px-4 py-1 text-left text-gray-600"
          >
            <Icon name="ban" size="sm" className="inline-block mr-2 text-gray-400" />
            Block user
          </button>
          <button
            onClick={closeChat}
            type="button"
            className="flex items-center w-full px-4 py-1 text-left text-red-600"
          >
            <Icon name="octagon-exclamation" size="sm" className="inline-block mr-2 text-red-400" />
            Report spam
          </button>
        </Menu>
      </div>
    </div>
  );
};

export default MessageHeader;
