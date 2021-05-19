import { Country } from './country';

export type Age = 'UNSPECIFIED' | number;

export enum Gender {
  UNSPECIFIED = 'UNSPECIFIED',
  FEMALE = 'FEMALE',
  MALE = 'MALE',
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
