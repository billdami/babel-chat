import funcCleanupDatabase from './cleanupDatabase';
import funcCleanupUserSignOut from './cleanupUserSignOut';
import funcProcessSpamReport from './processSpamReport';
import funcRegisterUser from './registerUser';
import funcSchedCleanupDatabase from './schedCleanupDatabase';
import funcValidateCaptcha from './validateCaptcha';

/**
 * @see https://firebase.google.com/docs/functions/typescript
 */

// production
export const productionCleanupUserSignOut = funcCleanupUserSignOut('production');
export const productionCleanupDatabase = funcCleanupDatabase('production');
export const productionSchedCleanupDatabase = funcSchedCleanupDatabase('production');
export const productionRegisterUser = funcRegisterUser('production');
export const productionProcessSpamReport = funcProcessSpamReport('production');

// development
export const developmentCleanupUserSignOut = funcCleanupUserSignOut('development');
export const developmentCleanupDatabase = funcCleanupDatabase('development');
export const developmentSchedCleanupDatabase = funcSchedCleanupDatabase('development');
export const developmentRegisterUser = funcRegisterUser('development');
export const developmentProcessSpamReport = funcProcessSpamReport('development');

// all enviroments
export const validateCaptcha = funcValidateCaptcha;
