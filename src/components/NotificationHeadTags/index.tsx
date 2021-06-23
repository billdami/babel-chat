import React, { FC, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import useNotifications from '../../hooks/useNotifications';
import { DEFAULT_TITLE } from '../../constants/app';

interface NotificationHeadTagsProps {
  title?: string;
}

const NotificationHeadTags: FC<NotificationHeadTagsProps> = ({ title = DEFAULT_TITLE }) => {
  const { numUnread } = useNotifications();
  const iconPostfix = useMemo(() => `${numUnread}-${new Date().getTime()}`, [numUnread]);

  // TODO [BUG] (CHROME ONLY) title/favicon don't update if the tab is inactive
  return (
    <Helmet>
      <title>
        {!!numUnread ? '[UNREAD MESSAGES] ' : ''}
        {title}
      </title>
      <link
        rel="icon"
        href={`${process.env.PUBLIC_URL}/img/${
          !!numUnread ? 'favicon-badge-32x32.png' : 'favicon-32x32.png'
        }?t=${iconPostfix}`}
      />
    </Helmet>
  );
};

export default NotificationHeadTags;
