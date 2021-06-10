import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';

import firebase from 'firebase/app';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTracking = () => {
  const location = useLocation();
  const analytics = useRef<firebase.analytics.Analytics>(firebase.analytics());

  useEffect(() => {
    // TODO react-helmet updates the <title></title> asynchronously
    // so we need to wait until thats updated in order to log it
    // see if there is a better/safer way to accomplish this
    setTimeout(
      () =>
        analytics.current.logEvent('page_view', {
          page_location: window.location.href,
          page_path: `${location.pathname}${location.search}`,
          page_title: document.title,
        }),
      100
    );
  }, [location]);
};

export default usePageTracking;
