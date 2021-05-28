export const generateRandomNickname = (): string => {
  // TODO make cooler 😎
  return `Anonymous user`;
};

export const generateRandomUUID = (exclude: number[] = [], minNumDigits = 4): number => {
  // increase the min/max values if the total number of excluded values
  // have used up all the available numbers in the current range
  const totalAvail = Math.pow(10, minNumDigits) - 1;
  const numDigits = exclude.length >= totalAvail ? `${exclude.length}`.length : minNumDigits;
  const min = Math.pow(10, numDigits - 1);
  const max = Math.pow(10, numDigits) - 1;

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
