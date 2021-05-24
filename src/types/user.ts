import { Val } from 'react-firebase-hooks/database/dist/database/types';

import { Country } from './country';

export type Age = 'UNSPECIFIED' | number;

export enum Status {
  ACTIVE = 'ACTIVE',
  IDLE = 'IDLE',
  AWAY = 'AWAY',
  OFFLINE = 'OFFLINE',
}

export interface StatusOption {
  value: Status;
  label: string;
  bgColor: string;
  borderColor: string;
}

export enum Gender {
  UNSPECIFIED = 'UNSPECIFIED',
  FEMALE = 'FEMALE',
  MALE = 'MALE',
}

export interface GenderOption {
  value: Gender;
  label: string;
}

export interface NewUserDetails {
  nickname: string;
  country: Country;
  age: Age;
  gender: Gender;
  agreedToToS: boolean;
}

export interface User {
  id: string;
  uuid: number;
  nickname: string;
  country: Country;
  age: Age;
  gender: Gender;
  agreedToToS: boolean;
  dateSignedIn: Date;
  dateLastActive: Date;
}

export type UserRecord = Val<User, 'id', 'ref'>;
