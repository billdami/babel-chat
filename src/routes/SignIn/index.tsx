import React, { FC } from 'react';

interface SignInListProps {}

const SignIn: FC<SignInListProps> = () => {
  return (
    <div className="mx-auto my-auto p-4">
      <div className="w-full sm:w-116">
        <h1 className="text-5xl font-extrabold text-gray-500 mb-3">babel chat</h1>
        <h2 className="text-xl text-gray-500 mb-6">Meet and chat with people from around the world.</h2>
        <div className="p-6 bg-white rounded-sm text-gray-700">
          babel chat is free and completely anonymous. If you’d like, you can provide some basic info below, but it is{' '}
          <span className="font-bold">100% optional.</span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
