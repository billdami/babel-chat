import React, { FC } from 'react';

import useAuth from '../../../hooks/useAuth';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const auth = useAuth();

  return (
    <div className="Index p-4">
      <h2 className="text-lg font-bold">Welcome to babel chat!</h2>
      <p>
        Logged in as{' '}
        {!!auth.userRecord && (
          <>
            <span className="font-bold">{auth.userRecord.nickname}</span>
            <span className="text-gray-400 tracking-tighter">#{auth.userRecord.uuid}</span>
          </>
        )}
      </p>
      <p>[TODO] main page content</p>
    </div>
  );
};

export default Index;
