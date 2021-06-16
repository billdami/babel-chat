export const lsGet = <T>(key: string): T | null => {
  try {
    return localStorage.getItem(key) as unknown as T;
  } catch (err) {
    //localStorage getItem() may fail if access is blocked/disabled
    // for the site by the browser
    return null;
  }
};

export const lsSet = (key: string, value: string): void => {
  try {
    return localStorage.setItem(key, value);
  } catch (err) {
    //localStorage setItem() may fail if access is blocked/disabled
    // for the site by the browser or the storage quota is exceeded
    return;
  }
};
