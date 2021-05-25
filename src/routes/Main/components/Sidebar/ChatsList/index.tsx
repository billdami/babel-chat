import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import Badge from '../../../../../components/Badge';
import UserNickname from '../../../../../components/UserNickname';
import useDrawer from '../../../../../hooks/useDrawer';
import { ChatRecord } from '../../../../../types/chat';

interface ChatsListProps {
  chats?: ChatRecord[];
  isLoading: boolean;
}

const ChatsList: FC<ChatsListProps> = ({ chats, isLoading }) => {
  const { closeDrawer } = useDrawer();

  // TODO apply sorting
  return (
    <div className="ChatsList py-2">
      <ul>
        {chats?.map((chat) => (
          <li key={chat.id}>
            <NavLink
              className="block
                w-full
                px-3 py-1
                text-left
                hover:bg-opacity-50 hover:bg-gray-200
                focus:outline-none
                focus:ring-inset focus:ring-2 focus:ring-opacity-50 focus:ring-green-300"
              activeClassName="bg-gray-200 hover:bg-opacity-100"
              to={`/main/chat/${chat.toUser}`}
              onClick={closeDrawer}
            >
              <div className="relative pl-4">
                {chat.dateLastSeen < chat.dateLastMessage && (
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Badge
                      className=""
                      tooltip="There are unread message(s)"
                      size="sm"
                      pulse={false}
                      bordered
                    />
                  </div>
                )}
                <UserNickname user={chat.toUserDetails} className="text-gray-800" />
              </div>
            </NavLink>
          </li>
        ))}
        {isLoading && <div>Loading&hellip;</div>}
      </ul>
    </div>
  );
};

export default ChatsList;
