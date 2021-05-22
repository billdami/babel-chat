import { Age, Gender } from '../../types/user';
import { Link, useHistory } from 'react-router-dom';
import {
  MAX_AGE,
  MAX_NICKNAME_LEN,
  MIN_AGE,
  MIN_NICKNAME_LEN,
  UNSPECIFIED,
} from '../../constants/user';
import React, { FC, FormEvent, useCallback, useMemo, useState } from 'react';

import Button from '../../components/Button';
import { COUNTRIES } from '../../constants/countries';
import Checkbox from '../../components/Checkbox';
import { Country } from '../../types/country';
import Input from '../../components/Input';
import Radio from '../../components/Radio';
import Select from '../../components/Select';
import useAuth from '../../hooks/useAuth';

interface SignInListProps {}

const ageOptions = [
  { value: UNSPECIFIED, label: 'Prefer not to say' },
  ...Array.from(new Array(MAX_AGE - MIN_AGE + 1)).map((v, i) => ({
    value: `${MIN_AGE + i}`,
    label: `${MIN_AGE + i}`,
  })),
];

const SignIn: FC<SignInListProps> = () => {
  const auth = useAuth();
  const history = useHistory();

  const [nickname, setNickname] = useState<string>('');
  const [country, setCountry] = useState<Country>(Country.UNSPECIFIED);
  const [age, setAge] = useState<Age>(UNSPECIFIED);
  const [gender, setGender] = useState<Gender>(Gender.UNSPECIFIED);
  const [agreedToToS, setAgreedToToS] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const isFormValid = useMemo<boolean>(
    () =>
      (nickname?.trim().length === 0 ||
        (nickname?.trim().length >= MIN_NICKNAME_LEN &&
          nickname?.trim().length <= MAX_NICKNAME_LEN)) &&
      agreedToToS,
    [nickname, agreedToToS]
  );

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!isFormValid) {
        return;
      }

      try {
        await auth.signIn({
          nickname: nickname?.trim(),
          country,
          age,
          gender,
          agreedToToS,
        });

        history.push('/main');
      } catch (err) {
        setSubmitError(err);
      }
    },
    [auth, history, isFormValid, nickname, country, age, gender, agreedToToS]
  );

  return (
    <div className="mx-auto my-auto p-4">
      <div className="w-full sm:w-116">
        <h1 className="text-3xl md:text-4xl mt-4 md:mt-0 font-extrabold text-gray-500 mb-1">
          babel chat
        </h1>
        <h2 className="text-sm md:text-lg text-gray-500 mb-4 md:mb-6">
          Meet and chat with people from around the world.
        </h2>
        <form onSubmit={onSubmit} className="p-4 md:p-6 bg-white rounded-sm text-gray-700">
          <p className="mb-4 md:mb-6">
            babel chat is free and completely anonymous. If you’d like, you can provide some basic
            info below, but it is <span className="font-bold">100% optional.</span>
          </p>

          {/* TODO create <FormControl> */}
          <div className="mb-3">
            <label htmlFor="signup-nickname" className="block mb-2 font-bold">
              Nickname
            </label>
            <Input
              type="text"
              placeholder="Leave blank for a random nickname"
              id="signup-nickname"
              autoComplete="nickname"
              maxLength={MAX_NICKNAME_LEN}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              fullWidth
            />
            {/* TODO error validation message/styles */}
          </div>

          <div className="mb-3">
            <label htmlFor="signup-country" className="block mb-2 font-bold">
              Country
            </label>
            <Select
              id="signup-country"
              value={country}
              options={COUNTRIES}
              onChange={(e) => setCountry(e.target.value as Country)}
              fullWidth
            />
          </div>

          <div className="mb-3">
            <label htmlFor="signup-age" className="block mb-2 font-bold">
              Age
            </label>
            <Select
              id="signup-age"
              value={`${age}`}
              options={ageOptions}
              onChange={(e) =>
                setAge(e.target.value !== UNSPECIFIED ? Number(e.target.value) : UNSPECIFIED)
              }
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 font-bold">Gender</label>
            <div className="flex">
              <Radio
                className="mr-3"
                label="Unspecified"
                name="gender"
                id={`gender-${Gender.UNSPECIFIED}`}
                value={Gender.UNSPECIFIED}
                checked={gender === Gender.UNSPECIFIED}
                onChange={(e) => setGender(e.target.value as Gender)}
              />
              <Radio
                className="mr-3"
                label="Female"
                name="gender"
                id={`gender-${Gender.FEMALE}`}
                value={Gender.FEMALE}
                checked={gender === Gender.FEMALE}
                onChange={(e) => setGender(e.target.value as Gender)}
              />
              <Radio
                className="mr-3"
                label="Male"
                name="gender"
                id={`gender-${Gender.MALE}`}
                value={Gender.MALE}
                checked={gender === Gender.MALE}
                onChange={(e) => setGender(e.target.value as Gender)}
              />
            </div>
          </div>

          <Checkbox
            type="checkbox"
            id="agreed-to-tos"
            className="my-6"
            checked={agreedToToS}
            onChange={(e) => setAgreedToToS(e.target.checked)}
          >
            I am over 18 and agree to the{' '}
            <Link
              to="/terms-of-service"
              target="_blank"
              className="text-green-500 rounded hover:underline hover:text-green-600 ring-green-300 focus:outline-none focus:ring-4 focus:ring-opacity-50"
            >
              terms of service
            </Link>
          </Checkbox>

          <Button type="submit" size="lg" disabled={!isFormValid || auth.isLoading} fullWidth>
            {auth.isLoading ? 'Signing in...' : 'Start chatting'}
          </Button>
          {/* TODO better error handling */}
          {!!submitError && (
            <div className="text-xs text-red-500 mt-2">
              Sorry, an error ocurred while attempting to sign in.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
