import { ChatSort } from '../types/chat';

export const MSG_MAX_LEN = 512;
export const MSG_PAGE_LIMIT = 10;
export const MSG_LOAD_MORE_BTN_HEIGHT = 54;
export const MSG_SCROLLED_UP_THRESHOLD = 16;
export const DEFAULT_CHAT_SORTS: ChatSort[] = [
  {
    property: 'nickname',
    isDescending: false,
  },
];
