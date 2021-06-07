import { ChatSort } from '../types/chat';

export const MAX_MESSAGE_LEN = 512;
export const SCROLLED_UP_THRESHOLD = 16;
export const DEFAULT_CHAT_SORTS: ChatSort[] = [
  {
    property: 'nickname',
    isDescending: false,
  },
];
