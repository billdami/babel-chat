import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import cn from 'classnames';

import { ChatRouteParams } from '../..';
import Button from '../../../../../components/Button';
import Input from '../../../../../components/Input';
import { MAX_MESSAGE_LEN } from '../../../../../constants/chat';

interface MessageFormProps {
  canSend: boolean;
  onSubmit: (message: string) => void;
}

const MessageForm: FC<MessageFormProps> = ({ canSend, onSubmit }) => {
  const { userId } = useParams<ChatRouteParams>();

  const [newMessage, setNewMessage] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const newMessageInput = useRef<HTMLInputElement>(null);

  const isFormEnabled = useMemo(
    () => canSend && newMessage?.trim().length > 0 && newMessage?.trim().length <= MAX_MESSAGE_LEN,
    [canSend, newMessage]
  );

  const onNewMessageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  }, []);

  const onInputFocus = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    // fixes issue with the document being pushed up out of view on iOS
    setIsInputFocused(true);
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }, 100);
  }, []);

  const onInputBlur = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsInputFocused(false);
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

  useLayoutEffect(() => {
    // when transitioning to a chat, focus the input
    // TODO should this happen on mobile?
    setTimeout(() => newMessageInput.current?.focus(), 100);
  }, [userId]);

  return (
    <form
      className={cn(
        'flex-shrink-0 flex py-2 px-2 md:px-4 bg-white border-t border-gray-200 md:static',
        {
          'fixed inset-x-0 bottom-0': isInputFocused,
        }
      )}
      onSubmit={onMessageSubmit}
    >
      <Input
        type="text"
        className="flex-1 mr-3"
        placeholder="Type a message..."
        id="signup-nickname"
        autoComplete="off"
        value={newMessage}
        onChange={onNewMessageChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={newMessageInput}
        maxLength={MAX_MESSAGE_LEN}
        disabled={!canSend}
      />
      <Button type="submit" className="w-24" disabled={!isFormEnabled}>
        {/* TODO make the send button an up arrow (or similar "send"-like) icon on mobile */}
        Send
      </Button>
    </form>
  );
};

export default MessageForm;
