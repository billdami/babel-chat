import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';

import Button from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import DialogConfirm from '../../../../../components/DialogConfirm';
import Icon from '../../../../../components/Icon';
import Spinner from '../../../../../components/Spinner';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import { ChatRecord } from '../../../../../types/chat';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { blockUser } from '../../../../../utils/user';
import { ChatRouteParams } from '../../../Chat';

import ListItem from './ListItem';

interface ChatsListProps {
  chats: ChatRecord[];
  isLoading: boolean;
}

const ChatsList: FC<ChatsListProps> = ({ chats, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const { user, updateUser } = useCurrentUser();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [confirmedChatIds, setConfirmedChatIds] = useState<string[]>([]);
  const [isConfirmBlockOpen, setIsConfirmBlockOpen] = useState<boolean>(false);

  const currentChatId = useMemo<string | undefined>(
    () =>
      (matchPath(location.pathname, { path: '/main/chat/:userId' })?.params as ChatRouteParams)
        ?.userId,
    [location.pathname]
  );

  const selectAllChats = useCallback(() => {
    setSelectedChatIds([...(chats.map((c) => c.id) ?? [])]);
  }, [chats]);

  const deselectAllChats = useCallback(() => {
    setSelectedChatIds([]);
  }, []);

  const onToggleAllChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      return event.target.checked ? selectAllChats() : deselectAllChats();
    },
    [selectAllChats, deselectAllChats]
  );

  const toggleChatSelection = useCallback(
    (chat: ChatRecord) => {
      if (selectedChatIds.includes(chat.id)) {
        setSelectedChatIds(selectedChatIds.filter((id) => id !== chat.id));
      } else {
        setSelectedChatIds([...selectedChatIds, chat.id]);
      }
    },
    [selectedChatIds]
  );

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
    deselectAllChats();
  }, [deselectAllChats]);

  const removeChats = useCallback(
    async (chatIds: string[]) => {
      try {
        const ops: Promise<any>[] = [];
        const chatRecs = chatIds.map((id) => chats.find((c) => c.id === id)).filter(Boolean);
        chatRecs.forEach((chat) => ops.push(chat!.ref?.remove().catch(() => {})));

        // if one of the removed chats is currently being viewed, navigate to the index
        if (currentChatId && chatIds.includes(currentChatId)) {
          history.push('/main');
        }

        await Promise.all(ops.filter(Boolean));
        deselectAllChats();
        updateUser({ dateLastActive: getFirebaseTimestamp() });
      } catch (err) {
        // TODO handle
      }
    },
    [chats, deselectAllChats, currentChatId, history, updateUser]
  );

  const markChatsRead = useCallback(
    async (chatIds: string[]) => {
      try {
        const ops: Promise<any>[] = [];
        const chatRecs = chatIds.map((id) => chats.find((c) => c.id === id)).filter(Boolean);
        const update = { dateLastSeen: getFirebaseTimestamp() };
        chatRecs.forEach((chat) => ops.push(chat!.ref?.update(update).catch(() => {})));
        await Promise.all(ops.filter(Boolean));
        deselectAllChats();
        updateUser({ dateLastActive: getFirebaseTimestamp() });
      } catch (err) {
        // TODO handle
      }
    },
    [chats, deselectAllChats, updateUser]
  );

  const blockUsers = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setIsConfirmBlockOpen(false);
      const ops: Promise<any>[] = [];
      const chatRecs = confirmedChatIds.map((id) => chats.find((c) => c.id === id)).filter(Boolean);
      chatRecs.forEach((chat) => ops.push(blockUser(user.id, chat!.id).catch(() => {})));
      await Promise.all(ops.filter(Boolean));
      await removeChats(confirmedChatIds);
      deselectAllChats();
      updateUser({ dateLastActive: getFirebaseTimestamp() });
    } catch (err) {
      // TODO handle
    }
  }, [confirmedChatIds, user, chats, deselectAllChats, removeChats, updateUser]);

  const confirmBlockUsers = useCallback((chatIds: string[]) => {
    setConfirmedChatIds(chatIds);
    setIsConfirmBlockOpen(true);
  }, []);

  const cancelBlockUsers = useCallback(() => {
    setConfirmedChatIds([]);
    setIsConfirmBlockOpen(false);
  }, []);

  // TODO apply sorting
  return (
    <div className="ChatsList pb-2">
      {(!!chats.length || isEditing) && (
        <div className="px-3 py-1 mb-1 bg-gray-200 shadow-inner">
          {isEditing ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Checkbox
                  onChange={onToggleAllChange}
                  checked={!!chats.length && selectedChatIds.length === chats.length}
                  isIndeterminate={
                    !!selectedChatIds.length && selectedChatIds.length !== chats.length
                  }
                  inputClassName="bg-white"
                  standalone
                />
                {!!selectedChatIds.length && (
                  <span className="inline-block px-2 ml-2 rounded-sm bg-gray-300 text-gray-600 text-sm font-bold">
                    {selectedChatIds.length}
                  </span>
                )}
              </div>

              <div className="flex">
                <div className="flex mr-1">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => markChatsRead(selectedChatIds)}
                    disabled={!selectedChatIds.length}
                    title="Mark as read"
                  >
                    <Icon name="message-check" size="sm" />
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => confirmBlockUsers(selectedChatIds)}
                    disabled={!selectedChatIds.length}
                    title="Block"
                  >
                    <Icon name="ban" size="sm" />
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => removeChats(selectedChatIds)}
                    disabled={!selectedChatIds.length}
                    title="Remove"
                  >
                    <Icon name="trash-can" size="sm" />
                  </Button>
                </div>
                <Button variant="link" size="sm" className="-mr-2" onClick={stopEditing}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button variant="link" size="sm" className="-mr-2" onClick={startEditing}>
                Edit chats
              </Button>
            </div>
          )}
        </div>
      )}
      <ul>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            chat={chat}
            selectedChatIds={selectedChatIds}
            isEditing={isEditing}
            toggleChatSelection={toggleChatSelection}
            markChatRead={markChatsRead}
            blockUser={confirmBlockUsers}
            removeChat={removeChats}
          />
        ))}
        {!chats.length && !isLoading && (
          <div className="px-3 py-8 text-gray-400 text-center text-sm">No chats found 😿</div>
        )}
        {isLoading && <Spinner className="mx-3 my-2" />}
      </ul>
      <DialogConfirm
        isOpen={isConfirmBlockOpen}
        onCancel={cancelBlockUsers}
        onConfirm={blockUsers}
        icon="ban"
        title={confirmedChatIds.length === 1 ? 'Block user' : 'Block users'}
        confirmText="Block"
        message={
          <>
            <div className="mb-4">
              {confirmedChatIds.length === 1
                ? 'Are you sure you want to block this user?'
                : 'Are you sure you want to block these users?'}
            </div>
            <div className="mb-4">
              You will no longer receive messages from (or be able to send messages to) them, until
              you unblock them.
            </div>
          </>
        }
      />
    </div>
  );
};

export default ChatsList;
