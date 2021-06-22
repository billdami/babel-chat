import React, { ChangeEvent, FC, useCallback } from 'react';

import Button from '../../../../../../components/Button';
import Checkbox from '../../../../../../components/Checkbox';
import FormattedNumber from '../../../../../../components/FormattedNumber';
import Icon from '../../../../../../components/Icon';
import { ChatRecord } from '../../../../../../types/chat';

interface EditToolbarProps {
  sortedChats: ChatRecord[];
  selectedChatIds: string[];
  stopEditing: () => void;
  markChatsRead: (chatIds: string[]) => void;
  confirmBlockUsers: (chatIds: string[]) => void;
  removeChats: (chatIds: string[]) => void;
  selectAllChats: () => void;
  deselectAllChats: () => void;
}

const EditToolbar: FC<EditToolbarProps> = ({
  sortedChats,
  selectedChatIds,
  stopEditing,
  markChatsRead,
  confirmBlockUsers,
  removeChats,
  selectAllChats,
  deselectAllChats,
}) => {
  const onToggleAllChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      return event.target.checked ? selectAllChats() : deselectAllChats();
    },
    [selectAllChats, deselectAllChats]
  );

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Checkbox
          onChange={onToggleAllChange}
          checked={!!sortedChats.length && selectedChatIds.length === sortedChats.length}
          isIndeterminate={
            !!selectedChatIds.length && selectedChatIds.length !== sortedChats.length
          }
          inputClassName="bg-white dark:bg-transparent dark:checked:bg-green-500"
          standalone
        />
        {!!selectedChatIds.length && (
          <span className="inline-block px-2 ml-2 rounded-sm bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-bold">
            <FormattedNumber value={selectedChatIds.length} />
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
  );
};

export default EditToolbar;
