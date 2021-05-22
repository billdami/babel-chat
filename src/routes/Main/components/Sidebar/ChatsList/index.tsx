import React, { FC } from 'react';

import { Chat } from '../../../../../types/chat';
import { NavLink } from 'react-router-dom';
import { Val } from 'react-firebase-hooks/database/dist/database/types';

interface ChatsListProps {
  chats?: Val<Chat, 'id', 'ref'>[];
  isLoading: boolean;
}

const ChatsList: FC<ChatsListProps> = ({ chats, isLoading }) => {
  // TODO apply sorting
  return (
    <div className="ChatsList py-2">
      <ul>
        {chats?.map((chat) => (
          <li key={chat.id}>
            <NavLink
              className="block w-full px-3 py-1 text-left hover:bg-opacity-50 hover:bg-gray-200"
              activeClassName="bg-gray-200 hover:bg-opacity-100"
              to={`/main/chat/${chat.toUser}`}
            >
              <div>
                {/* TODO create <UserNickname> to format/display user nickname */}
                <span className="font-bold text-gray-800">{chat.toUserDetails.nickname}</span>
                <span className="text-gray-400 font-light tracking-tighter">
                  #{chat.toUserDetails.uuid}
                </span>
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
