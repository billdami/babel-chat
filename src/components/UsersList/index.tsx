import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';
import React, { FC } from 'react';
import { useListVals } from 'react-firebase-hooks/database';

const db = firebase.database();
const usersRef = db.ref('users');

// TODO reorganize types
interface User {
  id: string;
  ref: string;
  username: string;
  email: string;
}

interface UsersListProps {}

const UsersList: FC<UsersListProps> = () => {
  const [users, isLoading /*error*/] = useListVals<User>(usersRef, { keyField: 'id', refField: 'ref' });

  return (
    <div className="UsersList">
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            <div>{user.username}</div>
            <div>{user.email}</div>
          </li>
        ))}
        {isLoading && <div>Loading&hellip;</div>}
      </ul>
    </div>
  );
};

export default UsersList;
