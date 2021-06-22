import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import useNotifications from '../../hooks/useNotifications';
import { DEFAULT_TITLE } from '../../constants/app';

interface NotificationHeadTagsProps {
  title?: string;
}

const NotificationHeadTags: FC<NotificationHeadTagsProps> = ({ title = DEFAULT_TITLE }) => {
  const { numUnread } = useNotifications();

  return (
    <Helmet>
      <title>{!!numUnread ? '[UNREAD MESSAGES] ' : ''}{title}</title>
    </Helmet>
  );
};

export default NotificationHeadTags;
