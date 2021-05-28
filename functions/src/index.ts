import funcCleanupDatabase from './cleanupDatabase';
import funcCleanupUserSignOut from './cleanupUserSignOut';
import funcValidateCaptcha from './validateCaptcha';

/**
 * @see https://firebase.google.com/docs/functions/typescript
 */

export const production_cleanupUserSignOut = funcCleanupUserSignOut('production');
export const development_cleanupUserSignOut = funcCleanupUserSignOut('development');
export const production_cleanupDatabase = funcCleanupDatabase('production');
export const development_cleanupDatabase = funcCleanupDatabase('development');
export const validateCaptcha = funcValidateCaptcha;
