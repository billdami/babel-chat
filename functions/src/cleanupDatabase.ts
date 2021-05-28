import * as functions from 'firebase-functions';

import { HttpsFunction } from 'firebase-functions';
import { cleanupDatabase } from './utils/cleanup';

const funcCleanupDatabase = (env: 'production' | 'development'): HttpsFunction =>
  functions.https.onRequest(
    async (req: functions.https.Request, res: functions.Response<string>) => {
      await cleanupDatabase(env);
      res.status(200).send('database cleanup completed.');
    }
  );

export default funcCleanupDatabase;
