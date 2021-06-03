import { useState, useEffect } from 'react';

// TODO replace with https://github.com/xnimorz/use-debounce
export default function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time
      // useEffect is re-called. useEffect will only be re-called
      // if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is
      // changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's
      // search box, we don't want the debouncedValue to update until
      // they've stopped typing for more than 500ms.
      return () => clearTimeout(handler);
    },
    // Only re-execute effect if value or delay changes
    [value, delay]
  );

  return debouncedValue;
}
