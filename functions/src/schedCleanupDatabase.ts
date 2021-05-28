import * as functions from 'firebase-functions';

import { cleanupDatabase } from './utils/cleanup';

const funcSchedCleanupDatabase = (
  env: 'production' | 'development'
): functions.CloudFunction<unknown> =>
  functions.pubsub.schedule('every 1 hours').onRun(async () => {
    await cleanupDatabase(env);
    console.log('database cleanup completed.');
    return null;
  });

export default funcSchedCleanupDatabase;
