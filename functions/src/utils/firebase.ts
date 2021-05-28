import * as admin from 'firebase-admin';

import { DB_NAME_DEVELOPMENT, DB_NAME_PRODUCTION } from './constants';

export const setupApp = (env: 'production' | 'development'): admin.app.App => {
  // TODO make this better - store db URLs in firebase configs
  const app = admin.initializeApp({
    ...JSON.parse(process.env.FIREBASE_CONFIG ?? '{}'),
    databaseURL:
      env === 'production'
        ? `https://${DB_NAME_PRODUCTION}.firebaseio.com/`
        : `https://${DB_NAME_DEVELOPMENT}.firebaseio.com/`,
  });

  return app;
};
