import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';

import firebase from 'firebase/app';

export const getFirebaseTimestamp = () => firebase.database.ServerValue.TIMESTAMP;
