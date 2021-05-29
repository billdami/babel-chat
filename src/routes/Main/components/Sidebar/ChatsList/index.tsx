import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';

import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import Spinner from '../../../../../components/Spinner';
import UserNickname from '../../../../../components/UserNickname';
import useDrawer from '../../../../../hooks/useDrawer';
import { ChatRecord } from '../../../../../types/chat';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';

interface ChatsListProps {
  chats?: ChatRecord[];
  isLoading: boolean;
}

const ChatsList: FC<ChatsListProps> = ({ chats, isLoading }) => {
  const { closeDrawer } = useDrawer();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedChats, setSelectedChats] = useState<ChatRecord[]>([]);

  const selectAllChats = useCallback(() => {
    setSelectedChats([...(chats ?? [])]);
  }, [chats]);

  const deselectAllChats = useCallback(() => {
    setSelectedChats([]);
  }, []);

  const onToggleAllChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // TODO handle indeterminate / partial selection
      return event.target.checked ? selectAllChats() : deselectAllChats();
    },
    [selectAllChats, deselectAllChats]
  );

  const toggleChatSelection = useCallback((chat: ChatRecord) => {}, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
    deselectAllChats();
  }, [deselectAllChats]);

  const removeChats = useCallback(async () => {
    try {
      const ops: Promise<any>[] = [];
      selectedChats.forEach((chat) => ops.push(chat.ref?.remove().catch(() => {})));
      await Promise.all(ops.filter(Boolean));
    } catch (err) {
      // TODO handle
    }
  }, [selectedChats]);

  const markChatsRead = useCallback(async () => {
    try {
      const update = { dateLastSeen: getFirebaseTimestamp() };
      const ops: Promise<any>[] = [];
      selectedChats.forEach((chat) => ops.push(chat.ref?.update(update).catch(() => {})));
      await Promise.all(ops.filter(Boolean));
    } catch (err) {
      // TODO handle
    }
  }, [selectedChats]);

  // TODO apply sorting
  return (
    <div className="ChatsList py-2">
      {!!chats?.length && (
        <>
          {isEditing ? (
            <div>
              <div className="flex justify-between px-3 mb-2">
                <Button variant="link" size="sm" className="-ml-3" onClick={stopEditing}>
                  Cancel
                </Button>
                <div className="flex">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={removeChats}
                    disabled={!selectedChats.length}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={markChatsRead}
                    disabled={!selectedChats.length}
                  >
                    Mark read
                  </Button>
                </div>
              </div>
              <div className="px-3 mb-1 pb-2 border-b border-gray-200 flex items-center">
                <Checkbox
                  onChange={onToggleAllChange}
                  checked={selectedChats.length === chats?.length}
                  className="mr-2"
                  standalone
                />
                <span className="text-sm text-gray-600">
                  <span className="font-bold">{selectedChats.length}</span>{' '}
                  {/* create pluralize() util for this */}
                  {selectedChats.length === 1 ? 'chat' : 'chats'} selected
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between px-3 mb-2">
              <Button variant="link" size="sm" className="-ml-3" onClick={startEditing}>
                Edit chats
              </Button>
            </div>
          )}
        </>
      )}
      <ul>
        {chats?.map((chat) => (
          // TODO create <ChatListItem />
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
              to={`/main/chat/${chat.id}`}
              onClick={closeDrawer}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isEditing && (
                    <Checkbox
                      checked={selectedChats.includes(chat)}
                      onChange={() => toggleChatSelection(chat)}
                      onClick={(event) => event.stopPropagation()}
                      className="mr-2"
                      standalone
                    />
                  )}
                  <UserNickname user={chat.toUserDetails} className="text-gray-800" />
                </div>
                {(!chat.dateLastSeen || chat.dateLastSeen < chat.dateLastMessage) && (
                  <Badge
                    className=""
                    tooltip="There are unread message(s)"
                    size="md"
                    pulse={false}
                  />
                )}
              </div>
            </NavLink>
          </li>
        ))}
        {isLoading && <Spinner className="mx-3 my-2" />}
      </ul>
    </div>
  );
};

export default ChatsList;
