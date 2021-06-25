export const getMessageListId = (userOneId?: string, userTwoId?: string): string | null =>
  userOneId && userTwoId
    ? [userOneId, userTwoId].sort((a, b) => a.localeCompare(b)).join('_')
    : null;
