import { Val } from 'react-firebase-hooks/database/dist/database/types';

import { User } from './user';

export interface Chat {
  id: string;
  startedByUser: string;
  toUserDetails: User;
  isPinned: boolean;
  isTyping: boolean;
  hasMessagesFromOtherUser: boolean;
  dateStarted: Date;
  dateLastSeen: Date;
  dateLastMessage: Date;
}

export interface ChatMessage {
  id: string;
  dateSent: Date;
  author: string;
  isSystem: boolean;
  content: string;
}

export type ChatRecord = Val<Chat, 'id', 'ref'>;
export type ChatMessageRecord = Val<ChatMessage, 'id', 'ref'>;
