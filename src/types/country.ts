export enum Country {
  UNSPECIFIED = 'UNSPECIFIED',
  USA = 'USA',
  // TODO add all countries
}

export interface CountryOption {
  value: Country;
  label: string;
}
