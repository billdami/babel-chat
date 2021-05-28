import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

// TODO eventuall remove origin: true, or allow only specific hosts if possible
// @see https://github.com/expressjs/cors#configuration-options
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')({ origin: true });

const recaptchaEndpoint = 'https://recaptcha.google.com/recaptcha/api/siteverify';

const funcValidateCaptcha = functions.https.onRequest(
  async (req: functions.https.Request, res: functions.Response<string>) => {
    cors(req, res, async () => {
      const key: string = functions.config().recaptcha.secret_key;
      const token = req.body?.token ? `${req.body?.token}` : '';
      const ip = req.ip ?? '';

      functions.logger.info(`validateCaptcha request`, `token: ${token}`, `ip: ${ip}`, {
        structuredData: true,
      });

      if (req.method !== 'POST') {
        res.status(400).send('request must be a POST.');
        return;
      }

      if (!token) {
        res.status(400).send('recaptcha token not found.');
        return;
      }

      if (!key) {
        res.status(400).send('recaptcha key not found.');
        return;
      }

      try {
        const params = new URLSearchParams({
          secret: key,
          response: token,
          remoteip: ip,
        });

        const recaptchaRes = await fetch(recaptchaEndpoint, { method: 'POST', body: params });
        const result = await recaptchaRes.json();

        if (result.success) {
          functions.logger.info(
            `validateCaptcha request - successs`,
            `token: ${token}`,
            JSON.stringify(result),
            { structuredData: true }
          );

          res.status(200).send('recaptcha verification success.');
        } else {
          functions.logger.info(
            `validateCaptcha request - failure`,
            `token: ${token}`,
            JSON.stringify(result),
            { structuredData: true }
          );

          res.status(400).send('recaptcha verification failed. are you a robot?');
        }
      } catch (err) {
        functions.logger.info(`validateCaptcha request - failure`, `token: ${token}`, err, {
          structuredData: true,
        });

        res.status(400).send('recaptcha request failed.');
      }
    });
  }
);

export default funcValidateCaptcha;
