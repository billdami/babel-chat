import { Gender, User } from '../types/user';

import { Country } from '../types/country';

export const MIN_AGE = 18;
export const MAX_AGE = 120;
export const MIN_NICKNAME_LEN = 2;
export const MAX_NICKNAME_LEN = 32;
export const SYSTEM_ID = 'SYSTEM_USER';
export const SYSTEM_USER_DETAILS: User = {
  id: SYSTEM_ID,
  uuid: 0,
  nickname: 'System',
  country: Country.UNSPECIFIED,
  age: 'UNSPECIFIED',
  gender: Gender.UNSPECIFIED,
  agreedToToS: true,
  dateSignedIn: new Date(),
  dateLastActive: new Date(),
};
