import { Country, CountryOption } from '../types/country';

export const COUNTRIES: CountryOption[] = [
  {
    value: Country.UNSPECIFIED,
    label: 'Prefer not to say',
  },
  {
    value: Country.USA,
    label: 'United States',
  },
  // TODO add remaining countries
];
