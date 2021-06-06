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

export interface UserFirebaseRecord {
  id: string;
  uuid: number;
  nickname: string;
  country: Country;
  age: Age;
  gender: Gender;
  agreedToToS: boolean;
  dateSignedIn: Object;
  dateLastActive: Object;
}

export interface UserBlock {
  dateCreated: Date;
}

export interface UserSpamReport {
  dateCreated: Date;
}

export type UserRecord = Val<User, 'id', 'ref'>;
export type UserBlockRecord = Val<UserBlock, 'id', 'ref'>;
export type UserSpamReportRecord = Val<UserSpamReport, 'id', 'ref'>;

export type CountryFilterValue = Country | '' | undefined | null;
export type AgeFilterValue = Age | '' | undefined | null;
export type GenderFilterValue = Gender | '' | undefined | null;

export type UserSortProperty = 'status' | 'nickname' | 'country' | 'age' | 'gender' | '';
export type UserFilterProperty = 'nickname' | 'country' | 'age' | 'gender';

export interface UserSort {
  property?: UserSortProperty;
  isDescending: boolean;
}

export interface UserNicknameFilter {
  property: 'nickname';
  value: string;
}

export interface UserCountryFilter {
  property: 'country';
  value: CountryFilterValue;
}

export interface UserAgeFilter {
  property: 'age';
  value: [AgeFilterValue, AgeFilterValue];
}

export interface UserGenderFilter {
  property: 'gender';
  value: Gender;
}

export type UserFilter = UserNicknameFilter | UserCountryFilter | UserAgeFilter | UserGenderFilter;
