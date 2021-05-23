export const generateRandomNickname = (): string => {
  // TODO make cooler 😎
  return `Anonymous user`;
};

export const generateRandomUUID = (exclude: number[] = [], min = 1000, max = 9999): number => {
  const total = max - min;
  let i = 0;
  let uuid = Math.floor(Math.random() * (max - min + 1)) + min;

  while (exclude.indexOf(uuid) !== -1) {
    i++;
    if (uuid < max) {
      uuid++;
    } else {
      uuid = min;
    }

    if (i >= total) {
      uuid = 0;
      break;
    }
  }

  return uuid;
};
