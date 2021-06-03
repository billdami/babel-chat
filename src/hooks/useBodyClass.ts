import { useLayoutEffect } from 'react';

import usePrevious from './usePrevious';

const useBodyClass = (className: string, applyToDocument: boolean = false) => {
  const prevClassName = usePrevious(className);

  useLayoutEffect(() => {
    if (prevClassName !== className) {
      document.body.classList.remove(prevClassName);

      if (applyToDocument) {
        document.documentElement?.classList.remove(prevClassName);
      }
    }

    document.body.classList.add(className);

    if (applyToDocument) {
      document.documentElement?.classList.add(prevClassName);
    }

    return () => {
      document.body.classList.remove(className);
      if (applyToDocument) {
        document.documentElement?.classList.remove(prevClassName);
      }
    };
  }, [prevClassName, className, applyToDocument]);
};

export default useBodyClass;
