import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { setupApp } from './firebase';

export const deleteOrphanedData = async (
  db: admin.database.Database,
  collection: string,
  byValue = false
): Promise<void> => {
  try {
    const snapshots = await db.ref(collection).get();
    const deletes: Promise<void>[] = [];
    snapshots.forEach((snapshot) => {
      if (snapshot.exists()) {
        deletes.push(
          db
            .ref(`users/${byValue ? snapshot.val() : snapshot.key}`)
            .get()
            .then((user) => (!user.exists() ? snapshot.ref.remove() : null))
            .catch(() => {})
        );
      }
    });
    await Promise.all(deletes);
    functions.logger.info(`checked ${deletes.length} ${collection} for orphans`);
  } catch (err) {
    functions.logger.error(`${collection} delete failed`, err, { structuredData: true });
  }
};

export const cleanupDatabase = async (env: 'production' | 'development'): Promise<void> => {
  const app = setupApp(env);
  const db = app.database();
  const deleteAppInstance = () => app.delete().catch(() => {});

  // delete any /users record who dateLastActive >= 8hrs
  try {
    const cutoffTime = new Date().getTime() - 1000 * 60 * 60 * 8;
    const staleUsers = await db.ref('users').orderByChild('dateLastActive').endAt(cutoffTime).get();
    const userDeletes: Promise<void>[] = [];
    staleUsers.forEach((user) => {
      userDeletes.push(user.ref.remove());
    });
    await Promise.all(userDeletes);
    functions.logger.info(`deleted ${userDeletes.length} stale users`);
  } catch (err) {
    functions.logger.error('users delete failed', err, { structuredData: true });
  }

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
    functions.logger.info(`checked ${chatMessageDeletes.length} chat_messages for orphans`);
  } catch (err) {
    functions.logger.error('chat_messsages delete failed', err, { structuredData: true });
  }

  // delete any /user_uuids whose value does not have a matching /users key
  await deleteOrphanedData(db, 'user_uuids', true);

  // delete any /chats whose key does not have a matching /users key
  await deleteOrphanedData(db, 'chats');

  // delete any /user_ips whose key does not have a matching /users key
  await deleteOrphanedData(db, 'user_ips');

  // delete any /user_blocks whose key does not have a matching /users key
  await deleteOrphanedData(db, 'user_blocks');

  // delete any /user_spam_reports whose key does not have a matching /users key
  await deleteOrphanedData(db, 'user_spam_reports');

  // delete any /spam_reports whose key does not have a matching /users key
  await deleteOrphanedData(db, 'spam_reports');

  // TODO [future] delete old expired spam_users

  // TODO [future] delete old expired banned_ips

  return deleteAppInstance();
};
