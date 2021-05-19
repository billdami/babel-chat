import React, { FC } from 'react';

import UsersList from '../../components/UsersList';
import useAuth from '../../hooks/useAuth';

interface MainListProps {}

const Main: FC<MainListProps> = () => {
  const auth = useAuth();

  return (
    <div className="Main">
      {!!auth.userRecord && (
        <>
          <UsersList />
          <p>
            Logged in as <span className="font-bold">{auth.userRecord.nickname}</span>
            <span className="text-gray-400 tracking-tighter">#{auth.userRecord.uuid}</span>
          </p>
          <button
            type="button"
            className="text-center font-bold text-white bg-green-400 rounded-sm px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={auth.signOut}
            disabled={auth.isLoading}
          >
            {auth.isLoading ? 'Signing out...' : 'Sign out'}
          </button>
        </>
      )}
    </div>
  );
};

export default Main;
