import React, { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface SignInListProps {}

const MIN_AGE = 18;
const MAX_AGE = 120;

const SignIn: FC<SignInListProps> = () => {
  const ageOptions = useMemo<string[]>(
    () => Array.from(new Array(MAX_AGE - MIN_AGE + 1)).map((v, i) => `${MIN_AGE + i}`),
    []
  );

  return (
    <div className="mx-auto my-auto p-4">
      <div className="w-full sm:w-116">
        <h1 className="text-4xl font-extrabold text-gray-500 mb-3">babel chat</h1>
        <h2 className="text-lg text-gray-500 mb-6">Meet and chat with people from around the world.</h2>
        <form className="p-6 bg-white rounded-sm text-gray-700">
          <p className="mb-8">
            babel chat is free and completely anonymous. If you’d like, you can provide some basic info below, but it is{' '}
            <span className="font-bold">100% optional.</span>
          </p>
          <div className="mb-3">
            <label htmlFor="signup-nickname" className="block mb-2 font-bold">
              Nickname
            </label>
            <input
              type="text"
              className="block w-full px-3 py-2 rounded-sm border border-gray-300"
              placeholder="Leave blank for a random nickname"
              id="signup-nickname"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="signup-country" className="block mb-2 font-bold">
              Country
            </label>
            <select
              className="appearance-none block w-full px-3 py-2 rounded-sm border border-gray-300"
              id="signup-country"
            >
              <option value="">Prefer not to say</option>
              <option value="USA">United States</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="signup-age" className="block mb-2 font-bold">
              Age
            </label>
            <select
              className="appearance-none block w-full px-3 py-2 rounded-sm border border-gray-300"
              id="signup-age"
            >
              <option value="">Prefer not to say</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-2 font-bold">Gender</label>
            <label className="mr-3">
              <input type="radio" value="" name="gender" className="mr-2" checked />
              Prefer not to say
            </label>
            <label className="mr-3">
              <input type="radio" value="male" name="gender" className="mr-2" />
              Male
            </label>
            <label className="">
              <input type="radio" value="female" name="gender" className="mr-2" />
              Female
            </label>
          </div>

          <label className="block mb-6 text-sm">
            <input type="checkbox" className="mr-2" />I am over 18 years of age and agree to the{' '}
            <Link to="/terms-of-service" className="text-green-500">
              terms of service
            </Link>
          </label>

          <button
            type="submit"
            className="block w-full text-center font-bold text-white bg-green-400 rounded-sm px-5 py-3"
          >
            Start chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
