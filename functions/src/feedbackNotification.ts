import * as functions from 'firebase-functions';
import * as Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

import { CloudFunction } from 'firebase-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

import { DB_NAME_DEVELOPMENT, DB_NAME_PRODUCTION } from './utils/constants';
import { setupApp } from './utils/firebase';

const funcFeedbackNotification = (env: 'production' | 'development'): CloudFunction<DataSnapshot> =>
  functions.database
    // TODO make this better - store db URLs in firebase configs
    .instance(env === 'production' ? DB_NAME_PRODUCTION : DB_NAME_DEVELOPMENT)
    .ref('/feedback_messages/{feedback_message_id}')
    .onCreate(async (snapshot: functions.database.DataSnapshot) => {
      const app = setupApp(env);
      const config = functions.config();
      const deleteAppInstance = () => app.delete().catch(() => {});

      try {
        const feedbackMessage = snapshot.val();
        const user = feedbackMessage.user;
        const transporter: Mail = nodemailer.createTransport({
          host: config.mail?.host,
          port: Number(config.mail?.port),
          secure: false,
          auth: {
            type: 'LOGIN',
            user: config.mail?.user,
            pass: config.mail?.password,
          },
        });

        await transporter.sendMail({
          to: config.mail?.to,
          from: config.mail?.to,
          subject: `[FEEDBACK] babel chat - ${user?.nickname}#${user?.uuid}`,
          text: `New feedback babelchat.online message received:\n\n

---------------\n
Email: ${feedbackMessage.email}\n\n
Nickname: ${user?.nickname}#${user?.uuid}\n
Country: ${user?.country}\n
Age: ${user?.age}\n
Gender: ${user?.gender}\n
---------------\n

Message:\n\n

${feedbackMessage.message}\n\n

---------------\n
Additional Info:\n\n

User ID: ${user?.id}\n
Browser data:\n ${JSON.stringify(feedbackMessage.browser, undefined, 2)}`,
        });
      } catch (err) {
        functions.logger.error('sending feedback email notification failed', err);
      }

      return deleteAppInstance();
    });

export default funcFeedbackNotification;
