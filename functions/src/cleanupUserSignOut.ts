import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { CloudFunction } from 'firebase-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

import { CHAT_SYSTEM_ID, DB_NAME_DEVELOPMENT, DB_NAME_PRODUCTION } from './utils/constants';
import { setupApp } from './utils/firebase';
import { getMessageListId } from './utils/chat';

const sendSystemMessages = async (
  db: admin.database.Database,
  userId: string,
  snapshot: functions.database.DataSnapshot
) => {
  const user = snapshot.val();
  const systemMsg = {
    dateSent: admin.database.ServerValue.TIMESTAMP,
    author: CHAT_SYSTEM_ID,
    isSystem: true,
    content: `${user?.nickname ?? 'This user'} has signed out.`,
  };

  const messageUsersRef = db.ref(`chat_message_users/${userId}`);
  const messageUsers = await messageUsersRef.get();
  const operations: Promise<void | admin.database.Reference>[] = [];

  messageUsers.forEach((snapshot) => {
    if (snapshot.key) {
      const listId = getMessageListId(userId, snapshot.key);
      operations.push(
        db
          .ref(`chat_messages/${listId}`)
          .push(systemMsg)
          .catch(() => {})
      );
    }
  });

  try {
    await Promise.all(operations);
  } finally {
    messageUsersRef.remove();
  }
};

const funcCleanupUserSignOut = (env: 'production' | 'development'): CloudFunction<DataSnapshot> =>
  functions.database
    // TODO make this better - store db URLs in firebase configs
    .instance(env === 'production' ? DB_NAME_PRODUCTION : DB_NAME_DEVELOPMENT)
    .ref('/users/{userId}')
    .onDelete(
      async (snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
        const userId: string = context.params.userId;
        const app = setupApp(env);
        const db = app.database();
        const auth = admin.auth();
        const deleteAppInstance = () => app.delete().catch(() => {});

        // when a user is deleted:
        const operations = [];

        // ensure the associated session is deleted
        operations.push(auth.deleteUser(userId).catch(() => {}));

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
        operations.push(
          db
            .ref(`user_ips/${userId}`)
            .remove()
            .catch(() => {})
        );

        // delete /user_blocks/{userId}
        operations.push(
          db
            .ref(`user_blocks/${userId}`)
            .remove()
            .catch(() => {})
        );

        // delete /user_spam_reports/{userId}
        operations.push(
          db
            .ref(`user_spam_reports/${userId}`)
            .remove()
            .catch(() => {})
        );

        // delete /spam_users/{userId}
        operations.push(
          db
            .ref(`spam_users/${userId}`)
            .remove()
            .catch(() => {})
        );

        // add log out system messages on all chats with user
        operations.push(sendSystemMessages(db, userId, snapshot).catch(() => {}));

        return Promise.all(operations).then(deleteAppInstance);
      }
    );

export default funcCleanupUserSignOut;
