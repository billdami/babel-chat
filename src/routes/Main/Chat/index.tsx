import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

interface ChatRouteParams {
  chatId: string;
}

interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  const { chatId } = useParams<ChatRouteParams>();

  return <div className="Chat">chat id: {chatId}</div>;
};

export default Chat;
