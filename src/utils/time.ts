import { STATUS_THRESHOLD_AWAY, STATUS_THRESHOLD_IDLE } from '../constants/user';
import { Status } from '../types/user';

export const getStatus = (timeDiff?: number | null) => {
  const absDiff = timeDiff ? Math.abs(timeDiff) : timeDiff;
  if (!absDiff) {
    return Status.OFFLINE;
  } else if (absDiff < STATUS_THRESHOLD_IDLE) {
    return Status.ACTIVE;
  } else if (absDiff >= STATUS_THRESHOLD_IDLE && absDiff < STATUS_THRESHOLD_AWAY) {
    return Status.IDLE;
  } else {
    return Status.AWAY;
  }
};
