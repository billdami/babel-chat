import React, { ChangeEvent, FC, FormEvent, useCallback, useMemo, useRef, useState } from 'react';

import Button from '../../../../../components/Button';
import { MAX_MESSAGE_LEN } from '../../../../../constants/chat';

interface MessageFormProps {
  canSend: boolean;
  onSubmit: (message: string) => void;
}

const MessageForm: FC<MessageFormProps> = ({ canSend, onSubmit }) => {
  const [newMessage, setNewMessage] = useState<string>('');

  const newMessageInput = useRef<HTMLInputElement>(null);

  const isFormEnabled = useMemo(
    () => canSend && newMessage?.trim().length > 0 && newMessage?.trim().length <= MAX_MESSAGE_LEN,
    [canSend, newMessage]
  );

  const onNewMessageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  }, []);

  const onMessageSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (!isFormEnabled) {
        return;
      }

      onSubmit(newMessage.trim());
      setNewMessage('');
      newMessageInput.current?.focus();
    },
    [isFormEnabled, newMessage, onSubmit]
  );

  return (
    <form
      className="flex-shrink-0 flex py-2 px-4 border-t border-gray-200"
      onSubmit={onMessageSubmit}
    >
      <input
        type="text"
        className="block flex-1 px-3 py-1 mr-3 rounded-sm border border-gray-300 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
        placeholder="Type a message..."
        id="signup-nickname"
        autoComplete="off"
        value={newMessage}
        onChange={onNewMessageChange}
        ref={newMessageInput}
        maxLength={MAX_MESSAGE_LEN}
        disabled={!canSend}
      />
      <Button type="submit" className="w-24" disabled={!isFormEnabled}>
        Send
      </Button>
    </form>
  );
};

export default MessageForm;
