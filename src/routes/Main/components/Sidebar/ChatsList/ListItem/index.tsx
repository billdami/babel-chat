import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import Badge from '../../../../../../components/Badge';
import Checkbox from '../../../../../../components/Checkbox';
import UserAvatar from '../../../../../../components/UserAvatar';
import UserNickname from '../../../../../../components/UserNickname';
import useDrawer from '../../../../../../hooks/useDrawer';
import { ChatRecord } from '../../../../../../types/chat';

interface ListItemProps {
  chat: ChatRecord;
  selectedChatIds: string[];
  isEditing: boolean;
  toggleChatSelection: (chat: ChatRecord) => void;
}

const ListItem: FC<ListItemProps> = ({ chat, selectedChatIds, isEditing, toggleChatSelection }) => {
  const { closeDrawer } = useDrawer();

  return (
    <li>
      <NavLink
        className="block
          w-full
          px-3 py-1
          text-left
          hover:bg-opacity-50 hover:bg-gray-200
          focus:outline-none
          focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
        activeClassName="bg-gray-200 hover:bg-opacity-100"
        to={`/main/chat/${chat.id}`}
        onClick={closeDrawer}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            {isEditing && (
              <Checkbox
                checked={selectedChatIds.includes(chat.id)}
                onChange={() => toggleChatSelection(chat)}
                onClick={(event) => event.stopPropagation()}
                className="mr-2"
                standalone
              />
            )}
            <div className="flex items-center min-w-0">
              <UserAvatar user={chat.toUserDetails} size={20} className="flex-shrink-0 mr-2" />
              <UserNickname user={chat.toUserDetails} className="text-gray-800" />
            </div>
          </div>
          {(!chat.dateLastSeen || chat.dateLastSeen < chat.dateLastMessage) && (
            <Badge
              className="flex-shrink-0 ml-1"
              tooltip="There are unread message(s)"
              size="md"
              pulse={false}
            />
          )}
          {/* TODO on mouseEnter/Leave toggle "..." actions menu on desktop  */}
        </div>
      </NavLink>
    </li>
  );
};

export default ListItem;
