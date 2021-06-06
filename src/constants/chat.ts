import { UserSort } from '../types/user';

export const MAX_MESSAGE_LEN = 512;
export const SCROLLED_UP_THRESHOLD = 16;
export const MAX_USER_FILTERS = 20;
export const DEFAULT_USER_SORTS: UserSort[] = [
  {
    property: 'country',
    isDescending: false,
  },
  {
    property: 'status',
    isDescending: false,
  },
];
