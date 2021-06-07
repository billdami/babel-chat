import React, { ChangeEvent, FC, useCallback } from 'react';

import Button from '../../../../../../../components/Button';
import Icon from '../../../../../../../components/Icon';
import Input from '../../../../../../../components/Input';
import Select, { SelectOption } from '../../../../../../../components/Select';
import { COUNTRIES } from '../../../../../../../constants/countries';
import { GENDERS, MAX_AGE, MIN_AGE, UNSPECIFIED } from '../../../../../../../constants/user';
import {
  UserAgeFilter,
  UserCountryFilter,
  UserFilter,
  UserFilterProperty,
  UserGenderFilter,
  UserNicknameFilter,
  CountryFilterValue,
  GenderFilterValue,
  AgeFilterValue,
} from '../../../../../../../types/user';

interface FilterItemProps {
  isOpen?: boolean;
  filter: UserFilter;
  update: (oldValue: UserFilter, newValue: UserFilter) => void;
  remove: (filter: UserFilter) => void;
}

interface FilterValueProps {
  filter: UserFilter;
  update: (oldValue: UserFilter, newValue: UserFilter) => void;
}

interface FilterValueCountryProps extends FilterValueProps {
  filter: UserCountryFilter;
}

interface FilterValueNicknameProps extends FilterValueProps {
  filter: UserNicknameFilter;
}

interface FilterValueGenderProps extends FilterValueProps {
  filter: UserGenderFilter;
}

interface FilterValueAgeProps extends FilterValueProps {
  filter: UserAgeFilter;
}

const filterTypeOptions: SelectOption<UserFilterProperty>[] = [
  { value: 'country', label: 'Country' },
  { value: 'nickname', label: 'Nickname' },
  { value: 'gender', label: 'Gender' },
  { value: 'age', label: 'Age' },
];

// useMemo() to create a "My Country" group at the top, if the user has a specified country
// TODO make "Frequently used" and "All" dividers into optgroups?
const countryOptions = [
  { value: '', label: 'Select country' },
  { value: UNSPECIFIED, label: 'Not specified' },
  { value: 'FREQUENTLY_USED', label: '-- Frequently used --', disabled: true },
  ...COUNTRIES.filter((c) => c.prioritized),
  { value: 'ALL', label: '-- All countries --', disabled: true },
  ...COUNTRIES.filter((c) => !c.prioritized),
];

const genderOptions = [{ value: '', label: 'Select gender' }, ...GENDERS];

const FilterValueCountry: FC<FilterValueCountryProps> = ({ filter, update }) => {
  return (
    <Select
      inputSize="sm"
      className="bg-opacity-60 focus:bg-opacity-100 truncate"
      value={filter.value}
      options={countryOptions}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        update(filter, { ...filter, value: e.target.value as CountryFilterValue })
      }
      fullWidth
    />
  );
};

const FilterValueNickname: FC<FilterValueNicknameProps> = ({ filter, update }) => {
  return (
    <Input
      inputSize="sm"
      className="bg-opacity-60 focus:bg-opacity-100"
      maxLength={255}
      value={filter.value}
      onChange={(e) => update(filter, { ...filter, value: e.target.value })}
      fullWidth
    />
  );
};

const FilterValueGender: FC<FilterValueGenderProps> = ({ filter, update }) => {
  return (
    <Select
      inputSize="sm"
      className="bg-opacity-60 focus:bg-opacity-100 truncate"
      value={filter.value}
      options={genderOptions}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        update(filter, { ...filter, value: e.target.value as GenderFilterValue })
      }
      fullWidth
    />
  );
};

const FilterValueAge: FC<FilterValueAgeProps> = ({ filter, update }) => {
  return (
    <div className="flex items-center">
      <Input
        type="number"
        inputSize="sm"
        className="bg-opacity-60 focus:bg-opacity-100"
        maxLength={3}
        min={MIN_AGE}
        max={MAX_AGE}
        value={filter.value[0]}
        onChange={(e) =>
          update(filter, { ...filter, value: [e.target.value as AgeFilterValue, filter.value[1]] })
        }
        fullWidth
      />
      <span className="px-1 text-sm text-gray-500">to</span>
      <Input
        type="number"
        inputSize="sm"
        className="bg-opacity-60 focus:bg-opacity-100"
        maxLength={3}
        min={MIN_AGE}
        max={MAX_AGE}
        value={filter.value[1]}
        onChange={(e) =>
          update(filter, { ...filter, value: [filter.value[0], e.target.value as AgeFilterValue] })
        }
        fullWidth
      />
    </div>
  );
};

const FilterValue: FC<FilterValueProps> = ({ filter, ...rest }) => {
  switch (filter.property) {
    case 'country':
      return <FilterValueCountry filter={filter} {...rest} />;
    case 'nickname':
      return <FilterValueNickname filter={filter} {...rest} />;
    case 'gender':
      return <FilterValueGender filter={filter} {...rest} />;
    case 'age':
      return <FilterValueAge filter={filter} {...rest} />;
  }
};

const FilterItem: FC<FilterItemProps> = ({ isOpen = false, filter, update, remove }) => {
  const updateFilterType = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const property = e.target.value as UserFilterProperty;

      switch (property) {
        case 'country':
          update(filter, { property, value: '' });
          break;
        case 'nickname':
          update(filter, { property, value: '' });
          break;
        case 'gender':
          update(filter, { property, value: '' });
          break;
        case 'age':
          update(filter, { property, value: ['', ''] });
          break;
      }
    },
    [filter, update]
  );

  // TODO animate this show/hide with react-spring
  // TODO maybe set a max height and scroll
  return (
    <div className="flex items-center px-3 mb-2">
      <div className="flex-shrink-0">
        <Select
          inputSize="sm"
          className="bg-opacity-60 focus:bg-opacity-100"
          options={filterTypeOptions}
          onChange={updateFilterType}
        />
      </div>
      <div className="ml-2 flex-1">
        <FilterValue filter={filter} update={update} />
      </div>
      <div className="ml-1 flex-shrink-0">
        <Button variant="link" size="sm" title="Remove filter" onClick={() => remove(filter)}>
          <Icon name="trash-can" size="sm" className="inline-block" title="Remove filter" />
        </Button>
      </div>
    </div>
  );
};

export default FilterItem;
