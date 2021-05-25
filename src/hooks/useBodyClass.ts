import { useLayoutEffect } from 'react';

import usePrevious from './usePrevious';

const useBodyClass = (className: string) => {
  const prevClassName = usePrevious(className);

  useLayoutEffect(() => {
    if (prevClassName !== className) {
      document.body.classList.remove(prevClassName);
    }

    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [prevClassName, className]);
};

export default useBodyClass;
