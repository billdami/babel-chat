import 'firebase/database';
import 'firebase/auth';

import firebase from 'firebase/app';

export const getFirebaseTimestamp = () => firebase.database.ServerValue.TIMESTAMP;
