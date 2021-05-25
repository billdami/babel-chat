import cn from 'classnames';
import React, { FC, useMemo } from 'react';

import { COUNTRIES } from '../../constants/countries';
import { GENDERS, UNSPECIFIED } from '../../constants/user';
import { Country, CountryOption } from '../../types/country';
import { Gender, GenderOption, User } from '../../types/user';

interface UserDetailsProps {
  className?: string;
  user?: User;
}

const UserDetails: FC<UserDetailsProps> = ({ className = '', user }) => {
  const gender = useMemo<GenderOption | undefined>(
    () => GENDERS.find((g) => g.value === user?.gender),
    [user]
  );

  const country = useMemo<CountryOption | undefined>(
    () => COUNTRIES.find((c) => c.value === user?.country),
    [user]
  );

  const hasAge = user?.age !== UNSPECIFIED;
  const hasGender = gender?.value !== UNSPECIFIED;
  const hasCountry = country?.value !== UNSPECIFIED;
  const hasAgeOrGender = hasAge || hasGender;

  return (
    <h3 className={cn('truncate', className)}>
      {user?.age === UNSPECIFIED &&
      user?.gender === Gender.UNSPECIFIED &&
      user?.country === Country.UNSPECIFIED ? (
        <span className="italic">Anonymous</span>
      ) : (
        <>
          {hasAge && `${user?.age}yr old`}
          {hasGender && `${hasAge ? ` ${gender?.label.toLowerCase()}` : gender?.label}`}
          {hasAgeOrGender && hasCountry && ', '}
          {country?.value !== UNSPECIFIED && country?.label}
        </>
      )}
    </h3>
  );
};

export default UserDetails;
