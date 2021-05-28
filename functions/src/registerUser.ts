import * as functions from 'firebase-functions';

import { setupApp } from './utils/firebase';

// TODO [future] remove origin: true, or allow only specific hosts if possible
// @see https://github.com/expressjs/cors#configuration-options
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')({ origin: true });

const funcRegisterUser = (env: 'production' | 'development'): functions.HttpsFunction =>
  functions.https.onRequest(
    async (req: functions.https.Request, res: functions.Response<{ msg: string }>) => {
      cors(req, res, async () => {
        const app = setupApp(env);
        const db = app.database();
        const deleteAppInstance = () => app.delete().catch(() => {});

        const ip = req.ip;
        const userId = req.body?.userId ? `${req.body?.userId}` : null;

        functions.logger.info(`registerUser request (ip: ${ip})`);

        if (req.method !== 'POST') {
          await deleteAppInstance();
          functions.logger.error(`non-post request encountered (ip: ${ip})`);
          res.status(400).json({ msg: 'request must be a POST' });
          return;
        }

        if (!ip || !userId) {
          await deleteAppInstance();
          functions.logger.error(
            `request did not include an ip address or user id (ip: ${ip}, user id: ${userId})`
          );
          res.status(400).json({ msg: 'invalid request' });
          return;
        }

        try {
          await db.ref(`user_ips/${userId}`).set(ip);
          await deleteAppInstance();
          functions.logger.info(`user registration succeeded (ip: ${ip})`);
          res.status(200).json({ msg: 'user registration succeeded' });
        } catch (err) {
          await deleteAppInstance();
          functions.logger.error(`user registration failed (ip: ${ip})`);
          res.status(400).send({ msg: 'user registration failed' });
        }
      });
    }
  );

export default funcRegisterUser;
