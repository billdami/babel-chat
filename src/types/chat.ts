import { User } from './user';

export interface Chat {
  id: string;
  user: string;
  toUser: string;
  startedByUser: string;
  toUserDetails: User;
  hasMessages: boolean;
  isTyping: boolean;
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
