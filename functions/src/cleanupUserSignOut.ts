import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { CloudFunction } from 'firebase-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

import { DB_NAME_DEVELOPMENT, DB_NAME_PRODUCTION } from './constants';

const funcCleanupUserSignOut = (env: 'production' | 'development'): CloudFunction<DataSnapshot> =>
  functions.database
    // TODO make this better - store db URLs in firebase configs
    .instance(env === 'production' ? DB_NAME_PRODUCTION : DB_NAME_DEVELOPMENT)
    .ref('/users/{userId}')
    .onDelete(
      async (snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
        const userId: string = context.params.userId;
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

        // when a user is deleted:
        const operations = [];

        // ensure the associated user_uuids is deleted
        operations.push(
          db
            .ref('user_uuids')
            .orderByValue()
            .equalTo(userId)
            .get()
            .then((snapshots) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const deletes: Promise<any>[] = [];
              snapshots.forEach((snapshot) => {
                deletes.push(snapshot.ref.remove());
              });
              return deletes;
            })
            .catch(() => {})
        );

        // delete /chats/{userId}
        operations.push(
          db
            .ref(`chats/${userId}`)
            .remove()
            .catch(() => {})
        );

        // delete /user_ips/{userId}
        // TODO enable once the collection exists
        // operations.push(
        //   db
        //     .ref(`user_ips/${userId}`)
        //     .remove()
        //     .catch(() => {})
        // );

        // delete /user_blocks/{userId}
        // TODO enable once the collection exists
        // operations.push(
        //   db
        //     .ref(`user_blocks/${userId}`)
        //     .remove()
        //     .catch(() => {})
        // );

        // delete /user_spam_reports/{userId}
        // TODO enable once the collection exists
        // operations.push(
        //   db
        //     .ref(`user_spam_reports/${userId}`)
        //     .remove()
        //     .catch(() => {})
        // );

        // delete /spam_reports/{userId}
        // TODO enable once the collection exists
        // operations.push(
        //   db
        //     .ref(`spam_reports/${userId}`)
        //     .remove()
        //     .catch(() => {})
        // );

        return Promise.all(operations).then(deleteAppInstance);
      }
    );

export default funcCleanupUserSignOut;
