import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Button from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import DialogConfirm from '../../../../../components/DialogConfirm';
import Icon from '../../../../../components/Icon';
import Menu from '../../../../../components/Menu';
import Spinner from '../../../../../components/Spinner';
import { DEFAULT_CHAT_SORTS } from '../../../../../constants/chat';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import { ChatRecord, ChatSort } from '../../../../../types/chat';
import { sortChatRecords } from '../../../../../utils/chat';
import { getFirebaseTimestamp } from '../../../../../utils/firebase';
import { blockUser } from '../../../../../utils/user';
import { ChatRouteParams } from '../../../Chat';

import ListItem from './ListItem';
import SortMenu, { SortMenuProps } from './SortMenu';

interface ChatsListProps {
  chats: ChatRecord[];
  isLoading: boolean;
}

const ChatsList: FC<ChatsListProps> = ({ chats, isLoading }) => {
  const history = useHistory();
  const location = useLocation();
  const { user, updateUser } = useCurrentUser();

  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [sorts, setSorts] = useState<ChatSort[]>(DEFAULT_CHAT_SORTS);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [confirmedChatIds, setConfirmedChatIds] = useState<string[]>([]);
  const [isConfirmBlockOpen, setIsConfirmBlockOpen] = useState<boolean>(false);

  const [debouncedSorts] = useDebounce<ChatSort[]>(sorts, 250);

  const sortedChats = useMemo<ChatRecord[]>(() => {
    const _sorts = debouncedSorts.filter((s) => !!s.property);
    return _sorts.length ? chats.sort((a, b) => sortChatRecords(a, b, _sorts)) : chats;
  }, [chats, debouncedSorts]);

  const currentChatId = useMemo<string | undefined>(
    () =>
      (matchPath(location.pathname, { path: '/main/chat/:userId' })?.params as ChatRouteParams)
        ?.userId,
    [location.pathname]
  );

  const closeSortMenu = useCallback(() => setIsSortMenuOpen(false), []);

  const updateSort = useCallback(
    (sort: ChatSort, updates: Partial<ChatSort>) => {
      setSorts(sorts.map((s) => (s === sort ? { ...sort, ...updates } : s)));
    },
    [sorts]
  );

  const sortMenuProps = useMemo<SortMenuProps>(
    () => ({ sorts, updateSort, closeSortMenu }),
    [sorts, updateSort, closeSortMenu]
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

  return (
    <div className="pb-2">
      {(!!sortedChats.length || isEditing) && (
        <div className="px-3 py-2 mb-1 bg-gray-200 bg-opacity-70">
          {isEditing ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Checkbox
                  onChange={onToggleAllChange}
                  checked={!!sortedChats.length && selectedChatIds.length === sortedChats.length}
                  isIndeterminate={
                    !!selectedChatIds.length && selectedChatIds.length !== sortedChats.length
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
                    variant="muted"
                    size="sm"
                    onClick={() => markChatsRead(selectedChatIds)}
                    disabled={!selectedChatIds.length}
                    title="Mark as read"
                  >
                    <Icon name="message-check" size="sm" />
                  </Button>
                  <Button
                    variant="muted"
                    size="sm"
                    className="ml-1"
                    onClick={() => confirmBlockUsers(selectedChatIds)}
                    disabled={!selectedChatIds.length}
                    title="Block"
                  >
                    <Icon name="ban" size="sm" />
                  </Button>
                  <Button
                    variant="muted"
                    size="sm"
                    className="ml-1"
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
            <div className="flex justify-between">
              <Menu<SortMenuProps>
                isOpen={isSortMenuOpen}
                content={SortMenu}
                contentProps={sortMenuProps}
                onOutsideClick={closeSortMenu}
                menuClassName="py-2 text-sm"
                sheetClassName="py-2 text-sm"
                triggerClassName="ml-1"
                placement="bottom-start"
                trigger={
                  <Button
                    size="sm"
                    variant="muted"
                    title="Sort"
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    isActive={isSortMenuOpen}
                    aria-expanded={isSortMenuOpen}
                    aria-haspopup={true}
                  >
                    <Icon name="arrow-down-a-z" size="sm" className="inline" />
                  </Button>
                }
              />
              <Button variant="link" size="sm" className="-mr-2" onClick={startEditing}>
                Edit chats
              </Button>
            </div>
          )}
        </div>
      )}
      <ul>
        {sortedChats.map((chat) => (
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
        {!sortedChats.length && !isLoading && (
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
                : `Are you sure you want to block thes ${confirmedChatIds.length} users?`}
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
