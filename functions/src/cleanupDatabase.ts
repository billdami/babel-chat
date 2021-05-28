import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { HttpsFunction } from 'firebase-functions';

import { DB_NAME_DEVELOPMENT, DB_NAME_PRODUCTION } from './constants';

const funcCleanupDatabase = (env: 'production' | 'development'): HttpsFunction =>
  functions.https.onRequest(
    async (req: functions.https.Request, res: functions.Response<string>) => {
      // TODO make this better - store db URLs in firebase configs
      const app = admin.initializeApp({
        ...JSON.parse(process.env.FIREBASE_CONFIG ?? '{}'),
        databaseURL:
          env === 'production'
            ? `https://${DB_NAME_PRODUCTION}.firebaseio.com/`
            : `https://${DB_NAME_DEVELOPMENT}.firebaseio.com/`,
      });
      const db = app.database();
      const deleteAppInstance = () => app.delete().catch(() => {});

      // delete any /users record who dateLastActive >= 8hrs
      try {
        const cutoffTime = new Date().getTime() - 1000 * 60 * 60 * 8;
        const staleUsers = await db
          .ref('users')
          .orderByChild('dateLastActive')
          .endAt(cutoffTime)
          .get();
        const userDeletes: Promise<void>[] = [];
        staleUsers.forEach((user) => {
          userDeletes.push(user.ref.remove());
        });
        await Promise.all(userDeletes);
        functions.logger.info('deleted stale users', userDeletes.length);
      } catch (err) {
        functions.logger.error('users delete failed', err, { structuredData: true });
      }

      // delete any /user_uuids whose value does not have a matching /users key
      try {
        const uuids = await db.ref('user_uuids').get();
        const uuidDeletes: Promise<void>[] = [];
        uuids.forEach((uuid) => {
          if (uuid.exists()) {
            uuidDeletes.push(
              db
                .ref(`users/${uuid.val()}`)
                .get()
                .then((user) => (!user.exists() ? uuid.ref.remove() : null))
                .catch(() => {})
            );
          }
        });
        await Promise.all(uuidDeletes);
        functions.logger.info('deleted orphaned user_uuids', uuidDeletes.length);
      } catch (err) {
        functions.logger.error('user_uuids delete failed', err, { structuredData: true });
      }

      // TODO MIGHT NOT BE NEEDED (cleanupUserSignOut trigger handles this)
      // delete any /chats whose key does not have a matching /users key
      // const chats = await db.ref('chats').get();
      // const chatDeletes: Promise<void>[] = [];
      // chats.forEach((chat) => {
      //   if (chat.exists()) {
      //     chatDeletes.push(
      //       db
      //         .ref(`users/${chat.key}`)
      //         .get()
      //         .then((user) => (!user.exists() ? chat.ref.remove() : null))
      //         .catch(() => {})
      //     );
      //   }
      // });
      // await Promise.all(chatDeletes);

      // delete any /chat_messages whose split key (on "_") of
      // 2 user keys does not a matching /users key for BOTH
      try {
        const chatMessages = await db.ref('chat_messages').get();
        const chatMessageDeletes: Promise<void>[] = [];
        chatMessages.forEach((chatMsgs) => {
          if (chatMsgs.exists()) {
            const keys = chatMsgs.key?.split('_');
            if (keys?.length === 2) {
              chatMessageDeletes.push(
                Promise.all([db.ref(`users/${keys[0]}`).get(), db.ref(`users/${keys[1]}`).get()])
                  .then(([user1, user2]) =>
                    !user1.exists() && !user2.exists() ? chatMsgs.ref.remove() : null
                  )
                  .catch(() => {})
              );
            }
          }
        });
        await Promise.all(chatMessageDeletes);
        functions.logger.info('deleted orphaned chat messages', chatMessageDeletes.length);
      } catch (err) {
        functions.logger.error('chat_messsages delete failed', err, { structuredData: true });
      }

      // TODO MIGHT NOT BE NEEDED (cleanupUserSignOut trigger handles this)
      // delete any /user_ips whose key does not have a matching /users key
      // TODO enable once the collection exists
      // const userIps = await db.ref('user_ips').get();
      // const userIpDeletes: Promise<void>[] = [];
      // userIps.forEach((userIp) => {
      //   if (userIp.exists()) {
      //     userIpDeletes.push(
      //       db
      //         .ref(`users/${userIp.key}`)
      //         .get()
      //         .then((user) => (!user.exists() ? userIp.ref.remove() : null))
      //         .catch(() => {})
      //     );
      //   }
      // });
      // await Promise.all(userIpDeletes);

      // TODO MIGHT NOT BE NEEDED (cleanupUserSignOut trigger handles this)
      // delete any /user_blocks whose key does not have a matching /users key
      // TODO enable once the collection exists
      // const userBlocks = await db.ref('user_blocks').get();
      // const userBlockDeletes: Promise<void>[] = [];
      // userBlocks.forEach((userBlock) => {
      //   if (userBlock.exists()) {
      //     userBlockDeletes.push(
      //       db
      //         .ref(`users/${userBlock.key}`)
      //         .get()
      //         .then((user) => (!user.exists() ? userBlock.ref.remove() : null))
      //         .catch(() => {})
      //     );
      //   }
      // });
      // await Promise.all(userBlockDeletes);

      // TODO MIGHT NOT BE NEEDED (cleanupUserSignOut trigger handles this)
      // delete any /user_spam_reports whose key does not have a matching /users key
      // TODO enable once the collection exists
      // const userSpamReports = await db.ref('user_spam_reports').get();
      // const userSpamReportDeletes: Promise<void>[] = [];
      // userSpamReports.forEach((userSpamReport) => {
      //   if (userSpamReport.exists()) {
      //     userSpamReportDeletes.push(
      //       db
      //         .ref(`users/${userSpamReport.key}`)
      //         .get()
      //         .then((user) => (!user.exists() ? userSpamReport.ref.remove() : null))
      //         .catch(() => {})
      //     );
      //   }
      // });
      // await Promise.all(userSpamReportDeletes);

      // delete any /spam_reports whose key does not have a matching /users key
      // TODO enable once the collection exists
      // const spamReports = await db.ref('spam_reports').get();
      // const spamReportDeletes: Promise<void>[] = [];
      // spamReports.forEach((spamReport) => {
      //   if (spamReport.exists()) {
      //     spamReportDeletes.push(
      //       db
      //         .ref(`users/${spamReport.key}`)
      //         .get()
      //         .then((user) => (!user.exists() ? spamReport.ref.remove() : null))
      //         .catch(() => {})
      //     );
      //   }
      // });
      // await Promise.all(spamReportDeletes);

      // TODO [future] delete old/orphaned firebase anonymous sessions
      // that no longer have an associated user

      await deleteAppInstance();
      res.status(200).send('database cleanup completed.');
    }
  );

export default funcCleanupDatabase;
