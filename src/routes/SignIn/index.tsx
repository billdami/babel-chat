import React, { FC, FormEvent, useCallback, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { COUNTRIES } from '../../constants/countries';
import { MAX_AGE, MIN_AGE } from '../../constants/user';
import useAuth from '../../hooks/useAuth';
import { Country } from '../../types/country';
import { Age, Gender } from '../../types/user';

interface SignInListProps {}

const SignIn: FC<SignInListProps> = () => {
  const auth = useAuth();
  const history = useHistory();

  const [nickname, setNickname] = useState<string>('');
  const [country, setCountry] = useState<Country>(Country.UNSPECIFIED);
  const [age, setAge] = useState<Age>('UNSPECIFIED');
  const [gender, setGender] = useState<Gender>(Gender.UNSPECIFIED);
  const [agreedToToS, setAgreedToToS] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const ageOptions = useMemo<number[]>(
    () => Array.from(new Array(MAX_AGE - MIN_AGE + 1)).map((v, i) => MIN_AGE + i),
    []
  );

  const isFormValid = useMemo<boolean>(
    () => (nickname?.trim().length === 0 || nickname?.trim().length > 1) && agreedToToS,
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
        <h1 className="text-4xl font-extrabold text-gray-500 mb-3">babel chat</h1>
        <h2 className="text-lg text-gray-500 mb-6">
          Meet and chat with people from around the world.
        </h2>
        <form onSubmit={onSubmit} className="p-6 bg-white rounded-sm text-gray-700">
          <p className="mb-8">
            babel chat is free and completely anonymous. If you’d like, you can provide some basic
            info below, but it is <span className="font-bold">100% optional.</span>
          </p>

          {/* TODO create <FormControl> */}
          <div className="mb-3">
            <label htmlFor="signup-nickname" className="block mb-2 font-bold">
              Nickname
            </label>
            {/* TODO create <Input> */}
            <input
              type="text"
              className="block w-full px-3 py-2 rounded-sm border border-gray-300"
              placeholder="Leave blank for a random nickname"
              id="signup-nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {/* TODO error validation message/styles */}
          </div>

          <div className="mb-3">
            <label htmlFor="signup-country" className="block mb-2 font-bold">
              Country
            </label>
            {/* TODO create <Select> */}
            <select
              className="appearance-none block w-full px-3 py-2 rounded-sm border border-gray-300"
              id="signup-country"
              value={country}
              onChange={(e) => setCountry(e.target.value as Country)}
            >
              {COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="signup-age" className="block mb-2 font-bold">
              Age
            </label>
            <select
              className="appearance-none block w-full px-3 py-2 rounded-sm border border-gray-300"
              id="signup-age"
              value={`${age}`}
              onChange={(e) =>
                setAge(e.target.value !== 'UNSPECIFIED' ? Number(e.target.value) : 'UNSPECIFIED')
              }
            >
              <option value="UNSPECIFIED">Prefer not to say</option>
              {ageOptions.map((age) => (
                <option key={age} value={`${age}`}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-2 font-bold">Gender</label>
            {/* TODO create <Radio> */}
            <label className="mr-3">
              <input
                type="radio"
                className="mr-2"
                name="gender"
                value={Gender.UNSPECIFIED}
                checked={gender === Gender.UNSPECIFIED}
                onChange={(e) => setGender(e.target.value as Gender)}
              />
              Prefer not to say
            </label>
            <label className="mr-3">
              <input
                type="radio"
                className="mr-2"
                name="gender"
                value={Gender.FEMALE}
                checked={gender === Gender.FEMALE}
                onChange={(e) => setGender(e.target.value as Gender)}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                className="mr-2"
                name="gender"
                value={Gender.MALE}
                checked={gender === Gender.MALE}
                onChange={(e) => setGender(e.target.value as Gender)}
              />
              Male
            </label>
          </div>

          <label className="block mb-6 text-sm">
            {/* TODO create <Checkbox> */}
            <input
              type="checkbox"
              className="mr-2"
              checked={agreedToToS}
              onChange={(e) => setAgreedToToS(e.target.checked)}
            />
            I am over 18 years of age and agree to the{' '}
            <Link to="/terms-of-service" target="_blank" className="text-green-500">
              terms of service
            </Link>
          </label>

          {/* TODO Create <Button> */}
          <button
            type="submit"
            className="block w-full text-center font-bold text-white bg-green-400 rounded-sm px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFormValid || auth.isLoading}
          >
            {auth.isLoading ? 'Signing in...' : 'Start chatting'}
          </button>
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
