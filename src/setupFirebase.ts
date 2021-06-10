import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';

import firebase from 'firebase/app';

import { env, envVar } from './utils/env';

export const FIREBASE_CONFIG = {
  projectId: envVar('FB_PROJECT_ID'),
  appId: envVar('FB_APP_ID'),
  apiKey: envVar('FB_API_KEY'),
  authDomain: envVar('FB_AUTH_DOMAIN'),
  databaseURL: envVar('FB_DATABASE_URL'),
  storageBucket: envVar('FB_STORAGE_BUCKET'),
  messagingSenderId: envVar('FB_MESSAGING_SENDER_ID'),
  measurementId: envVar('FB_MEASUREMENT_ID'),
};

const app = firebase.initializeApp(FIREBASE_CONFIG);

export const analytics = firebase.analytics();

analytics.setAnalyticsCollectionEnabled(env() === 'production');

export default app;
