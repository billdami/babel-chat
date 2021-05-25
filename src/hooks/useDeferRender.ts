import { useEffect, useState } from 'react';

const useDeferRender = (_shouldRender: boolean = false, timeout: number = 250): boolean => {
  const [shouldRender, setShouldRender] = useState<boolean>(_shouldRender);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return shouldRender;
};

export default useDeferRender;
