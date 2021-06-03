import { Gender, GenderOption, Status, StatusOption, User } from '../types/user';
import { Country } from '../types/country';

export const MIN_AGE = 18;
export const MAX_AGE = 120;
export const MIN_NICKNAME_LEN = 2;
export const MAX_NICKNAME_LEN = 32;
export const UNSPECIFIED = 'UNSPECIFIED';
export const SYSTEM_ID = 'SYSTEM_USER';
export const STATUS_THRESHOLD_IDLE = 1200000; // 20min
export const STATUS_THRESHOLD_AWAY = 3600000; // 1hr
export const ACTIVE_TICK_INTERVAL = 10000; // 10sec

export const SYSTEM_USER_DETAILS: User = {
  id: SYSTEM_ID,
  uuid: 0,
  nickname: 'System',
  country: Country.UNSPECIFIED,
  age: UNSPECIFIED,
  gender: Gender.UNSPECIFIED,
  agreedToToS: true,
  dateSignedIn: new Date(),
  dateLastActive: new Date(),
};

export const GENDERS: GenderOption[] = [
  {
    value: Gender.UNSPECIFIED,
    label: 'Unspecified',
  },
  {
    value: Gender.FEMALE,
    label: 'Female',
  },
  {
    value: Gender.MALE,
    label: 'Male',
  },
];

export const STATUSES: StatusOption[] = [
  {
    value: Status.ACTIVE,
    label: 'Active',
    bgColor: 'bg-green-400',
    borderColor: 'border-white',
  },
  {
    value: Status.IDLE,
    label: 'Idle',
    bgColor: 'bg-yellow-400',
    borderColor: 'border-white',
  },
  {
    value: Status.AWAY,
    label: 'Away',
    bgColor: 'bg-gray-400',
    borderColor: 'border-white',
  },
  {
    value: Status.OFFLINE,
    label: 'Offline',
    bgColor: 'bg-red-400',
    borderColor: 'border-white',
  },
];
