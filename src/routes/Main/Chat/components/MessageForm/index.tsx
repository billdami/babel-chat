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

import { ChatRouteParams } from '../..';
import Button from '../../../../../components/Button';
import Icon from '../../../../../components/Icon';
import Input from '../../../../../components/Input';
import { MAX_MESSAGE_LEN } from '../../../../../constants/chat';
import useIsMobile from '../../../../../hooks/useIsMobile';

interface MessageFormProps {
  canSend: boolean;
  onSubmit: (message: string) => void;
}

const MessageForm: FC<MessageFormProps> = ({ canSend, onSubmit }) => {
  const { userId } = useParams<ChatRouteParams>();
  const isMobile = useIsMobile();

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

      if (!isMobile) {
        newMessageInput.current?.focus();
      }
    },
    [isFormEnabled, newMessage, onSubmit, isMobile]
  );

  useLayoutEffect(() => {
    // when transitioning to a chat, focus the input
    // TODO should this happen on mobile?
    setTimeout(() => newMessageInput.current?.focus(), 100);
  }, [userId]);

  return (
    <form
      className="flex-shrink-0 flex py-2 px-2 md:px-4 border-t border-gray-200"
      onSubmit={onMessageSubmit}
    >
      {/* TODO allow input to be focused and visible without the entire document being shifted up */}
      <Input
        type="text"
        className="flex-1 mr-3"
        placeholder="Type a message..."
        id="signup-nickname"
        autoComplete="off"
        value={newMessage}
        onChange={onNewMessageChange}
        ref={newMessageInput}
        maxLength={MAX_MESSAGE_LEN}
        disabled={!canSend}
      />
      <Button type="submit" className="md:w-24" disabled={!isFormEnabled}>
        {isMobile ? <Icon name="arrow-up" size="sm" className="inline-block" /> : 'Send'}
      </Button>
    </form>
  );
};

export default MessageForm;
