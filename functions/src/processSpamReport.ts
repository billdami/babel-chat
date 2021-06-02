import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { CloudFunction } from 'firebase-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

import {
  DB_NAME_DEVELOPMENT,
  DB_NAME_PRODUCTION,
  SPAM_REPORT_COUNT_THRESHOLD,
  SPAM_REPORT_DECAY_THRESHOLD,
} from './utils/constants';
import { setupApp } from './utils/firebase';

const funcProcessSpamReport = (env: 'production' | 'development'): CloudFunction<DataSnapshot> =>
  functions.database
    // TODO make this better - store db URLs in firebase configs
    .instance(env === 'production' ? DB_NAME_PRODUCTION : DB_NAME_DEVELOPMENT)
    .ref('/user_spam_reports/{reporterUserId}/{spamUserId}')
    .onCreate(
      async (snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
        const app = setupApp(env);
        const db = app.database();
        const deleteAppInstance = () => app.delete().catch(() => {});

        const reporterUserId: string = context.params.reporterUserId;
        const spamUserId: string = context.params.spamUserId;
        const currentTime = new Date().getTime();
        const serverTimestamp = admin.database.ServerValue.TIMESTAMP;

        // when a user spam report is created:
        try {
          // get the spamUser's associated ip
          const spamUserIpSnapshot = await db.ref(`user_ips/${spamUserId}`).get();

          // get the reporterUsers' associated ip
          const reporterUserIpSnapshot = await db.ref(`user_ips/${reporterUserId}`).get();

          if (!spamUserIpSnapshot.exists() || !reporterUserIpSnapshot.exists()) {
            return deleteAppInstance();
          }

          const spamUserIp: string = spamUserIpSnapshot.val();
          const reporterUserIp: string = reporterUserIpSnapshot.val();

          if (!spamUserIp?.length || !reporterUserIp?.length) {
            return deleteAppInstance();
          }

          const spamUserIpKey = spamUserIp.replace(/\./g, '_');
          const reporterUserIpKey = reporterUserIp.replace(/\./g, '_');

          // get the ip's associated spam record, if it exists
          const spamIpRef = db.ref(`spam_ips/${spamUserIpKey}`);
          let spamIpSnapshot = await spamIpRef.get();

          if (!spamIpSnapshot.exists()) {
            // if the spam record doesnt exist, create one
            await spamIpRef.set({
              dateLastReport: null,
              numReports: 0,
              numRepeatOffenses: 0,
              numBans: 0,
            });

            spamIpSnapshot = await spamIpRef.get();
          }

          // append reporter user's ip to reporterIps child list
          // TODO [future] if the reporter has already reported this user
          // dont let them report them again (to prevent abuse)
          await spamIpRef.child(`reporterIps/${reporterUserIpKey}`).set(serverTimestamp);

          let spamIpData = spamIpSnapshot.val();
          // if the time between the spam reports exceeds the threshold, reset the count
          const shouldReset =
            currentTime - spamIpData.dateLastReport >= SPAM_REPORT_DECAY_THRESHOLD;

          await spamIpRef.update({
            dateLastReport: serverTimestamp,
            numReports: shouldReset ? 1 : admin.database.ServerValue.increment(1),
          });

          spamIpSnapshot = await spamIpRef.get();
          spamIpData = spamIpSnapshot.val();

          // if the ip has hit the number of reports threshold, mark the user as a spammer
          if (spamIpData.numReports >= SPAM_REPORT_COUNT_THRESHOLD) {
            await spamIpRef.update({
              numRepeatOffenses: admin.database.ServerValue.increment(1),
              numReports: 0,
            });

            await db.ref(`spam_users/${spamUserId}`).set({ dateConvicted: serverTimestamp });
            functions.logger.info(`user ${spamUserId} (${spamUserIp}) convicted for spamming`);
          }

          functions.logger.info(
            // eslint-disable-next-line
            `processed spam report from user ${reporterUserId} (${reporterUserIp}) for ${spamUserId} (${spamUserIp})`
          );

          // TODO [future] if the new numRepeatOffenses >= SPAM_REPEAT_OFFENSE_THRESHOLD:
          // add to banned_ips (expires after 24hrs+, depending on numBans)
          // delete the spammer's user (which will log them out)
        } catch (err) {
          functions.logger.error('spam report processing failed', err);
        }

        return deleteAppInstance();
      }
    );

export default funcProcessSpamReport;
