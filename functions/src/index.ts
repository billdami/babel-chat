import funcCleanupDatabase from './cleanupDatabase';
import funcCleanupUserSignOut from './cleanupUserSignOut';
import funcSchedCleanupDatabase from './schedCleanupDatabase';
import funcValidateCaptcha from './validateCaptcha';

/**
 * @see https://firebase.google.com/docs/functions/typescript
 */

export const productionCleanupUserSignOut = funcCleanupUserSignOut('production');
export const developmentCleanupUserSignOut = funcCleanupUserSignOut('development');
export const productionCleanupDatabase = funcCleanupDatabase('production');
export const developmentCleanupDatabase = funcCleanupDatabase('development');
export const productionSchedCleanupDatabase = funcSchedCleanupDatabase('production');
export const developmentSchedCleanupDatabase = funcSchedCleanupDatabase('development');
export const validateCaptcha = funcValidateCaptcha;
